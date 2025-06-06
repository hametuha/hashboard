<?php

namespace Hametuha\Hashboard\Screens;


use Hametuha\Hashboard;
use Hametuha\Hashboard\Pattern\Screen;
use Hametuha\Hashboard\Service\UserMail;

/**
 * Account screen
 *
 * @package hashboard
 */
class Account extends Screen {

	protected $icon = 'lock_outline';

	protected function default_children() {
		$children = array(
			'account' => __( 'Your Account', 'hashboard' ),
		);
		return $children;
	}

	public function slug() {
		return 'account';
	}

	public function label() {
		return __( 'Account', 'hashboard' );
	}

	public function description( $page = '' ) {
		return __( 'Your account information. These will be secret.', 'hashboard' );
	}

	/**
	 * Executed inside constructor.
	 */
	protected function init() {
		parent::init();
		add_action( 'hashboard_after_field_rendered', array( $this, 'after_field_rendered' ), 10, 3 );
	}

	/**
	 * Get field group
	 *
	 * @param null|\WP_User $user
	 * @param string $page
	 * @return array
	 */
	public function get_field_groups( $user = null, $page = '' ) {
		if ( is_null( $user ) ) {
			$user = wp_get_current_user();
		}
		switch ( $page ) {
			case '':
				return array(
					'account'  => array(
						'label'       => __( 'Account', 'hashboard' ),
						'description' => $this->get_mail_description( $user ),
						'submit'      => __( 'Change Email', 'hashboard' ),
						'action'      => rest_url( '/hashboard/v1/user/account/' ),
						'method'      => 'POST',
						'fields'      => array(
							'user_email' => array(
								'label'       => __( 'Enter new email here', 'hashboard' ),
								'type'        => 'email',
								'value'       => '',
								'placeholder' => '',
								'icon'        => 'mail_outline',
							),
						),
					),
					'password' => array(
						'label'       => __( 'Password', 'hashboard' ),
						'description' => __( 'To change password, enter new password here. If you leave blank, nothing will be changed.', 'hashboard' ),
						'action'      => rest_url( '/hashboard/v1/user/password' ),
						'method'      => 'POST',
						'submit'      => __( 'Save New Password', 'hashboard' ),
						'fields'      => array(
							'user_pass'  => array(
								'label'       => __( 'New Password', 'hashboard' ),
								'type'        => 'password',
								'description' => wp_get_password_hint(),
								'icon'        => 'vpn_key',
							),
							'user_pass2' => array(
								'label'       => __( 'Enter password again', 'hashboard' ),
								'type'        => 'password',
								'description' => __( 'For confirmation, enter same password as above.', 'hashboard' ),
								'icon'        => 'replay',
							),
						),
					),
				);
				break;
			default:
				return array();
				break;
		}
	}

	/**
	 * Render email notice
	 *
	 * @param string   $key
	 * @param array    $fields
	 * @param \WP_User $user
	 */
	public function after_field_rendered( $key, $fields, $user ) {
		if ( 'user_email' == $key ) {
			$controller = UserMail::get_instance();
			if ( $controller->has_queue( $user->ID ) ) {
				?>
				<div class="alert alert-warning hb-warning">
					<?php
					printf(
						// translators:
						wp_kses_post( __( 'You are now requesting <code>%1$s</code> as new email. Please check your mail box and finish confirmation. Otherwise, <a href="%2$s" class="hb-mail-resend alert-link">resend</a> or <a href="%2$s" class="hb-mail-cancel alert-link">cancel request</a>.', 'hashboard' ) ),
						esc_html( get_user_meta( $user->ID, $controller::NEW_MAIL_KEY, true ) ),
						rest_url( 'hashboard/v1/user/account' )
					)
					?>
				</div>
				<?php
			}
		}
		if ( 'user_pass2' == $key ) {
			$black_lists = array( $user->user_login, current( explode( '@', $user->user_email ) ), $user->first_name, $user->last_name );
			printf( '<div id="hb-password-strength" data-blacklists="%s">%s<span></span></div>', esc_attr( implode( ',', $black_lists ) ), esc_html__( 'Password Strength: ', 'hashboard' ) );
		}
	}

	/**
	 * Get mail instructison
	 *
	 * @param \WP_User $user
	 * @return string
	 */
	protected function get_mail_description( \WP_User $user ) {
		$messages = sprintf( __( '<p>Your current email is <code>%s</code>. To change email, enter new one and proceed to confirmation process.</p>', 'hashboard' ), esc_html( $user->user_email ) );
		return $messages;
	}

	/**
	 * Footer action
	 */
	public function footer() {
		wp_enqueue_script( 'hb-components-password' );
	}
}
