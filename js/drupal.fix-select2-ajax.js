(function ($) {

  Drupal.behaviors.fixSelect2Ajax = {
    attach: function(context, settings) {
      // Fix bug where select2 elements aren't processed after AJAX calls.
      // There should be no harm in processing all elements again, since select2
      // applies .once() to processed select elements, preventing them from
      // being processed a second time.
      try {
        _select2_process_elements();
      }
      catch(e) {
      }
    }
  };

})(jQuery);
