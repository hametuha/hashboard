<?php
namespace Hametuha\Hashboard\Screens;


use Hametuha\Hashboard\Pattern\Screen;

/**
 * Profile screen.
 *
 * @package hashboard
 */
class Profile extends Screen {

	protected $icon = 'account_circle';

	/**
	 * String
	 *
	 * @return string
	 */
	public function slug() {
		return 'profile';
	}

	/**
	 * Get profile.
	 *
	 * @return string
	 */
	public function label() {
		return __( 'Profile', 'hashboard' );
	}

	/**
	 * Set children.
	 *
	 * @return array
	 */
	protected function default_children() {
		return [
			'profile'  => __( 'Profile', 'hashboard' ),
			'contacts' => __( 'Contacts', 'hashboard' ),
		];
	}


	/**
	 * Get description of this screen.
	 *
	 * @return string
	 */
	public function description() {
		return __( 'Your public profile.', 'hashboard' );
	}


	/**
	 * Get field group
	 *
	 * @param null|\WP_User $user
	 * @param string        $page
	 * @return array
	 */
	public function get_field_groups( $user = null, $page = '' ) {
		if ( is_null( $user ) ) {
			$user = wp_get_current_user();
		}
		$groups = [
			'names' => [
				'label' => __( 'Name', 'hashboard' ),
				'fields' => [
					'display_name' => [
						'label' => __( 'Display Name', 'hashboard' ),
						'type' => 'text',
						'value' => $user->display_name,
					],
					'first_name' => [
						'label' => __( 'First Name', 'hashboard' ),
						'type' => 'text',
						'group' => 'open',
						'col' => 2,
					],
					'last_name' => [
						'label' => __( 'Last Name', 'hashboard' ),
						'type' => 'text',
						'group' => 'close',
						'col' => 2,
					],
					'description' => [
						'label' => __( 'Your Profile', 'hashboard' ),
						'type'  => 'textarea',
						'src'   => 'description',
					],
				]
			],
		];
		// Add contact methods.
		$methods = wp_get_user_contact_methods();
		$methods = [
			'url' => [
				'label' => 'URL',
				'type'  => 'text',
				'value' => $user->user_url,
			],
		];
		foreach ( wp_get_user_contact_methods() as $key => $label ) {
			$methods[ $key ] = [
				'label' => $label,
				'type'  => 'text',
				'src'   => $key,
			];
		}
		if ( $methods ) {
			$groups['contacts'] = [
				'label' => __( 'Contacts', 'hashboard' ),
				'fields' => $methods,
			];
		}
		return $groups;
	}

}
