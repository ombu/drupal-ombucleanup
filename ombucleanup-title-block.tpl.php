<?php

/**
 * @file
 * Default theme for page title block.
 *
 * Available variables:
 *
 * - $title: the current page title
 * - $node: if viewing a node page, the fully loaded node object.
 * - $content: if viewing a node page, and node has been configured to display
 *   fields on the title_block display mode, then $content will contain render
 *   array for fields.
 */
?>

<h1><?php print $title ?></h1>

<?php if ($node || $show_content): ?>
  <?php print render($content) ?>
<?php endif ?>
