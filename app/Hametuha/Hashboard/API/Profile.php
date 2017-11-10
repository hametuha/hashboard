<?php

namespace Hametuha\Hashboard\API;


use Hametuha\Hashboard\Pattern\Api;

/**
 * Password change API
 *
 * @package hashboard
 */
class Profile extends Api {

	protected $route = 'user/profile';

	protected $values = [
		'display_name' => true,
		'nickname'     => true,
		'first_name'   => false,
		'last_name'    => false,
		'description'  => false,
	];

	/**
	 * Should return arguments.
	 *
	 * @param string $http_method
	 * @return array
	 */
	protected function get_args( $http_method ) {
		switch ( $http_method ) {
			case 'POST':
				$args = [];
				foreach ( $this->values as $key => $not_empty ) {
					$arg = [
						'required' => false,
					];
					if ( $not_empty ) {
						$args['validate_callback'] = [ $this, 'is_not_empty' ];
					}
					$args[ $key ] = $arg;
				}
				return $args;
				break;
			default:
				return [];
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
		$errors = new \WP_Error();
		foreach ( $this->values as $key => $is_not_empty ) {
			$param = $request->get_param( $key );
			if ( is_null( $param ) ) {
				continue;
			}
			switch ( $key ) {
				case 'display_name':
					$result = wp_update_user( [
						'ID' => get_current_user_id(),
						'display_name' => $param,
					] );
					if ( is_wp_error( $result ) ) {
						$errors->add( $result->get_error_code(), $result->get_error_message() );
					}
					break;
				default:
					update_user_meta( get_current_user_id(), $key, $param );
					break;
			}
		}
		if ( $errors->get_error_messages() ) {
			return $errors;
		} else {
			return [
				'success' => true,
				'message' => __( 'Your profile has been updated.', 'hashboard' ),
			];
		}
	}

}
