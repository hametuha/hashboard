/*!
 * Toast Plugin
 *
 * @handle hb-toast
 * @deps jquery
 */

window.Hashboard = window.Hashboard || {};

( function( $ ) {
	'use strict';

	const Hashboard = window.Hashboard;

	Hashboard.toast = function( html, duration ) {
		const $toast = $( '<div class="toast"></div>' );
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
