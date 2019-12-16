/*!
 * wpdeps=jquery
 */

( function( $ ) {

  'use strict';

  /**
   * Fit textarea's height with rows.
   */
  $.fn.fitRows = function() {
    if ( ! this.length ) {
      return;
    }
    let computed = parseInt( window.getComputedStyle( this.get( 0 ) ).getPropertyValue( 'line-height' ).replace( /[^0-9.]/, '' ), 10 );
    let height   = this.get( 0 ).scrollHeight;
    let min = this.attr( 'data-min-rows' ) || 1;
    let lines = Math.max( Math.floor( height / computed ), 1 );
    this.attr( 'rows', lines );
  };

  // Bind to keyup.
  $( document ).on( 'keyup', 'textarea.resizable', function() {
    $( this ).fitRows();
  });

  // Bind to DOM_READY
  $( document ).ready( function() {
    $( 'textarea.resizable' ).fitRows();
  });


}( jQuery ) );
