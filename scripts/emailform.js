timeoutList = [];

function validateEmail(email){
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  emailField = document.getElementById("inputEmail");
  textField = document.getElementById("inputText");


  emailError = document.getElementById("emailError");
  textError = document.getElementById("textError");

  function validateInput(){
    if(validateEmail(emailField.value) == null){
        emailError.innerText = "Invalid email address";
        return false;
    }
    else{
        emailError.innerText = "";
    }

    if(textField.value == ""){
        textError.innerText = "Empty text field";
        return false;
    }
    else{
        textError.innerText = "";
    }

    return true;
  }

 

  emailField.addEventListener("input", function(){
    validateInput();

  })
  textField.addEventListener("input", function(){
    validateInput();
  })



    //update this with your js_form selector
    var form_id_js = "email_form";

    var data_js = {
        "access_token": "pqrh2i9xg0xbn7751ux2dp73"
    };

    function js_onSuccess() {
        sendButton.value='Success!';
    }

    function js_onError(error) {
        sendButton.value='Error!';
    }

    var sendButton = document.getElementById("submit_form");

    function js_send() {

        if(!validateInput()){
            return;
        }


        sendButton.value='Sending…';
        sendButton.disabled=true;
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if(request.readyState == 4 && request.status == 200) {
                js_onSuccess();
            } else
            if(request.readyState == 4) {
                js_onError(request.response);
            }
        };

        var subject = "Email from " + document.querySelector("#" + form_id_js + " [name='subject']").value;
        var message = document.querySelector("#" + form_id_js + " [name='text']").value;
        data_js['subject'] = subject;
        data_js['text'] = message;
        var params = toParams(data_js);

        request.open("POST", "https://postmail.invotes.com/send", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        request.send(params);

        return false;
    }

    sendButton.onclick = js_send;

    function toParams(data_js) {
        var form_data = [];
        for ( var key in data_js ) {
            form_data.push(encodeURIComponent(key) + "=" + encodeURIComponent(data_js[key]));
        }

        return form_data.join("&");
    }

    var js_form = document.getElementById("email_form");
    js_form.addEventListener("submit", function (e) {
        e.preventDefault();
    });


    email = document.getElementById("emailButton");
    emailRow = document.getElementById("emailRow");
    closeButton = document.getElementById("closeButton");


    closeButton.addEventListener("click", function(){
        email.style.setProperty("font-variation-settings", "'FILL' 0 ");
    
        emailRow.style.display = "none";
        emailRow.style.opacity = "0.5";
    })
    
    email.addEventListener("click", function(){
        topFunction();
    
        
        for(let i = 0; i <timeoutList.length; i++){
            clearTimeout(timeoutList[i]);
        }
    
        if(emailRow.style.display == "block" || emailRow.style.display == "flex"){
    
            email.style.setProperty("font-variation-settings", "'FILL' 0 ");
    
            emailRow.style.display = "none";
            emailRow.style.opacity = "0.5";
    
            
        }
        else{

            if(window.innerWidth < 1080){
                emailRow.style.display = "block";
            }else{
                emailRow.style.display = "flex";
            }
    
            emailRow.style.opacity = "0.5";
            emailRow.style.paddingTop = "100px";
    
            email.style.setProperty("font-variation-settings", "'FILL' 1 ");
    
            timeoutList.push(
                setTimeout(function(){
                    emailRow.style.paddingTop = "0px";
                    emailRow.style.opacity = "1";
                },1)
            );
    
            
    
            
        }
        
    });
