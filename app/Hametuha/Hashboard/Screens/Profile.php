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

	public function slug() {
		return 'profile';
	}

	public function label() {
		return __( 'Profile', 'hashboard' );
	}

	/**
	 * Set children.
	 *
	 * @return array
	 */
	protected function default_children() {
		$page = array(
			'profile' => __( 'Profile', 'hashboard' ),
		);
		if ( wp_get_user_contact_methods() ) {
			$page['contacts'] = __( 'Contacts', 'hashboard' );
		}
		/**
		 * hashboard_user_can_change_language
		 *
		 * Add interface for change user languages.
		 */
		$allow_user_can_change_lang = apply_filters( 'hashboard_user_can_change_language', false );
		if ( $allow_user_can_change_lang ) {
			$page['language'] = __( 'Language', 'hashboard' );
		}
		return $page;
	}

	public function description( $page = '' ) {
		switch ( $page ) {
			case 'contacts':
				return __( 'These contacts are your external profile.', 'hashboard' );
				break;
			case 'language':
				return __( 'You can choose language to be displayed.', 'hashboard' );
				break;
			default:
				return __( 'Your public profile.', 'hashboard' );
				break;
		}
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
				$groups  = array();
				$methods = UserContacts::get_instance()->get_user_contact_methods( $user );
				if ( $methods ) {
					$groups['contacts'] = array(
						'label'  => __( 'Contacts', 'hashboard' ),
						'action' => rest_url( 'hashboard/v1/user/contacts' ),
						'method' => 'POST',
						'submit' => __( 'Update', 'hashboard' ),
						'fields' => $methods,
					);
				}
				return $groups;
				break;
			case 'language':
				$locales = apply_filters( 'hashboard_locale_selector', array(
					'' => sprintf( __( 'Site Default(%s)', 'hashboard' ), get_locale() ),
				) );
				return array(
					'languages' => array(
						'label'  => __( 'Language Setting', 'hashboard' ),
						'action' => rest_url( 'hashboard/v1/user/language' ),
						'method' => 'POST',
						'submit' => __( 'Update', 'hashboard' ),
						'fields' => array(
							'locale' => array(
								'label'   => __( 'Language', 'hashboard' ),
								'type'    => 'select',
								'value'   => $user->locale,
								'options' => $locales,
							),
						),
					),
				);
				break;
			default:
				ob_start();
				Hashboard::load_template( 'gravatar.php', array( 'user' => $user ) );
				$avatar = ob_get_contents();
				ob_end_clean();
				return array(
					'names'   => array(
						'label'  => __( 'Name', 'hashboard' ),
						'action' => rest_url( 'hashboard/v1/user/profile' ),
						'method' => 'POST',
						'submit' => __( 'Update Profile', 'hashboard' ),
						'fields' => array(
							'display_name' => array(
								'label' => __( 'Display Name', 'hashboard' ),
								'type'  => 'text',
								'value' => $user->display_name,
								'group' => 'open',
								'col'   => 2,
							),
							'nickname'     => array(
								'label' => __( 'Nickname', 'hashboard' ),
								'type'  => 'text',
								'src'   => 'nickname',
								'group' => 'close',
								'col'   => 2,
							),
							'first_name'   => array(
								'label' => __( 'First Name', 'hashboard' ),
								'src'   => 'first_name',
								'type'  => 'text',
								'group' => 'open',
								'col'   => 2,
							),
							'last_name'    => array(
								'label' => __( 'Last Name', 'hashboard' ),
								'src'   => 'last_name',
								'type'  => 'text',
								'group' => 'close',
								'col'   => 2,
							),
							'description'  => array(
								'label' => __( 'Your Profile', 'hashboard' ),
								'type'  => 'textarea',
								'src'   => 'description',
							),
						),
					),
					'picture' => array(
						'label'  => __( 'Profile Picture', 'hashboard' ),
						'method' => 'POST',
						'action' => rest_url( '/hashboard/v1/user/avatar' ),
						'submit' => __( 'Upload', 'hashboard' ),
						'fields' => array(
							'gravatar'  => array(
								'html'  => $avatar,
								'group' => 'open',
								'col'   => 2,
							),
							'local_img' => array(
								'label'       => __( 'Select Photo', 'hashboard' ),
								'type'        => 'file',
								'group'       => 'close',
								'col'         => 2,
								'description' => __( 'You can alternatively upload image file.', 'hashboard' ),
							),
						),
					),
				);
				break;
		}
	}
}
