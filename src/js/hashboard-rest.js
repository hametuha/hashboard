/*!
 * Hashboard REST API Helper
 *
 * Uses WordPress wp-api-fetch for REST API calls
 *
 * @deps hb-plugins-toast
 * @strategy defer
 */

import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

// Define variables outside IIFE for export
let hbRest, hbErrorMessage, hbMessage, hbValues, hbRestError;

( function() {
	'use strict';

	const HashRest = window.HashRest || {};
	const Hashboard = window.Hashboard || {};

	// Configure wp-api-fetch with nonce
	if ( HashRest.nonce ) {
		apiFetch.use( apiFetch.createNonceMiddleware( HashRest.nonce ) );
	}

	// Configure root URL
	if ( HashRest.root ) {
		apiFetch.use( apiFetch.createRootURLMiddleware( HashRest.root ) );
	}

	/**
	 * REST API helper function using wp-api-fetch
	 *
	 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
	 * @param {string} path   - API endpoint path
	 * @param {Object} data   - Request data
	 * @return {Promise} Promise that resolves with response data
	 */
	hbRest = function( method, path, data = {} ) {
		method = method.toUpperCase();

		// Handle full URLs vs relative paths
		let fullPath = path;
		if ( ! /^https?:\/\//.test( path ) ) {
			// It's a relative path, will be handled by wp-api-fetch
			fullPath = path;
		} else {
			// It's a full URL, extract the path part
			try {
				const url = new URL( path );
				const root = new URL( HashRest.root );
				if ( url.origin === root.origin ) {
					// Same origin, extract path relative to root
					fullPath = path.replace( HashRest.root, '' );
				} else {
					// Different origin, use full URL
					fullPath = path;
				}
			} catch ( e ) {
				// Invalid URL, use as is
				fullPath = path;
			}
		}

		const options = {
			method,
			path: fullPath,
		};

		// Handle data based on method
		if ( data && Object.keys( data ).length > 0 ) {
			switch ( method ) {
				case 'POST':
				case 'PUT':
				case 'PATCH':
					options.data = data;
					break;
				case 'GET':
				case 'DELETE':
					// Add query parameters
					if ( ! /^https?:\/\//.test( fullPath ) ) {
						options.path = addQueryArgs( fullPath, data );
					} else {
						// For full URLs, manually add query params
						const url = new URL( fullPath );
						Object.keys( data ).forEach( ( key ) => {
							url.searchParams.append( key, data[ key ] );
						} );
						options.path = url.toString();
					}
					break;
			}
		}

		// Use wp-api-fetch for the request
		return apiFetch( options );
	};

	/**
	 * Display error message
	 *
	 * @param {string} msg - Error message to display
	 */
	hbErrorMessage = function( msg ) {
		hbMessage( msg, 'error', 'close' );
	};

	/**
	 * Display message with toast
	 *
	 * @param {string} msg      - Message to display
	 * @param {string} color    - Color class (success, error, info)
	 * @param {string} icon     - Material icon name
	 * @param {number} duration - Duration in milliseconds
	 */
	hbMessage = function( msg, color = 'info', icon = null, duration = 4000 ) {
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

		const message = `<i class="material-icons ${ color }">${ icon }</i>${ msg }`;

		if ( Hashboard.toast ) {
			Hashboard.toast( message, duration );
		}
	};

	/**
	 * Get nested object property safely
	 *
	 * @param {Object} obj          - Object to traverse
	 * @param {string} path         - Dot-notation path (e.g., 'responseJSON.message')
	 * @param {*}      defaultValue - Default value if path not found
	 * @return {*} Value at path or default value
	 */
	hbValues = function( obj, path, defaultValue ) {
		const keys = path.split( '.' );
		let value = obj;

		for ( let i = 0; i < keys.length; i++ ) {
			if ( value === null || value === undefined || ! ( keys[ i ] in value ) ) {
				return defaultValue;
			}
			value = value[ keys[ i ] ];
		}

		return value;
	};

	/**
	 * Error handler factory
	 *
	 * @return {Function} Error handler function
	 */
	hbRestError = function() {
		return function( error ) {
			const msg = error.message || hbValues( error, 'responseJSON.message', HashRest.error || 'An error occurred' );
			hbErrorMessage( msg );
		};
	};

	// Export functions to global scope for backward compatibility
	window.hbRest = hbRest;
	window.hbErrorMessage = hbErrorMessage;
	window.hbMessage = hbMessage;
	window.hbValues = hbValues;
	window.hbRestError = hbRestError;
}() );
