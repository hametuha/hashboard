/*global HashRest: false*/
/*global Hashboard: false*/

( function( $ ) {
	'use strict';

	$.extend( {

		/**
		 * Short hand for rest API
		 *
		 * @scope {jQuery}
		 * @param {string}  method
		 * @param {string}  url
		 * @param {Object}  data
		 * @param {boolean} processData
		 */
		hbRest: function( method, url, data ) {
			method = method.toUpperCase();
			if ( ! /^https?:\/\//.test( url ) ) {
				url = HashRest.root + url;
			}

			const args = {
				method: method,
				beforeSend: function( xhr ) {
					xhr.setRequestHeader( 'X-WP-Nonce', HashRest.nonce );
				},
			};
			if ( data ) {
				switch ( method ) {
					case 'PUT':
					case 'POST':
					case 'PUSH':
						args.data = data;
						break;
					default:
						const query = [];
						for ( const prop in data ) {
							if ( data.hasOwnProperty( prop ) ) {
								query.push( prop + '=' + encodeURIComponent( data[ prop ] ) );
							}
						}
						if ( query.length ) {
							url += '?' + query.join( '&' );
						}
						break;
				}
			}
			args.url = url;
			return $.ajax( args );
		},

		/**
		 * Returns error handler.
		 *
		 * @return {Function}
		 */
		hbRestError: function() {
			return function( response ) {
				const msg = $.hbValues( response, 'responseJSON.message', HashRest.error );
				$.hbErrorMessage( msg );
			};
		},

		/**
		 * Display error message.
		 *
		 * @param {string} msg
		 */
		hbErrorMessage: function( msg ) {
			$.hbMessage( msg, 'error', 'close' );
		},

		/**
		 * Display success message.
		 *
		 * @param {string} msg
		 * @param {string} icon     Default, info.
		 * @param {string} color    Default, error.
		 * @param {number} duration Milliseconds to disappear. Default 4000.
		 */
		hbMessage: function( msg, color, icon, duration ) {
			if ( ! color ) {
				color = 'info';
			}
			if ( ! icon ) {
				switch ( color ) {
					case 'success':
						icon = 'check_circle';
						break;
					case 'error':
						icon = 'close';
						break;
					default:
						icon = 'info';
						break;
				}
			}
			if ( ! duration ) {
				duration = 4000;
			}
			Hashboard.toast( '<i class="material-icons ' + color + '">' + icon + '</i>' + msg, duration );
		},

		/**
		 * Get object property in any depth.
		 *
		 * @param {Object} obj            Object.
		 * @param {string} key            Property name of object.
		 * @param {*}      undefinedValue Default value.
		 * @return {*}
		 */
		hbValues: function( obj, key, undefinedValue ) {
			const k = key.split( '.' );
			let v = obj;
			for ( let i = 0; i < k.length; i++ ) {
				if ( ! ( k[ i ] in v ) ) {
					return undefinedValue;
				}
				v = v[ k[ i ] ];
			}
			return v;
		},
	} );
}( jQuery ) );
