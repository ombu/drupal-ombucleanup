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

    $facet_active = FALSE;
    foreach ($element as $item) {
      $path = !empty($this->settings->settings['submit_page']) ? $this->settings->settings['submit_page'] : $item['#path'];
      $path = strpos($item['#path'], $path) === 0 ? $item['#path'] : $path;
      $url = url($path, array('query' => $item['#query']));
      $options[$url] = $item['#markup'] . ' (' . $item['#count'] . ')';
      if ($item['#active']) {
        $facet_active = TRUE;
      }
    }

    if (!$facet_active) {
      if (!empty($settings->settings['default_option_label'])) {
        array_unshift($options, $settings->settings['default_option_label']);
      }
      else {
        array_unshift($options, t('--Choose--'));
      }
    }

    // We keep track of how many facets we're adding, because each facet form
    // needs a different form id.
    if (end($options) !== '(-)') {
      $element = facetapi_select_facet_form($form_state, $options, $count);

      $element['#attached']['js'][] = array(
        drupal_get_path('module', 'ombucleanup') . '/js/facetapi_select.js',
      );
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
    $form['submit'] = array(
      '#type' => 'submit',
      '#attributes' => array('class' => array('facetapi-select-submit')),
      '#value' => t('Submit'),
    );
    return $form;
  }
}
