<?php

/**
 * @file
 * Adds tel: protocol to HTMLPurifier.
 */

class OMBU_HTMLPurifier_URIScheme_tel extends HTMLPurifier_URIScheme {

    public $browsable = false;
    public $may_omit_host = true;

    public function doValidate(&$uri, $config, $context) {
      $uri->userinfo = null;
      $uri->host     = null;
      $uri->port     = null;

      // are the characters in the submitted <a> href's (URI) value (tel:)  from amongst a legal/allowed set?
      // my legal phone # chars:  alphanumeric, underscore, hyphen, optional "+" for the first character.  That's it.  But you can allow whatever you want.  Just change this:
      $validCalltoPhoneNumberPattern = '/^\+?[a-zA-Z0-9_-]+$/i'; // <---whatever pattern you want to force phone numbers to match
      $proposedPhoneNumber = $uri->path;
      if (preg_match($validCalltoPhoneNumberPattern, $proposedPhoneNumber) !== 1) {
        // submitted phone # inside the href attribute value looks bad; reject the phone number, and let HTMLpurifier remove the whole href attribute on the submitted <a> tag.
        return FALSE;
      } else {
        // submitted phone # inside the href attribute value looks OK; accept the phone number; HTMLpurifier should NOT strip the href attribute on the submitted <a> tag.
        return TRUE;
      }
    }

}
