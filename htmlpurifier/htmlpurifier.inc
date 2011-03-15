<?php
// $Id$

/**
 * @file
 *
 * Helper functions to access the HTMLPurifier library.
 *
 * Most of these functions have been borrowed from htmlpurifier.module:
 * http://drupal.org/project/htmlpurifier
 */

/**
 * Loads the HTML Purifier library, and performs global initialization.
 */
function _ombucleanup_htmlpurifier_load() {
  static $done = false;
  if ($done) {
    return;
  }
  $done = true;
  $path = drupal_get_path('module', 'ombucleanup') . '/htmlpurifier';

  require_once "$path/library/HTMLPurifier.auto.php";
  require_once "$path/HTMLPurifier_DefinitionCache_Drupal.php";

  $factory = HTMLPurifier_DefinitionCacheFactory::instance();
  $factory->register('Drupal', 'HTMLPurifier_DefinitionCache_Drupal');
}

/**
 * Returns the HTMLPurifier_Config object corresponding to an input format.
 *
 * @return
 *    Instance of HTMLPurifier_Config.
 */
function _ombucleanup_htmlpurifier_get_config() {
  $config = HTMLPurifier_Config::createDefault();

  $config->set('AutoFormat.AutoParagraph', TRUE);
  $config->set('AutoFormat.Linkify', TRUE);
  $config->set('HTML.Doctype', 'XHTML 1.0 Transitional'); // Probably
  $config->set('Core.AggressivelyFixLt', TRUE);
  $config->set('Cache.DefinitionImpl', 'Drupal');

  // Filter HTML doesn't allow external images, so neither will we...
  // for now. This can be configured off.
  $config->set('URI.DisableExternalResources', TRUE);

  if (!empty($_SERVER['SERVER_NAME'])) {
    // SERVER_NAME is more reliable than HTTP_HOST
    $config->set('URI.Host', $_SERVER['SERVER_NAME']);
  }

  if (defined('LANGUAGE_RTL') && $GLOBALS['language']->direction === LANGUAGE_RTL) {
    $config->set('Attr.DefaultTextDir', 'rtl');
  }

  return $config;
}
