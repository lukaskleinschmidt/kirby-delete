(function($) {

  var position = 'sidebar', element, clientX, clientY, url;

  $(document).ajaxComplete(function(event, xhr, settings) {
    if(settings.url == url) return;
    add();
  }).ready(function() {
    add();
  }).on('click', '[data-context]', function(event) {
    position ='context';
    element  = $(this);
    clientX  = event.clientX;
    clientY  = event.clientY;
  });

  var add = function() {
    // Abort when there is already a delete button in the sidebar
    // But continue when the call comes from a context menu
    if(position == 'sidebar' && $('[data-shortcut="#"]').length) return;

    url = window.location.href.replace('/edit', '');

    if(position == 'context') {
      url = element.data('context').replace('/context', '');
    }

    $.get(url + '/options/delete/' + position, function(data) {

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

      app.content.root.shortcuts();

      // Reset position
      position ='sidebar';

      // Reset url
      url = '';

    });
  }

})(jQuery);
