/**
 * @file Plugin to cleanup pasted text.
 */
CKEDITOR.plugins.add( 'ombucleanup',
{
  init : function( editor )
  {
    function ombucleanup_cleanup( ev )
    {
      if (ev.data.html || ev.data.dataValue) {
        var html = ev.data.html || ev.data.dataValue;
        // Chrome adds incorrectly encoded `&nbsp;` around inline elements like
        // `<strong>` and `<em>` that then get stripped.  This normalizes it.
        html = jQuery('<textarea />').html(html).val();

        jQuery.ajax({
          type: 'POST',
          url: Drupal.settings.basePath + 'ombucleanup/cleanup-paste',
          async: false,
          data: {html: html},
          success: function(data) {
            if (ev.data.html) {
              ev.data.html = data.text;
            }
            else if (ev.data.dataValue) {
              ev.data.dataValue = data.text;
            }
          },
          error: function(msg) {
            alert("Failed clean-up on paste, please contact your site administrator.");
          }
        });
      }
    }

    editor.on( 'paste', ombucleanup_cleanup );
  }
});
