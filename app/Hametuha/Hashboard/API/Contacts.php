<?php

namespace Hametuha\Hashboard\API;


use Hametuha\Hashboard\Pattern\Api;
use Hametuha\Hashboard\Service\UserContacts;

class Contacts extends Api {

	protected $route = 'user/contacts';

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
				foreach ( UserContacts::get_instance()->get_user_contact_methods() as $key => $field ) {
					switch ( $field['type'] ) {
						case 'url':
							$callback = function( $var ) {
								return empty( $var ) || preg_match( '#^[a-z]+://#u', $var ) ?: new \WP_Error( 'malformat', __( 'Should be URL format.', 'hashboard' ) );
							};
							break;
						case 'email':
							$callback = function( $var ) {
								return is_email( $var ) ?: new \WP_Error( 'malformat', __( 'Should be mail format.', 'hashboard' ) );
							};
							break;
						case 'number':
							$callback = function( $var ) {
								return is_numeric( $var ) ?: new \WP_Error( 'malformat', __( 'Should be numeric.', 'hashboard' ) );
							};
							break;
						default:
							$callback = null;
							break;
					}
					$arg = [
						'description' => isset( $field['description'] ) ? $field['description'] : $field['label'],
					];
					if ( isset( $field['default'] ) ) {
						$arg['default'] = $field['default'];
					}
					if ( $callback ) {
						$arg['validate_callback'] = $callback;
					}
					$args[ $key ] = $arg;
				}
				break;
			default:
				// Do nothing.
				break;
		}
		/**
		 * hashboard_user_contact_rest_args
		 *
		 * @param array  $args
		 * @param string $http_method
		 */
		return apply_filters( 'hashboard_user_contact_rest_args', $args, $http_method );
	}

	/**
	 * Handle POST
	 *
	 * @param \WP_REST_Request $request
	 * @return \WP_Error|array
	 */
	public function handle_post( $request ) {
		$error = null;
		foreach ( UserContacts::get_instance()->get_user_contact_methods() as $key => $fields ) {
			switch ( $key ) {
				case 'url':
					$result = wp_update_user( [
						'ID'       => get_current_user_id(),
						'user_url' => $request['url'],
					] );
					if ( is_wp_error( $result ) ) {
						$error = $result;
					}
					break;
				default:
					update_user_meta( get_current_user_id(), $key, $request[ $key ] );
					break;
			}
		}
		return is_wp_error( $error ) ? $error : [
			'success' => true,
			'message' => __( 'Your contact information is successfully updated.', 'hashboard' ),
		];
	}

}
