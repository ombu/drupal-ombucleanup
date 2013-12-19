(function ($) {

  Drupal.behaviors.OmbuCleanupExternalLinks = {
    attach: function(context, settings) {
      // Strip the host name down, removing ports, subdomains, or www.
      var pattern = /^(([^\/:]+?\.)*)([^\.:]{4,})((\.[a-z]{1,4})*)(:[0-9]{1,5})?$/;
      var host = window.location.host.replace(pattern, '$3$4');
      var subdomain = window.location.host.replace(pattern, '$1');

      if (subdomain == 'www.' || subdomain == '') {
        subdomains = "(www\\.)?";
      }
      else {
        subdomains = subdomain.replace(".", "\\.");
      }

      // Build regular expressions that define an internal link.
      var internal_link = new RegExp("^https?://" + subdomains + host, "i");

      // Find all links which are NOT internal and begin with http as opposed
      // to ftp://, javascript:, etc. other kinds of links.
      // When operating on the 'this' variable, the host has been appended to
      // all links by the browser, even local ones.
      var external_links = new Array();
      $("a", context).each(function(el) {
        try {
          var url = this.href.toLowerCase();
          if (url.indexOf('http') == 0 && (!url.match(internal_link))) {
              external_links.push(this);
          }
        }
        // IE7 throws errors often when dealing with irregular links, such as:
        // <a href="node/1"></a> Empty tags.
        // <a href="http://user:pass@example.com">example</a> User:pass syntax.
        catch (error) {
          return false;
        }
      });

      // Apply the target attribute to all links.
      $(external_links).attr('target', '_blank');
    }
  };

})(jQuery);
