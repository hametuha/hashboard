/*!
 * Dashboard widgets
 * wpdeps=masonry,jquery
 */

/*global Hashboard: true*/
/*global Vue: false*/

if ( ! window.Hashboard ) {
  window.Hashboard = {};
}

/**
 * Rearrange masonry block.
 */
Hashboard.masonry = function() {
  'use strict';
  jQuery( '.hb-masonry' ).masonry( 'layout' );
};

jQuery( document ).ready( function( $ ) {
  'use strict';

  // Setup masonry.
  let $grid = $( '.hb-masonry' ).masonry({
    columnWidth: '.hb-masonry-sizer',
    itemSelector: '.hb-masonry-block',
    percentPosition: true
  });

  // Trigger images loaded event.
  $grid.imagesLoaded().progress( function() {
    $grid.masonry( 'layout' );
  });

  // Watch resize event.
  $grid.on( 'block-change', function() {
    $grid.masonry( 'layout' );
  });

});

( function() {
  'use strict';
  let app = new Vue({
    el: '#hb-dashboard-masonry',
    mounted: function() {

      //
    },
    data: {
      masonry: null
    },
    methods: {
      updated: function() {
        let self = this;
        setTimeout( function() {
          self.$grid.masonry( 'layout' );
        }, 10 );
      }
    },
    computed: {
      $grid: function() {
        if ( ! this.masonry ) {
          this.masonry = jQuery( '.hb-masonry' );
        }
        return this.masonry;
      }
    }
  });
}() );
