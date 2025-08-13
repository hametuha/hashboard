<?php

namespace Hametuha\Hashboard\Router;


use Hametuha\Hashboard;
use Hametuha\SingletonPattern\Singleton;

/**
 * Handle profile page routing.
 *
 * @package hashboard
 */
class Profile extends Singleton {

	/**
	 * @var string[] List of allowed roles.
	 */
	private $allowed_roles = array( 'administrator' );

	/**
	 * URL to be redirected.
	 *
	 * @return string
	 */
	protected function get_profile_url() {
		$url = Hashboard::get_instance()->get_url( \Hametuha\Hashboard\Screens\Profile::get_instance() );
		/**
		 * hashboard_profile_url
		 *
		 * URL to be redirected.
		 *
		 * @param string $url
		 * @return string
		 */
		return apply_filters( 'hashboard_profile_url', $url );
	}

	/**
	 * Handle profile
	 */
	protected function init() {
		// Redirect user to hashboard profile.
		add_action( 'admin_init', array( $this, 'redirect_admin_profile' ) );
	}

	/**
	 * Redirect user to hashboard page.
	 */
	public function redirect_admin_profile() {
		if ( ! ( defined( 'IS_PROFILE_PAGE' ) && IS_PROFILE_PAGE ) ) {
			return;
		}
		if ( $this->user_can( get_current_user_id() ) ) {
			return;
		}
		wp_redirect( $this->get_profile_url() );
		exit;
	}

	/**
	 * Allow external role insert.
	 *
	 * @param array $roles
	 */
	public function set_roles( $roles = array() ) {
		$roles               = (array) $roles;
		$this->allowed_roles = $roles;
	}

	/**
	 * Get user capability.
	 *
	 * @param int $user_id
	 * @return bool
	 */
	public function user_can( $user_id ) {
		if ( ! ( $user = get_userdata( $user_id ) ) ) {
			return false;
		}
		/**
		 * hashboard_allowed_roles
		 *
		 * Roles to be allowed.
		 *
		 * @param array $roles
		 * @return array
		 */
		$roles = apply_filters( 'hashboard_allowed_roles', $this->allowed_roles );
		foreach ( $this->allowed_roles as $role ) {
			if ( $user->has_cap( $role ) ) {
				return true;
			}
		}
		return false;
	}
}
