(function ($) {

  Drupal.behaviors.OmbuCleanupDisableAjax = {
    attach: function(context, settings) {
      for (ajax_el in settings.ajax) {
        if (Drupal.ajax[ajax_el] && Drupal.ajax[ajax_el].element.form) {
          Drupal.ajax[ajax_el].beforeSubmit = Drupal.OmbuCleanupAjax.beforeSubmit;
        }
      }
    }
  };

  Drupal.behaviors.OmbuCleanupEnableSubmit = {
    attach: function(context, settings) {
      $('input[type=submit]:visible').removeAttr('disabled').fadeTo(200, 1);
    }
  };

  Drupal.OmbuCleanupAjax = {};

  Drupal.OmbuCleanupAjax.beforeSubmit = function (form_values, form, options) {
    $('input[type=submit]', form).attr('disabled', 'disabled').fadeTo(200, .20);
  }

})(jQuery);
