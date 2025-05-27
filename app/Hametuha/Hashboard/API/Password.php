<?php

namespace Hametuha\Hashboard\API;


use Hametuha\Hashboard\Pattern\Api;

/**
 * Password change API
 *
 * @package hashboard
 */
class Password extends Api {

	protected $route = 'user/password';

	/**
	 * Should return arguments.
	 *
	 * @param string $http_method
	 * @return array
	 */
	protected function get_args( $http_method ) {
		switch ( $http_method ) {
			case 'POST':
				return array(
					'user_pass'  => array(
						'required'          => true,
						'validate_callback' => function ( $var ) {
							return 8 <= strlen( $var );
						},
					),
					'user_pass2' => array(
						'required'          => true,
						'validate_callback' => function ( $var, \WP_REST_Request $request ) {
							return $var === $request->get_param( 'user_pass' );
						},
					),
				);
				break;
			default:
				return array();
				break;
		}
	}

	/**
	 * Handle password change
	 *
	 * @param \WP_REST_Request $request
	 * @return array|\WP_Error
	 * @throws \Exception
	 */
	protected function handle_post( \WP_REST_Request $request ) {
		$result = wp_update_user( array(
			'ID'        => get_current_user_id(),
			'user_pass' => $request['user_pass'],
		) );
		if ( is_wp_error( $result ) ) {
			return $request;
		} else {
			return array(
				'success' => true,
				'message' => __( 'Your password successfully changed.', 'hashboard' ),
			);
		}
	}
}
