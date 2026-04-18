"""
Discord-to-GitHub Pages bridge.
Reads the latest message from a Discord channel, extracts text and images,
and pushes a JSON data file to your GitHub Pages repo via the GitHub REST API.
Runs as a long-lived loop with error recovery.
 
Requirements:
    pip install requests
 
Environment variables (or edit the config below):
    DISCORD_BOT_TOKEN   - your Discord bot token
    DISCORD_CHANNEL_ID  - source channel ID (where images are posted)
    DISCORD_LOG_CHANNEL - log channel ID (where push confirmations go)
    GITHUB_PAT          - fine-grained personal access token (Contents read/write)
    GITHUB_REPO         - e.g. "username/repo-name"
    GITHUB_FILE_PATH    - path in repo, e.g. "data/latest.json"
    GITHUB_BRANCH       - branch to push to, e.g. "main"
"""
 
import os
import sys
import json
import base64
import time
import logging
import requests
from datetime import datetime, timezone, timedelta

# ── Config ──────────────────────────────────────────────────────────────────
DISCORD_BOT_TOKEN  = os.environ.get("DISCORD_BOT_TOKEN", "DISCORD_BOT_TOKEN")
DISCORD_CHANNEL_ID  = os.environ.get("DISCORD_CHANNEL_ID", "DISCORD_CHANNEL_ID")
DISCORD_LOG_CHANNEL = os.environ.get("DISCORD_LOG_CHANNEL", "DISCORD_LOG_CHANNEL")
GITHUB_PAT         = os.environ.get("GITHUB_PAT", "GITHUB_PAT")
GITHUB_REPO        = os.environ.get("GITHUB_REPO", "GITHUB_REPO")
GITHUB_FILE_PATH   = os.environ.get("GITHUB_FILE_PATH", "GITHUB_FILE_PATH")
GITHUB_BRANCH      = os.environ.get("GITHUB_BRANCH", "GITHUB_BRANCH")

POLL_INTERVAL       = 20        # seconds between checks
BACKOFF_BASE        = 30        # starting backoff on error
BACKOFF_MAX         = 600       # max backoff (10 min)
# ────────────────────────────────────────────────────────────────────────────

DISCORD_API = "https://discord.com/api/v10"
GITHUB_API  = "https://api.github.com"


# ── Logging ─────────────────────────────────────────────────────────────────
AEST = timezone(timedelta(hours=10))

class AESTFormatter(logging.Formatter):
    def formatTime(self, record, datefmt=None):
        dt = datetime.fromtimestamp(record.created, tz=AEST)
        return dt.strftime(datefmt or "%Y-%m-%d %H:%M:%S")

handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(AESTFormatter("%(asctime)s [%(levelname)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S"))
logging.basicConfig(level=logging.INFO, handlers=[handler])
log = logging.getLogger("discord2gh")
 
 
def discord_headers():
    return {"Authorization": f"Bot {DISCORD_BOT_TOKEN}"}
 
 
def github_headers():
    return {
        "Authorization": f"Bearer {GITHUB_PAT}",
        "Accept": "application/vnd.github+json",
    }
 
 
def fetch_latest_message():
    """Fetch the most recent message from the Discord channel."""
    url = f"{DISCORD_API}/channels/{DISCORD_CHANNEL_ID}/messages"
    resp = requests.get(url, headers=discord_headers(), params={"limit": 1}, timeout=15)
    resp.raise_for_status()
 
    messages = resp.json()
    if not messages:
        return None
    return messages[0]
 
 
def extract_content(message):
    """Extract text, images (attachments + embeds), and metadata from a message."""
    images = []
 
    for att in message.get("attachments", []):
        if att.get("content_type", "").startswith("image/"):
            images.append({
                "url": att["url"],
                "proxy_url": att.get("proxy_url", att["url"]),
                "filename": att.get("filename", ""),
                "width": att.get("width"),
                "height": att.get("height"),
            })
 
    for embed in message.get("embeds", []):
        if embed.get("image"):
            images.append({
                "url": embed["image"]["url"],
                "proxy_url": embed["image"].get("proxy_url", embed["image"]["url"]),
                "width": embed["image"].get("width"),
                "height": embed["image"].get("height"),
            })
        if embed.get("thumbnail"):
            images.append({
                "url": embed["thumbnail"]["url"],
                "proxy_url": embed["thumbnail"].get("proxy_url", embed["thumbnail"]["url"]),
                "width": embed["thumbnail"].get("width"),
                "height": embed["thumbnail"].get("height"),
            })
 
    author = message.get("author", {})
 
    return {
        "text": (message.get("embeds", [{}])[0].get("description", "") 
         or message.get("content", "")),
        "images": images,
        "author": {
            "name": author.get("username", "Unknown"),
            "avatar_url": (
                f"https://cdn.discordapp.com/avatars/{author['id']}/{author['avatar']}.png"
                if author.get("avatar") else None
            ),
        },
        "timestamp": message.get("timestamp", ""),
        "message_id": message.get("id", ""),
        "fetched_at": datetime.now(timezone.utc).isoformat(),
    }
 
 
def push_to_github(data):
    """Create or update a JSON file in the GitHub repo via the REST API."""
    url = f"{GITHUB_API}/repos/{GITHUB_REPO}/contents/{GITHUB_FILE_PATH}"
 
    sha = None
    resp = requests.get(url, headers=github_headers(), params={"ref": GITHUB_BRANCH}, timeout=15)
    if resp.status_code == 200:
        sha = resp.json().get("sha")
 
    content_json = json.dumps(data, indent=2, ensure_ascii=False)
    content_b64 = base64.b64encode(content_json.encode("utf-8")).decode("utf-8")
 
    payload = {
        "message": f"Update latest message ({datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')})",
        "content": content_b64,
        "branch": GITHUB_BRANCH,
    }
    if sha:
        payload["sha"] = sha
 
    resp = requests.put(url, headers=github_headers(), json=payload, timeout=15)
    resp.raise_for_status()
    return resp.json()["content"]["html_url"]
 
 
def send_log_message(text):
    """Send a short log message to the Discord log channel."""
    url = f"{DISCORD_API}/channels/{DISCORD_LOG_CHANNEL}/messages"
    payload = {"content": text}
    try:
        resp = requests.post(url, headers=discord_headers(), json=payload, timeout=10)
        resp.raise_for_status()
    except Exception as e:
        log.warning(f"Failed to send log message: {e}")
 
 
def run_once(last_message_id):
    """
    Check for a new message, push if it has images and is new.
    Returns the message_id of the latest processed message.
    """
    message = fetch_latest_message()
    if not message:
        log.info("No messages in channel.")
        return last_message_id
 
    msg_id = message.get("id")
 
    # Skip if we've already processed this message
    if msg_id == last_message_id:
        return last_message_id
 
    data = extract_content(message)
    log.info(f"New message {msg_id}: {len(data['images'])} image(s), "
             f"{len(data['text'])} chars text")
 
    if not data["images"]:
        log.info("No images, skipping push.")
        return msg_id
 
    html_url = push_to_github(data)
    log.info(f"Pushed to GitHub: {html_url}")
 
    timestamp = datetime.now(AEST).strftime("%H:%M AEST")
    send_log_message(
        f"Website updated at {timestamp}\n"
        f"Message: `{msg_id}` · {len(data['images'])} image(s)\n"
    )
 
    return msg_id
 
 
def main():
    log.info("Starting Discord-to-GitHub bridge")
    log.info(f"  Source channel : {DISCORD_CHANNEL_ID}")
    log.info(f"  Log channel    : {DISCORD_LOG_CHANNEL}")
    log.info(f"  Repo           : {GITHUB_REPO}")
    log.info(f"  Poll interval  : {POLL_INTERVAL}s")
 
    last_message_id = None
    consecutive_errors = 0
 
    while True:
        try:
            last_message_id = run_once(last_message_id)
            consecutive_errors = 0
            time.sleep(POLL_INTERVAL)
 
        except KeyboardInterrupt:
            log.info("Shutting down (keyboard interrupt).")
            break
 
        except Exception as e:
            consecutive_errors += 1
            backoff = min(BACKOFF_BASE * (2 ** (consecutive_errors - 1)), BACKOFF_MAX)
            log.error(f"Error ({consecutive_errors} in a row): {e}")
            log.info(f"Backing off for {backoff}s")
            time.sleep(backoff)
 
 
if __name__ == "__main__":
    main()
