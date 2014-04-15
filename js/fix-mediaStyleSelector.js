/**
 * Overrides `Drupal.media.popups.mediaStyleSelector.
 *
 * Media fields weren't properly escaped to use in the iframe's URI.
 */
(function($) {

try {
  Drupal.media.popups.mediaStyleSelector;
}
catch(e) {
  // Not a page with media popups.
  return;
}

var overrideMediaStyleSelector = function (mediaFile, onSelect, options) {
  var defaults = Drupal.media.popups.mediaStyleSelector.getDefaults();
  // @todo: remove this awful hack :(
  defaults.src = defaults.src.replace('-media_id-', mediaFile.fid) + '&fields=' + encodeURIComponent(JSON.stringify(mediaFile.fields));
  options = $.extend({}, defaults, options);
  // Create it as a modal window.
  var mediaIframe = Drupal.media.popups.getPopupIframe(options.src, 'mediaStyleSelector');
  // Attach the onLoad event
  mediaIframe.bind('load', options, options.onLoad);

  /**
   * Set up the button text
   */
  var ok = 'OK';
  var cancel = 'Cancel';
  var notSelected = 'Very sorry, there was an unknown error embedding media.';

  if (Drupal && Drupal.t) {
    ok = Drupal.t(ok);
    cancel = Drupal.t(cancel);
    notSelected = Drupal.t(notSelected);
  }

  // @todo: let some options come through here. Currently can't be changed.
  var dialogOptions = Drupal.media.popups.getDialogOptions();

  dialogOptions.buttons[ok] = function () {

    var formattedMedia = this.contentWindow.Drupal.media.formatForm.getFormattedMedia();
    if (!formattedMedia) {
      alert(notSelected);
      return;
    }
    onSelect(formattedMedia);
    $(this).dialog("close");
  };

  dialogOptions.buttons[cancel] = function () {
    $(this).dialog("close");
  };

  Drupal.media.popups.setDialogPadding(mediaIframe.dialog(dialogOptions));
  // Remove the title bar.
  mediaIframe.parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
  Drupal.media.popups.overlayDisplace(mediaIframe.parents(".ui-dialog"));
  return mediaIframe;
};

// Override the method.
var origMediaStyleSelector = Drupal.media.popups.mediaStyleSelector;
Drupal.media.popups.mediaStyleSelector = overrideMediaStyleSelector;

// Copy over the rest of the methods on mediaStyleSelector.
for (var i in origMediaStyleSelector) {
  if (origMediaStyleSelector.hasOwnProperty(i)) {
    Drupal.media.popups.mediaStyleSelector[i] = origMediaStyleSelector[i];
  }
}

})(jQuery);
