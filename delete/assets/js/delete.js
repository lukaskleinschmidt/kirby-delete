(function($) {

  var position = 'sidebar', element = null, clientX, clientY;

  $(document).ajaxStop(function() {
    add();
  }).ready(function() {
    add();
  }).on('click', '[data-context]', function(e) {
    position ='context';
    element  = $(this);
    clientX  = e.clientX;
    clientY  = e.clientY;
  });

  var add = function() {
    // Abort when there is already a delete button in the sidebar
    // But continue when the call comes from a context menu
    if(position == 'sidebar' && ((window.location.pathname.match(/\//g) || []).length < 3 || $('[data-shortcut="#"]').length)) return;

    var url = window.location.href.replace('/edit', '/options/delete/' + position);

    if(position == 'context') {
      url = element.data('context').replace('/context', '/options/delete/context');
    }

    $.get(url, function(data) {

      if(!data) return;

      var target = $('.sidebar-list:nth-of-type(1)');
      var link = $('<a><i class="icon icon-left fa fa-trash-o"></i>' + data.label + '</a>');

      if(data.href) {
        link.attr('href', data.href);
      }

      if(data.title) {
        link.attr('title', data.title);
      }

      if(data['data-shortcut']) {
        link.attr('data-shortcut', data['data-shortcut']);
      }

      if(data['data-modal']) {
        link.attr('data-modal', '');
      }

      if(position == 'context') {
        target = $('nav.contextmenu .dropdown-list');
      }

      // Add link
      target.append($('<li>').append(link));

      // Reposition if necessary
      if(position == 'context') {
        var menu    = $('nav.contextmenu');
        var top     = clientY;
        var left    = clientX;
        var width   = menu.innerWidth();
        var height  = menu.innerHeight();
        var wwidth  = $(window).width();
        var wheight = $(window).height();

        if((left + width) > wwidth) {
          left = wwidth - width;
        }

        if((top + height) > wheight) {
          top = wheight - height;
        }

        menu.css({
          top: top,
          left: left
        });
      }

      // Reset position
      position ='sidebar';

    });
  }

})(jQuery);
