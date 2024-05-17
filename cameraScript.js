imageRight = document.getElementById("imageRight");
imageLeft = document.getElementById("imageLeft");
var calcWidth = imageRight.width;
var calcHeight = imageRight.height;

var width = imageRight.naturalWidth;
var height = imageRight.naturalHeight;

promptText = document.getElementById("promptText");

textOverlayLeft = document.getElementById("textOverlayLeft");
textOverlayRight = document.getElementById("textOverlayRight");

infoButton = document.getElementById("infoButton");

//var ratio = imageRight.naturalWidth/imageRight.naturalHeight;

button = document.getElementById("button");
promptButton = document.getElementById("promptButton");
promptPopout = document.getElementById("promptPopout");

overlay = document.getElementById("overlay");



function blurImage(image, blurAmount){
    calcWidth = imageRight.width;
    calcHeight = imageRight.height;

    width = imageRight.naturalWidth;
    height = imageRight.naturalHeight;

    var imgString = ""
    if(image == imageRight){
        imgString = "imageRightCanvas";
    }
    else if(image == imageLeft){
        imgString = "imageLeftCanvas";
    }

    if (document.contains(document.getElementById(imgString))) {
        document.getElementById(imgString).remove();
    }

    
    
    var canv = document.createElement('canvas');
    canv.id = imgString;
    canv.style.objectFit = "cover";
    canv.width = width;
    canv.height = height;
    
    
    var ctx = canv.getContext('2d');
    
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    ctx.filter = "brightness(" + (100 - blurAmount)/100 + ")";
    
    var sWidth = Math.floor(width/blurAmount);
    var sHeight = Math.floor(height/blurAmount);
    
    ctx.drawImage(image,0,0, sWidth, sHeight);
    ctx.drawImage(canv, 0, 0, sWidth, sHeight, 0, 0, width, height);
    
    image.style.display = 'none';
    canv.style.height = "100%";
    canv.style.width = "100%";
    image.parentNode.insertBefore(canv, image)

}

var id;
var delta;
var blurIndex;
var cycleComplete;
var lastSelection = 1;
var promptId;
var indexText = 0;
var insideText = ""
var modifierIndex = 0;
var blurRight = false;

var selection = 0;

var options = [];
var weights = [];
var selectedIndex = 0;
var randResult = [];

for(var i = 0 ; i < Object.keys(prompts).length; i++){
    options.push(i);
    randResult[i] = 0;
    weights.push(20);
}

//console.log(options);



function startAnim(){
    clearInterval(id);
    clearInterval(promptId);
    cycleComplete = false;
    delta = 2;
    blurIndex = 2;
    id = setInterval(blurAnim, 60);
    indexText = 0;
    promptText.innerText = "Loading...";
}

function typeWriter(){
    tempText = insideText.split(" ");
    if(indexText < tempText.length){
        promptText.innerText = promptText.innerText + "  " + tempText[indexText];
        indexText ++;
    }
    else{
        clearInterval(promptId);
    }
}

function blurAnim(){

    if(blurIndex >= 50 && cycleComplete == false){
        let selection = lastSelection;
        if(!blurRight){

            var randSelection = [];

            for(var i = 0 ; i < Object.keys(prompts).length; i++){
                weights[i] = weights[i] < 20 ? weights[i] + 1 : 20;
                var clone = Array(   weights[i] >= 0 ? weights[i] : 0   ).fill(i);
                randSelection.push(...clone);
            }
            selection = randSelection[~~(Math.random() * randSelection.length)] + 1;
            weights[selection - 1] = -5;
            //console.log(weights);
            randResult[selection - 1] ++;
            //console.log(randResult);


            //selection = Math.floor(Math.random() * (Object.keys(prompts).length)) + 1;

            //while(lastSelection == selection){
                //selection = Math.floor(Math.random() * (Object.keys(prompts).length)) + 1;
            //}
            lastSelection = selection;
        }


        delta = -2;
        cycleComplete = true;

        
        if(blurRight){
            imageRight.src="images/" + modifierPrefix[modifierIndex] + selection + ".jpg"; 
        }
        else{
            imageRight.src="images/" + modifierPrefix[modifierIndex] + selection + ".jpg";
            imageLeft.src="images/o" + selection + ".jpg";

            textOverlayLeft.innerHTML = mLeft[selection];
            textOverlayRight.innerHTML = mRight[selection];
            insideText = prompts[selection];

            promptText.innerText = "";
            promptId = setInterval(typeWriter, 100);
        }
        

        
    }
    else if(blurIndex <= 1 && cycleComplete){
        
        blurImage(imageRight, 1);
        if(!blurRight){
            blurImage(imageLeft, 1);
        }
        
        clearInterval(id);
        blurRight = false;
        return;
    }
    else{
        blurImage(imageRight, blurIndex);
        if(!blurRight){
            blurImage(imageLeft, blurIndex);
        }
        blurIndex = blurIndex + delta;
    }
}






function getInfo(){
    clearInterval(id);
    clearInterval(promptId);
    indexText = 0;
    promptText.innerText = "";
    insideText = "The ** [ ] AI Camera is a creative tool for exploring the emerging intersection between generative artificial intelligence (AI) and creative practice. Referencing the spontaneity and fun of retro instant cameras, you simply point the ‘camera’ towards something of interest, press the ‘shutter button,’ and an AI-generated image is instantly printed.";
    textOverlayLeft.innerHTML = "<a style='color: black;' href='https://www.rowanpage.com/'> Rowan Page </a>";
    textOverlayRight.innerHTML = "<a style='color: #dbdbdb;' href = 'https://seejianshin.com/'>Jian Shin See</a>";
    imageRight.src="images/x1.jpg";
    imageLeft.src="images/x2.jpg";
    promptId = setInterval(typeWriter, 100);
    setTimeout(function(){
        blurImage(imageRight, 1);
        blurImage(imageLeft, 1);
    }, 100);

}

function modifyPrompt(){
    modifierIndex ++;
    if(modifierIndex > promptModifiers.length - 1){
        modifierIndex = 0;
    }

    promptPopout.innerText = promptModifiers[modifierIndex];
    blurRight = true;

    clearInterval(id);
    cycleComplete = false;
    delta = 2;
    blurIndex = 2;
    id = setInterval(blurAnim, 60);
}


window.onload = function(){
    button.addEventListener('click', function(){startAnim()});
    infoButton.addEventListener('click', function(){getInfo()});
    promptButton.addEventListener('click', function(){modifyPrompt()});
    overlay.remove();
};
