/**
 * Toast
 *
 * wpdeps=jquery
 */

window.Hashboard = window.Hashboard || {};

( function( $ ) {

  'use strict';

  let Hashboard = window.Hashboard;

  Hashboard.toast = function( html, duration ) {
    let $toast = $( '<div class="toast"></div>' );
    $toast.html( html );
    $( 'body' ).append( $toast );
    $toast.addClass( 'init' );
    setTimeout( function() {
      if ( duration ) {
        setTimeout( function() {
          $toast.removeClass( 'init' );
        }, duration );
      }
    }, 1 );
  };

}( jQuery ) );
