function loadComponents() {
    var includes = $('[data-include]')
    $.each(includes, function () {
        if(      $(this).data('include').indexOf("navbar") >=0         ){
            let variable = $(this).data('include').split("-");
            if(variable[1] == ""){
                $(this).html(components["navbar"])
            }
            else{
                $(this).html(
                    components["navbarDynamic"].replace(
                        "Category_title", variable[1]
                        )
                    )
            }

        }
        else{
            $(this).html(components[$(this).data('include')])
        }
        
    })
  }

  loadComponents();