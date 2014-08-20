(function ($) {

  Drupal.behaviors.relativeDate = {
    attach: function(context, settings) {
      $('.relative-date span', context).once('relative-date').each(function() {
        var date = new Date(parseInt($(this).attr('data-timestamp')));
        $(this).html(Drupal.relativeDate.fromNow(date));
      });
    }
  };

  Drupal.relativeDate = {};

  Drupal.relativeDate.fromNow = function(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

})(jQuery);
