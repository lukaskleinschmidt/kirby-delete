(function($) {

  var DeleteAction = function() {
    var self = this;

    this.deferred = null;
    this.event = null;
    this.url = null;

    $(document).ajaxComplete(function(event, xhr, settings) {
      if(self.deferred && self.url == settings.url) {
        self.deferred.resolve();
      }
    });
  };

  DeleteAction.prototype.flush = function() {
    this.deferred = null;
    this.event = null;
    this.url = null;
  }

  DeleteAction.prototype.link = function(url) {
    return $.get(url).then(function(data) {
      if(!data) return false;

      var link = $('<a><i class="icon icon-left fa fa-' + data.icon + '"></i>' + data.label + '</a>');

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

      return link;
    });
  }

  DeleteAction.prototype.add = function(url, position = 'sidebar', force = false) {
    var self = this, slice = position == 'context' ? -8 : -5;

    console.log(url, position, force);

    this.deferred = $.Deferred();
    this.url = url

    if(force) this.deferred.resolve();

    $.when(self.link(url.replace(/\/$/, '').slice(0, slice) + '/options/delete/' + position), self.deferred).then(function(link) {

      link = $('<li>').append(link);

      if(position == 'sidebar' && !$('[data-shortcut="#"]').length) {

        // Append to sidebar
        $('.sidebar-list:nth-of-type(1)').append(link);

      } else if(position == 'context') {

        // Append to context menu
        $('nav.contextmenu .dropdown-list').append(link);

        // Update cotnext-menu position
        if(self.event) {
          var menu    = $('nav.contextmenu');
          var top     = self.event.clientY;
          var left    = self.event.clientX;
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
      }
    });
  }

  var deleteAction = new DeleteAction();

  $(window)
    .on('popstate', function() {
      deleteAction.add(window.location.href);
    });

  $(document)
    .ready(function() {
      deleteAction.add(window.location.href, 'sidebar', true);
    })
    .on('click', '[href*="edit"]:not([data-modal]:not([data-context]))', function() {
      console.log('click');
      deleteAction.add($(this).attr('href'));
    })
    .on('click', '[data-context]', function(event) {
      deleteAction.event = event;
      deleteAction.add($(this).data('context'), 'context');
    });

})(jQuery);
