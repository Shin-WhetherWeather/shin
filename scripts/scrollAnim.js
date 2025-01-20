imagerAnim = document.getElementById("imagerAnim");
detectorAnim = document.getElementById("detectorAnim");
mainAnim = document.getElementById("mainAnim");




window.addEventListener('scroll', () => {  
  let imagerFrame = String(getCurrFrame(imagerAnim, 32, 0.7, 0.35)).padStart(2, '0');
  imagerAnim.src= "photos/Tomo/imagerAnim/" + imagerFrame + ".jpg";


  let detectorFrame = String(getCurrFrame(detectorAnim, 51, 0.4, 2)).padStart(2, '0');
  detectorAnim.src = "photos/Tomo/detectorAnim/" + detectorFrame + ".jpg";

  let mainFrame = String(getCurrFrame(mainAnim, 76, 0.35, 1)+1).padStart(3, '0');
  mainAnim.src = "photos/Tomo/mainAnim/" + mainFrame + ".jpg";

  });


  function getCurrFrame(elem, maxFrames, xSkew=1, ySkew=2){

    /*
    let topGap = elem.getBoundingClientRect().top;
    let botGap = topGap + elem.offsetHeight;

    let winTop = document.documentElement.scrollTop || document.body.scrollTop;
    let winBot = winTop + window.innerHeight;

    console.log(botGap);
    console.log(topGap);
    */




    let top = elem.getBoundingClientRect().top;
    let imgHeight = window.innerHeight - elem.offsetHeight;
    let bottom = top - imgHeight;

    let ratio = top/(imgHeight*xSkew)-(1-xSkew)/(ySkew*xSkew);

    if(ratio < 0){
      return maxFrames-1;
    }
    if(ratio > 1){
      return 0;
    }
    return Math.floor( maxFrames*(1-ratio) );



  }