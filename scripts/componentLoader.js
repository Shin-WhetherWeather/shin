function loadComponents() {
    var includes = $('[data-include]')
    $.each(includes, function () {
        $(this).html(components[$(this).data('include')])
    })
  }

  loadComponents();