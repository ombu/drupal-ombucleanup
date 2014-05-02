<?php

/**
 * @file
 * Token callbacks for OMBU.
 */

/**
 * Implements hook_token_info().
 */
function ombucleanup_token_info() {
  $info['tokens']['menu-link']['clean-parent'] = array(
    'name' => t('Clean parents'),
    'description' => t('An array of menu parents that are not speial menu items'),
    'type' => 'array',
  );
  return $info;
}

/**
 * implements hook_tokens().
 */
function ombucleanup_tokens($type, $tokens, array $data = array(), array $options = array()) {
  $replacements = array();

  if ($type == 'menu-link' && !empty($data['menu-link'])) {
    $link = (array) $data['menu-link'];

    foreach ($tokens as $name => $original) {
      switch ($name) {
        case 'clean-parent':
          if ($parents = ombucleanup_menu_link_load_all_parents($link['mlid'])) {
            $replacements[$original] = token_render_array($parents, $options);
          }
          break;
      }
    }

    // [menu-link:clean-parent:*] chained tokens.
    if ($parents_tokens = token_find_with_prefix($tokens, 'clean-parent')) {
      if ($parents = ombucleanup_menu_link_load_all_parents($link['mlid'])) {
        $replacements += token_generate('array', $parents_tokens, array('array' => $parents), $options);
      }
    }
  }

return $replacements;
}

/**
 * Get parents of menu link without special menu items.
 */
function ombucleanup_menu_link_load_all_parents($mlid) {
  $cache = &drupal_static(__FUNCTION__, array());

  if (!is_numeric($mlid)) {
    return array();
  }

  if (!isset($cache[$mlid])) {
    $cache[$mlid] = array();
    $plid = db_query("SELECT plid FROM {menu_links} WHERE mlid = :mlid", array(':mlid' => $mlid))->fetchField();
    while ($plid && $parent = token_menu_link_load($plid)) {
      if ($parent['link_path'] != '<nolink>') {
        $cache[$mlid] = array($plid => $parent['title']) + $cache[$mlid];
      }
      $plid = $parent['plid'];
    }
  }

  return $cache[$mlid];
}
