
Drupal.cleanupPaste = function(pl, o) {
    var format = Drupal.wysiwyg.instances[ pl.editor.id ].format.replace('format', '');
    console.debug('test1');
    jQuery.ajax({
        async: false,
        type: 'POST',
        url: '/ombucleanup/cleanup-paste',
        data: {
            text: o.content,
            format: format
        },
        success: function(data) {
                   console.debug('test');
            o.content = data;
            setTimeout("tinymce.EditorManager.execInstanceCommand('"+pl.editor.id+"', 'mceAutoResize')", 500);
        },
    });
}
