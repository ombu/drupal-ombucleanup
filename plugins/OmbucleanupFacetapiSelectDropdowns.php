<?php

/**
 * @file
 * Facetapi select dropdowns.
 */

class OmbucleanupFacetapiSelectDropdowns extends FacetapiWidgetLinks {
  /**
   * Renders the links.
   */
  public function execute() {
    static $count = 0;
    $count++;
    $element = &$this->build[$this->facet['field alias']];

    $settings = $this->settings;

    // If there's an active facet, pass off to parent to handle links.
    $facet_active = FALSE;
    foreach ($element as $item) {
      if ($item['#active']) {
        $facet_active = TRUE;
        break;
      }
    }
    if ($facet_active) {
      parent::execute();
      return;
    }

    $facet_info = $this->facet->getFacet();

    // Show options with optgroup for created field.
    if ($facet_info['field'] == 'ds_created') {
      $options = $this->buildOptgroupOptions($element);
    }
    else {
      $options = $this->buildOptions($element);
    }

    if (!$facet_active) {
      if (!empty($settings->settings['default_option_label'])) {
        $options = array($settings->settings['default_option_label']) + $options;
      }
      else {
        $options = array(t('--Choose--')) + $options;
      }
    }

    // We keep track of how many facets we're adding, because each facet form
    // needs a different form id.
    if (end($options) !== '(-)') {
      $element = $this->createSelectElement($options, $count);
    }
  }

  /**
   * Implements parent::settingsForm().
   */
  public function settingsForm(&$form, &$form_state) {
    parent::settingsForm($form, $form_state);
    $form['widget']['widget_settings']['links'][$this->id]['default_option_label'] = array(
      '#title' => t('Default Option Label'),
      '#type' => 'textfield',
      '#default_value' => !empty($this->settings->settings['default_option_label']) ? $this->settings->settings['default_option_label'] : '',
    );
  }

  /**
   * Build options from facet.
   */
  protected function buildOptions($element) {
    $options = array();

    foreach ($element as $item) {
      $path = !empty($this->settings->settings['submit_page']) ? $this->settings->settings['submit_page'] : $item['#path'];
      $path = strpos($item['#path'], $path) === 0 ? $item['#path'] : $path;
      $url = url($path, array('query' => $item['#query']));
      $options[$url] = $item['#markup'] . ' (' . $item['#count'] . ')';
    }

    return $options;
  }

  /**
   * Build options with optgroups (for dates).
   */
  protected function buildOptgroupOptions($element) {
    $options = array();

    foreach ($element as $item) {
      list($month, $year) = explode(' ', $item['#markup']);

      $path = !empty($this->settings->settings['submit_page']) ? $this->settings->settings['submit_page'] : $item['#path'];
      $path = strpos($item['#path'], $path) === 0 ? $item['#path'] : $path;
      $url = url($path, array('query' => $item['#query']));
      $options[$year][$url] = $item['#markup'] . ' (' . $item['#count'] . ')';
    }

    return $options;
  }

  /**
   * Creates a select facet form.
   */
  protected function createSelectElement($options, $count) {
    $name = 'facetapi_select_facet_form_' . $count;
    $form['facets'] = array(
      '#type' => 'select',
      '#id' => $name,
      '#default_value' => '',
      '#options' => $options,
      '#attributes' => array('onchange' => "top.location.href=document.getElementById('$name').options[document.getElementById('$name').selectedIndex].value"),
    );
    return $form;
  }
}
