<?php
namespace Hametuha\Hashboard\Screens;


use Hametuha\Hashboard;
use Hametuha\Hashboard\Pattern\Screen;
use Hametuha\Hashboard\Service\UserContacts;

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
		$page = [
			'profile'  => __( 'Profile', 'hashboard' ),
		];
		if ( wp_get_user_contact_methods() ) {
			$page[ 'contacts' ] = __( 'Contacts', 'hashboard' );
		}
		return $page;
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
		switch ( $page ) {
			case 'contacts':
				$groups = [];
				$methods = UserContacts::get_instance()->get_user_contact_methods( $user );
				if ( $methods ) {
					$groups[ 'contacts' ] = [
						'label' => __( 'Contacts', 'hashboard' ),
						'action' => rest_url( 'hashboard/v1/user/contacts' ),
						'method' => 'POST',
						'submit' => __( 'Update', 'hashboard' ),
						'fields' => $methods,
					];
				}
				return $groups;
				break;
			default:
				ob_start();
				Hashboard::load_template( 'gravatar.php', [ 'user' => $user ] );
				$avatar = ob_get_contents();
				ob_end_clean();
				return [
					'names' => [
						'label' => __( 'Name', 'hashboard' ),
						'action' => rest_url( 'hashboard/v1/user/profile' ),
						'method' => 'POST',
						'submit' => __( 'Update Profile', 'hashboard' ),
						'fields' => [
							'display_name' => [
								'label' => __( 'Display Name', 'hashboard' ),
								'type' => 'text',
								'value' => $user->display_name,
								'group' => 'open',
								'col' => 2,
							],
							'nickname' => [
								'label' => __( 'Nickname', 'hashboard' ),
								'type' => 'text',
								'src' => 'nickname',
								'group' => 'close',
								'col' => 2,
							],
							'first_name' => [
								'label' => __( 'First Name', 'hashboard' ),
								'src'  => 'first_name',
								'type' => 'text',
								'group' => 'open',
								'col' => 2,
							],
							'last_name' => [
								'label' => __( 'Last Name', 'hashboard' ),
								'src'  => 'last_name',
								'type' => 'text',
								'group' => 'close',
								'col' => 2,
							],
							'description' => [
								'label' => __( 'Your Profile', 'hashboard' ),
								'type' => 'textarea',
								'src' => 'description',
							],
						]
					],
					'picture' => [
						'label' => __( 'Profile Picture', 'hashboard' ),
						'method' => 'POST',
						'action' => rest_url( '/hashboard/v1/user/avatar' ),
						'submit' => __( 'Upload', 'hashboard' ),
						'fields' => [
							'gravatar' => [
								'html'  => $avatar,
								'group' => 'open',
								'col'   => 2,
							],
							'local_img' => [
								'label' => __( 'Select Photo', 'hashboard' ),
								'type'  => 'file',
								'group' => 'close',
								'col'   => 2,
								'description' => __( 'You can alternatively upload image file.', 'hashboard' ),
							],
						],
					],
				];
				break;
		}
		$groups = [
		];
		// Add contact methods.
		return $groups;
	}

}
