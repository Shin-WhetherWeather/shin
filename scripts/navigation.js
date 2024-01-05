SmoothScroll({
    // Scrolling Core
  animationTime    : 800, // [ms]
  stepSize         : 100, // [px]
  
  // Acceleration
  accelerationDelta : 50,  // 50
  accelerationMax   : 3,   // 3
  
  // Keyboard Settings
  keyboardSupport   : true,  // option
  arrowScroll       : 50,    // [px]
  
  // Pulse (less tweakable)
  // ratio of "tail" to "acceleration"
  pulseAlgorithm   : true,
  pulseScale       : 4,
  pulseNormalize   : 1,
  
  // Other
  touchpadSupport   : false, // ignore touchpad by default
  fixedBackground   : true, 
  excluded          : ''    
  })