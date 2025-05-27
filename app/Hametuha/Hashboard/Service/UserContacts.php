<?php

namespace Hametuha\Hashboard\Service;


use Hametuha\Pattern\Singleton;

/**
 * User contact methods
 *
 * @package hashboard
 */
class UserContacts extends Singleton {

	/**
	 * Get user contact methods for hashboard
	 *
	 * @param \WP_User $user
	 * @return array
	 */
	public function get_user_contact_methods( $user = null ) {
		if ( is_null( $user ) ) {
			$user = wp_get_current_user();
		}
		$methods = array(
			'url' => array(
				'label'       => 'URL',
				'type'        => 'url',
				'value'       => $user->user_url,
				'placeholder' => 'https://example.com',
			),
		);
		foreach ( wp_get_user_contact_methods() as $key => $label ) {
			$methods[ $key ] = array(
				'label' => $label,
				'type'  => 'text',
				'src'   => $key,
			);
		}
		/**
		 * hashboard_contact_fields
		 *
		 * @param array $methods
		 * @param \WP_User $user
		 */
		$methods = apply_filters( 'hashboard_contact_fields', $methods, $user );
		return $methods;
	}
}
