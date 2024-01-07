components = {
  "navbar":/*html*/`
  <div class="navbar">
  <div class="row">
    <div class="col-4 navLeft">
      <div class="navTitle">
        <a href="index.html">
          seejianshin
        </a>
      </div>

      <div class="navIcons">

        <div class="navIcon" id="emailButton">
          <span class="material-symbols-rounded">
              account_box
          </span>
      </div>

      <div class="navIcon">
            <a href="https://www.instagram.com/shin_designworks/" target="_blank" rel="noopener noreferrer" class = "logoIcon">
                <img src="Logos/Instagram_Glyph_Gradient.png" alt="Instagram" >
            </a>
        </div>

        <div class="navIcon">
          <a href="https://www.linkedin.com/in/seejianshin/" target="_blank" rel="noopener noreferrer" class = "logoIcon">
              <img src="Logos/LI-In-Bug.png" alt="LinkedIn">
          </a>
      </div>
      </div>
    </div>
    <div class="col-8 navTabs">

      <div id = "PERSONAL" class="navTab" style="background-color: #F598A2;">
        Personal
      </div>
      <div id = "INDUSTRY" class="navTab" style="background-color: #FDD9C1;">
        Industry
      </div>
      <div id = "MISCELLANEOUS" class="navTab" style="background-color: #B8E1D2;">
        Miscellaneous
      </div>

    </div>
  </div>
</div>
  `,





  "navbarDynamic":/*html*/`
  <div class="navbar">
  <div class="row">
    <div class="col-4 navLeft">
      <div class="navTitle">
        <a href="index.html">
          seejianshin
        </a>
      </div>

      <div class="navIcons">

        <div class="navIcon" id="emailButton">
          <span class="material-symbols-rounded">
              account_box
          </span>
      </div>

      <div class="navIcon">
            <a href="https://www.instagram.com/shin_designworks/" target="_blank" rel="noopener noreferrer" class = "logoIcon">
                <img src="Logos/Instagram_Glyph_Gradient.png" alt="Instagram" >
            </a>
        </div>

        <div class="navIcon">
          <a href="https://www.linkedin.com/in/seejianshin/" target="_blank" rel="noopener noreferrer" class = "logoIcon">
              <img src="Logos/LI-In-Bug.png" alt="LinkedIn">
          </a>
      </div>
      </div>
    </div>
    <div class="col-8 navTabs">
      <a class="navTab" style="background-color: #F598A2;" href="index.html">
          <span class="material-symbols-rounded">
              arrow_back
          </span>
      </a>
      <div class="navTab selectedTab" style="background-color: #FDD9C1; cursor: default;">
        Category_title
      </div>
    </div>
  </div>
</div>
  `,







  "emailRow":/*html*/`
              <div id = "emailRow" class="row emailRow">
                <div class="col-8">
                  <div class="content contactForm">
                      <div class="headingText">
                          Hello!
                      </div>
                      <br>

                      <div class="bodyText">
                        Hey, I'm Shin! I'm an Industrial Designer and Mechanical Engineer currently based in Melbourne, Australia. I enjoy making all sorts of things – from leathercrafts and woodworking to 3D printing, microcontrollers, and PCB design. I am skilled in CAD modeling and rendering, feel free to reach out to me!
                      </div>

                      <div class="closeButton" id="closeButton">
                          <span class="material-symbols-rounded">
                              close
                          </span>
                      </div>
                      <form action="https://postmail.invotes.com/send" method="post" id="email_form">

                      <input id = "inputEmail" type="email" name="subject" placeholder="Email" required/>
                      <br>
                      <div id="emailError"></div>
                      <textarea id = "inputText" name="text" placeholder="Message" required></textarea>
                      <div id="textError"></div>
                      <br>

                      <input type="hidden" name="access_token" value="pqrh2i9xg0xbn7751ux2dp73" />

                      <div class="tags formBottom">
                          <div style="background-color: #FDD9C1; border-color: #FDD9C1;">
                              <input id="submit_form" type="submit" value="Send">
                          </div>

                              <div class="emailAdd" style="background-color: #C8CFE9; border-color: #C8CFE9;" >
                                  shin.industrialdesign@gmail.com
                              </div>
                      </div>
                  </form>
                  </div>
            </div>

                <div class="col-4">
                  <div class="content">
                    <div class="bodyText">
                      Skills
                    </div>
                    <div class="tags">
                      <div style="background-color: #C8CFE9;">CAD</div>
                      <div style="background-color: #B8E1D2;">PCB Design</div>
                      <div style="background-color: #FDD9C1;">3D Printing</div>
                      <div style="background-color: #F598A2;">Laser Cutting</div>
                      <div style="background-color: #C8CFE9;">Animations</div>
                      <div style="background-color: #FDD9C1;">Woodworking</div>
                      <div style="background-color: #C8CFE9;">Leathercrafts</div>
                    </div>
                    <br><br>
                    <div class="bodyText">
                      Softwares
                    </div>
                    <div class="tags">
                      <div style="background-color: #c76e34;">Fusion 360</div>
                      <div style="background-color: #ee5656;">Solidworks</div>
                      <div style="background-color: #7f85e2;">Adobe Suite</div>
                      <div style="background-color: #e99c69;">Blender</div>
                    </div>
                    <br><br>
                    <div class="bodyText">
                      Programming Languages
                    </div>
                    <div class="tags">
                      <div style="background-color: #e4e694;">Python</div>
                      <div style="background-color: #5a86d8;">C++</div>
                      <div style="background-color: #95e072;">Node.js</div>
                      <div style="background-color: #e7823e;">MATLAB</div>
                    </div>
                  </div>
                </div>
            </div>
            `,
}

