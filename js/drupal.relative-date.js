(function ($) {

  Drupal.behaviors.relativeDate = {
    attach: function(context, settings) {
      $('.relative-date span', context).once('relative-date').each(function() {
        var date = new Date(parseInt($(this).attr('data-timestamp')) * 1000);
        $(this).html(Drupal.relativeDate.fromNow(date));
      });
    }
  };

  Drupal.relativeDate = {};

  Drupal.relativeDate.fromNow = function(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var units = {
      'year|years': 31536000,
      'month|months': 2592000,
      'week|weeks': 604800,
      'day|days': 86400,
      'hour|hours': 3600,
      'min|min': 60,
      'sec|sec': 1
    };

    for (key in units) {
      var parts = key.split('|');

      if (seconds >= units[key]) {
        var count = Math.floor(seconds / units[key]);

        return (count == 1) ? '1 ' + parts[0] : count + ' ' + parts[1];
      }
    }
    return '0 sec';
  }

})(jQuery);
