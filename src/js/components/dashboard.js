/*!
 * Dashboard widgets
 * wpdeps=masonry,jquery
 */

/*global hoge: true*/

jQuery(document).ready(function ($) {
  'use strict';

  // Setup masonry.
  var $grid = $('.hb-masonry').masonry({
    columnWidth: '.hb-masonry-sizer',
    itemSelector: '.hb-masonry-block',
    percentPosition: true
  });

  // Trigger images loaded event.
  $grid.imagesLoaded().progress( function() {
    $grid.masonry('layout');
  });

});
