let scrolling = false;


function topFunction() {

  if(scrolling == false)
    {
    scrolling = true;
    $('html, body').animate(
    {scrollTop:0}, 
    {
      duration: 40,
      complete: function()
      {
        scrolling = false;
      }
    }
    );




    $(window).animate(
      {scrollTop:0},
      {
        duration: 40,
        complete: function()
        {
          scrolling = false;
        }
      }
      );



    console.log("scroll top");
    }
  }