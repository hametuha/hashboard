/*!
 * Hashboard Helper Script
 *
 * @deps jquery, hb-plugins-toast, hb-plugins-fitrows, wp-api-fetch, wp-url
 */

const $ = jQuery;
const { apiFetch } = wp;
const { addQueryArgs } = wp.url;
const { toast } = hb.plugins;

// Initialize sidebar for animation
$( document ).ready( function() {
	$( '.hb-sidebar' ).addClass( 'initialized' );
} );

// Sidebar toggle buttons.
$( document ).on( 'click', '.side-nav-toggle', function() {
	$( $( this ).attr( 'data-target' ) ).toggleClass( 'open' );
	const $backdrop = $( '.hb-sidebar-backdrop' );
	if ( $backdrop.length ) {
		$backdrop.remove();
	} else {
		$( 'body' ).append( '<div class="hb-sidebar-backdrop"></div>' );
	}
} );
// Backdrop
$( document ).on( 'click', '.hb-sidebar-backdrop', function() {
	$( '.hb-sidebar' ).removeClass( 'open' );
	$( this ).remove();
} );

// Sidebar sub menu
$( document ).on( 'click', '.hb-submenu-trigger', function( e ) {
	e.preventDefault();
	$( this ).parents( '.hb-menu-item' ).toggleClass( 'toggle' );
} );

// Mail change handler
$( document ).on( 'click', '.hb-mail-resend, .hb-mail-cancel', function( e ) {
	e.preventDefault();
	const $button = $( this );
	const method = $button.hasClass( 'hb-mail-resend' ) ? 'PUT' : 'DELETE';
	const $form = $button.parents( 'form' );
	$form.addClass( 'loading' );
	apiFetch( {
		url: $form.attr( 'action' ),
		method,
	} ).then( ( response ) => {
		if ( 'DELETE' === method ) {
			$button.parents( '.hb-warning' ).remove();
		}
		toast( response.message || 'Success', { icon: 'done', type: 'success' } );
	} ).catch( ( error ) => {
		toast( error.message || 'Error occurred', { icon: 'error', type: 'error' } );
	} ).finally( () => {
		$form.removeClass( 'loading' );
	} );
} );

// File data store.
const fileContainer = {};
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
	let action = $form.attr( 'action' );
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
	// Build request.
	const requestParams = {
		method,
	};
	// POST, PUT, PATCH send data in body
	if ( [ 'POST', 'PUT', 'PATCH' ].includes( method ) ) {
		requestParams.data = params;
	} else {
		// GET, DELETE send data as query parameters
		action = addQueryArgs( action, params );
	}
	requestParams.url = action;
	// Make request.
	apiFetch( requestParams ).then( function( response ) {
		toast( response.message || 'Success', { icon: 'done', type: 'success' } );
		$( document ).trigger( 'updated.form.hashboard', [ $form, response ] );
	} ).catch( function( response ) {
		toast( response.message || 'Error occurred', { icon: 'error', type: 'error' } );
	} ).finally( function() {
		$form.removeClass( 'loading' );
	} );
} );

/**
 * Display status if form has message box.
 *
 * @param {jQuery} $form
 */
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
	apiFetch( {
		url: endpoint,
		method: 'GET',
	} ).then( ( response ) => {
		$statusBox.removeClass( 'success error' );
		if ( response.success ) {
			$statusBox.addClass( 'success' );
		} else {
			$statusBox.addClass( 'error' );
		}
		$statusBox.text( response.message );
	} ).catch( ( error ) => {
		$statusBox.addClass( 'error' );
		if ( error.message ) {
			$statusBox.text( error.message );
		}
	} ).finally( () => {
		$statusBox.removeClass( 'loading loading-small' );
	} );
};

// When data is updated.
$( document ).on( 'updated.form.hashboard', function( event, $form ) {
	handleStatus( $form );
} );

// When form is displayed.
$( document ).ready( function() {
	$( '.hb-form' ).each( function( index, form ) {
		handleStatus( $( form ) );
	} );
} );

// Form update handler.
$( document ).on( 'updated.form.hashboard', function( event, $form, response ) {
	switch ( $form.attr( 'id' ) ) {
		case 'form-picture':
			// Update profile picture
			$form.find( '.avatar' ).attr( 'src', response.avatar_url );
			$form.get( 0 ).reset();
			break;
		case 'form-password':
			// Reset password.
			$form.trigger( 'reset' );
			break;
	}
} );
