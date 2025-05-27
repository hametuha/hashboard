/**
 * Description
 */

/*global Hashboard: true*/

( function( $ ) {
	'use strict';

	const Hashboard = window.Hashboard || {};
	const fileContainer = {};

	// Fit sidebar height to window.
	const fitHeight = function() {
		$( '#hb-side-nav' ).height( window.innerHeight );
	};

	// Initialize on ready.
	$( document ).ready( function() {
		fitHeight();
		$( '#hb-side-nav' ).addClass( 'initialized' );
	} );

	// Bind resize event.
	let timer = null;
	$( window ).on( 'resize', function() {
		if ( timer ) {
			clearTimeout( timer );
		}
		timer = setTimeout( function() {
			fitHeight();
		}, 10 );
	} );

	// Toggle buttons.
	$( document ).on( 'click', '.side-nav-toggle', function( e ) {
		$( $( this ).attr( 'data-target' ) ).toggleClass( 'open' );
		const $backdrop = $( '.hb-sidebar-backdrop' );
		if ( $backdrop.length ) {
			$backdrop.remove();
		} else {
			const backdrop = `
          <div class="hb-sidebar-backdrop">
            <button type="button" class="d-md-none side-nav-toggle" data-target="#hb-side-nav">
                <i class="material-icons">close</i>
            </button>
          </div>
        `;
			$( 'body' ).append( backdrop );
		}
	} );

	$( document ).on( 'click', '.hb-sidebar-backdrop', function( e ) {
		$( this ).find( '.side-nav-toggle' ).trigger( 'click' );
	} );

	$( document ).on( 'click', '.hb-submenu-trigger', function( e ) {
		e.preventDefault();
		$( this ).parents( '.hb-menu-item' ).toggleClass( 'toggle' );
	} );

	// File data store.
	$( document ).on( 'change', '.hb-form input[type=file]', function( e ) {
		const name = $( this ).attr( 'name' );
		if ( ! this.files.length ) {
			if ( fileContainer[ name ] ) {
				fileContainer[ name ] = null;
			}
			return;
		}
		const fr = new FileReader();
		fr.onload = function( event ) {
			fileContainer[ name ] = event.target.result;
		};
		fr.readAsDataURL( this.files[ 0 ] );
	} );

	// Form handler
	$( document ).on( 'submit', '.hb-form', function( e ) {
		e.preventDefault();
		const $form = $( this );
		const method = $form.attr( 'method' ).toUpperCase();
		const action = $form.attr( 'action' );
		const params = {};
		$form.find( 'input,select,textarea' ).each( function( index, input ) {
			const $input = $( input );
			if ( ! $input.attr( 'name' ) ) {
				return true;
			}
			switch ( $( input ).attr( 'type' ) ) {
				case 'checkbox':
				case 'radio':
					if ( $input.attr( 'checked' ) ) {
						params[ $input.attr( 'name' ) ] = $input.val();
					}
					break;
				case 'file':
					params[ $input.attr( 'name' ) ] = fileContainer[ $input.attr( 'name' ) ];
					break;
				default:
					params[ $input.attr( 'name' ) ] = $input.val();
					break;
			}
		} );
		$form.addClass( 'loading' );
		$.hbRest( method, action, params ).done( function( response ) {
			Hashboard.toast( '<span><i class="material-icons success">done</i>' + response.message + '</span>', 4000 );
			$( document ).trigger( 'updated.form.hashboard', [ $form, response ] );
		} ).fail( function( response ) {
			Hashboard.toast( '<span><i class="material-icons error">error</i>' + response.responseJSON.message + '</span>', 4000 );
		} ).always( function() {
			$form.removeClass( 'loading' );
		} );
	} );

	// Avatar handler.
	$( document ).on( 'updated.form.hashboard', function( event, $form, response ) {
		switch ( $form.attr( 'id' ) ) {
			case 'form-picture':

				// Update profile picture
				$form.find( '.avatar' ).attr( 'src', response.avatar_url );
				$form.get( 0 ).reset();
				break;
		}
	} );

	// Mail change handler
	$( document ).on( 'click', '.hb-mail-resend, .hb-mail-cancel', function( e ) {
		e.preventDefault();
		const $button = $( this );
		const method = $button.hasClass( 'hb-mail-resend' ) ? 'PUT' : 'DELETE';
		const $form = $button.parents( 'form' );
		$form.addClass( 'loading' );
		$.hbRest( method, $( this ).attr( 'href' ) ).done( function( response ) {
			if ( 'DELETE' === method ) {
				$button.parents( '.hb-warning' ).remove();
			}
			Hashboard.toast( '<span><i class="material-icons success">done</i>' + response.message + '</span>', 4000 );
		} ).fail( function( response ) {
			Hashboard.toast( '<span><i class="material-icons error">error</i>' + response.responseJSON.message + '</span>', 4000 );
		} ).always( function() {
			$form.removeClass( 'loading' );
		} );
	} );

	const handleStatus = function( $form ) {
		const $statusBox = $form.find( '.hb-status-display' );

		// Check if box exists.
		if ( ! $statusBox.length ) {
			return;
		}

		// Check if source exists
		const endpoint = $statusBox.attr( 'data-endpoint' );
		if ( ! endpoint ) {
			return;
		}

		// O.K. Let's grab it.
		$statusBox.addClass( 'loading loading-small' );
		$.hbRest( 'GET', endpoint ).done( function( response ) {
			$statusBox.removeClass( 'success error' );
			if ( response.success ) {
				$statusBox.addClass( 'success' );
			} else {
				$statusBox.addClass( 'error' );
			}
			$statusBox.text( response.message );
		} ).fail( function( response ) {
			$statusBox.addClass( 'error' );
			if ( response.responseJSON.message ) {
				$statusBox.text( response.responseJSON.message );
			}
		} ).always( function() {
			$statusBox.removeClass( 'loading loading-small' );
		} );
	};

	// When data is updated.
	$( document ).on( 'updated.form.hashboard', function( event, $form, response ) {
		handleStatus( $form );
	} );

	// When form is displayed.
	$( document ).ready( function() {
		$( '.hb-form' ).each( function( index, form ) {
			handleStatus( $( form ) );
		} );
	} );
}( jQuery ) );
