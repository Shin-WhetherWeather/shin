let dragGroup = document.getElementsByClassName('dragGroup');
let slider = document.getElementById("slideSlide");
let slideParent = document.getElementById("slideParent");
let camFrames = document.getElementById("camFrames");

slider.addEventListener("click", function(){
  triggerSlider();
});

let locked = true;

let animId = null;
let delta = -20;
let iter = -1;

let sliderAnimId = null;
let sliderDelta = -10;
let sliderIter = -1;

let vibrating = false;
let vibrateAnimId = null;
let vibrateIter = 0;

function triggerSlider(){
  if(locked){
    clearInterval(animId);
    clearInterval(sliderAnimId);
    animSlider();
    setTimeout(function(){animId = setInterval(moveTop, 5)},75);
  }
};

function animSlider(){
  slideParent.style.left = "-11px";
}

function shakeSlider(){
  slideParent.style.left = "-8px";
  setTimeout(function(){
    slideParent.style.left = "5px";
    vibrating = false;
  }, 200);
}


function setTransform(svg, selectedElement, transform, offset){
  var transforms = selectedElement.transform.baseVal;
  // Ensure the first transform is a translate transform
  if (transforms.length === 0 ||
      transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
    // Create an transform that translates by (0, 0)
    var translate = svg.createSVGTransform();
    translate.setTranslate(0, 0);
    // Add the translation to the front of the transforms list
    selectedElement.transform.baseVal.insertItemBefore(translate, 0);
  }
  // Get initial translation amount
  transform = transforms.getItem(0);
  offset.x -= transform.matrix.e;
  offset.y -= transform.matrix.f;

  return [transform, offset.x, offset.y];
}

let topDrag = document.getElementById("topDrag");
let topDragParent = document.getElementById("topDragParent");

let minY = 30 - topDrag.getBBox().y;
let maxY = 153 - topDrag.getBBox().y - topDrag.getBBox().height;


function moveTop(){
  iter = iter - 1;
  let dy = iter;

  var groupTransform = topDrag.transform.baseVal;
  // Ensure the first transform is a translate transform
  if (groupTransform.length === 0 ||
      groupTransform.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
    // Create an transform that translates by (0, 0)
    var translate = topDragParent.createSVGTransform();
    translate.setTranslate(0, 0);
    // Add the translation to the front of the transforms list
    topDrag.transform.baseVal.insertItemBefore(translate, 0);
  }
  var transform2 = groupTransform.getItem(0);
  transform2.setTranslate(0, dy);
  updateImage(dy);

  



  for(let i = 0; i < dragGroup.length; i++){
    var groupTransform = dragGroup.item(i).transform.baseVal;
    // Ensure the first transform is a translate transform
    if (groupTransform.length === 0 ||
        groupTransform.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
      // Create an transform that translates by (0, 0)
      var translate = topDragParent.createSVGTransform();
      translate.setTranslate(0, 0);
      // Add the translation to the front of the transforms list
      dragGroup.item(i).transform.baseVal.insertItemBefore(translate, 0);
    }
    var transform2 = groupTransform.getItem(0);
    transform2.setTranslate(0, dy);
  }

  delta = delta + 1;
  if(delta >= 0){
    delta = -20;
    iter = -1;
    clearInterval(animId);
    locked = false;
  }

}











function makeDraggable(evt) {
  var svg = evt.target;
  svg.addEventListener('mousedown', startDrag);
  svg.addEventListener('mousemove', drag);
  svg.addEventListener('mouseup', endDrag);
  svg.addEventListener('mouseleave', endDrag);

  svg.addEventListener('touchstart', startDrag);
  svg.addEventListener('touchmove', drag);
  svg.addEventListener('touchend', endDrag);
  svg.addEventListener('touchleave', endDrag);
  svg.addEventListener('touchcancel', endDrag);

function getMousePosition(evt) {
  var CTM = svg.getScreenCTM();
  if (evt.touches) { evt = evt.touches[0]; }
  return {
    x: (evt.clientX - CTM.e) / CTM.a,
    y: (evt.clientY - CTM.f) / CTM.d
  };
}

  var selectedElement, offset, transform;
  function startDrag(evt) {
    if(locked){
      if(!vibrating){
        vibrating = true;
        shakeSlider();
      }
      return;
    }
    if (evt.target.classList.contains('draggable') && locked == false) {
      selectedElement = evt.target;
      offset = getMousePosition(evt);
      // Get all the transforms currently on this element
      [transform, offset.x, offset.y] = setTransform(svg, selectedElement, transform, offset);
    }
  }


  function drag(evt) {
    if (selectedElement) {
      evt.preventDefault();
      var coord = getMousePosition(evt);

      //let bbox = selectedElement.getBBox();
      //minY = 30 - bbox.y;
      //maxY = 153 - bbox.y - bbox.height;
      var dy = coord.y - offset.y;

      if (dy < minY) { dy = minY; }
      else if (dy > maxY) { dy = maxY; 
        slideParent.style.left = "5px";
        updateImage( maxY );
        locked = true;
        endDrag(evt);
        return;
      }

      transform.setTranslate(0, dy);
      updateImage( dy );
  
  
  
        for(let i = 0; i < dragGroup.length; i++){
          var groupTransform = dragGroup.item(i).transform.baseVal;
          // Ensure the first transform is a translate transform
          if (groupTransform.length === 0 ||
              groupTransform.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
            // Create an transform that translates by (0, 0)
            var translate = svg.createSVGTransform();
            translate.setTranslate(0, 0);
            // Add the translation to the front of the transforms list
            dragGroup.item(i).transform.baseVal.insertItemBefore(translate, 0);
          }
          var transform2 = groupTransform.getItem(0);
          transform2.setTranslate(0, dy);
        }

    }
  }

  function endDrag(evt) {
    selectedElement = null;
  }


}

function updateImage(dy){
  let frac = (dy - minY)/(maxY - minY)
  camFrames.src = "photos/AiCam/Clip Frames/" + String(Math.floor(frac*95)).padStart(4,'0') + ".png"
}
