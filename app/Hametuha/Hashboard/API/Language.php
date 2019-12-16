<?php

namespace Hametuha\Hashboard\API;


use Hametuha\Hashboard\Pattern\Api;

/**
 * Language attributes
 *
 * @package hashboard
 */
class Language extends Api {

	protected $route = 'user/language';
	
	/**
	 * Check locale format.
	 *
	 * @param string $locale
	 * @return bool
	 */
	public static function is_valid_locale( $locale ) {
		if ( '' === $locale ) {
			return true;
		} elseif ( preg_match( '/^[a-z]+_[a-zA-Z]+$/', $locale ) ) {
			return true;
		} elseif ( preg_match( '/^[a-z]+$/', $locale ) ) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Should return arguments.
	 *
	 * @param string $http_method
	 * @return array
	 */
	protected function get_args( $http_method ) {
		$args = [];
		switch ( $http_method ) {
			case 'POST':
				$args['locale'] = [
					'required' => true,
					'validate_callback' => function( $var ) {
						return self::is_valid_locale( $var );
					}
				];
				break;
			default:
				// Do nothing.
				break;
		}
		/**
		 * hashboard_user_language_rest_args
		 *
		 * @param array  $args
		 * @param string $http_method
		 */
		return apply_filters( 'hashboard_user_language_rest_args', $args, $http_method );
	}

	/**
	 * Handle POST
	 *
	 * @param \WP_REST_Request $request
	 * @return \WP_Error|array
	 */
	public function handle_post( $request ) {
		$error = new \WP_Error();
		$locale = $request->get_param( 'locale' );
		$error = apply_filters( 'hashboard_update_user_language_error', $error, $request );
		if ( $error->get_error_messages() ) {
			return $error;
		}
		update_user_meta( get_current_user_id(), 'locale', $locale );
		return [
			'success' => true,
			'message' => __( 'Your language setting is updated.', 'hashboard' ),
		];
	}

}
