(function($) {

  $.fn._sidebar  = $.fn.sidebar;

  $.fn.sidebar = function() {
    add();
    return this._sidebar();
  };

  var add = function() {
    var url = window.location.href.replace('/edit', '/options/delete');

    if((window.location.pathname.match(/\//g) || []).length < 3 || $('#delete').length) return;

    $.get(url, function(data) {

      if(!data) return;

      var link = $('<a id="delete"><i class="icon icon-left fa fa-trash-o"></i>' + data.label + '</a>');

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

      $('.sidebar-list:nth-of-type(1)').append($('<li>').append(link))
    });
  }

})(jQuery);
