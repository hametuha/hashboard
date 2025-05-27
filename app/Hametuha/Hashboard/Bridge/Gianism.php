<?php

namespace Hametuha\Hashboard\Bridge;


use Hametuha\Hashboard;
use Hametuha\Pattern\Singleton;

/**
 * Gianism Bridge class
 *
 * @package hashboard
 */
class Gianism extends Singleton {

	protected function init() {
		if ( class_exists( 'Gianism\\Helper\\Option' ) && \Gianism\Helper\Option::get_instance()->is_enabled() ) {
			add_filter( 'hashboard_screen_children', array( $this, 'add_gianism_screen' ), 10, 2 );
			add_filter( 'hashboard_field_groups', array( $this, 'add_field_groups' ), 10, 4 );
			add_action( 'hashboard_before_fields_rendered', array( $this, 'account_notice' ), 10, 3 );
		}
	}

	/**
	 * Add gianism screen.
	 *
	 * @param $children
	 * @param $slug
	 * @return mixed
	 */
	public function add_gianism_screen( $children, $slug ) {
		if ( 'account' == $slug ) {
			$children['sns'] = __( 'SNS Account', 'hashboard' );
			add_action( 'hashboard_head', array( \Gianism\Bootstrap::get_instance(), 'enqueue_global_assets' ) );
		}
		return $children;
	}

	/**
	 * Add Gianism fields
	 *
	 * @param array $fields
	 * @param \WP_User $user
	 * @param string $slug
	 * @param string $page
	 * @return array
	 */
	public function add_field_groups( $fields, $user, $slug, $page ) {
		if ( 'account' == $slug && 'sns' == $page ) {
			ob_start();
			Hashboard::load_template( 'gianism.php', array( 'user' => $user ) );
			$html = ob_get_contents();
			ob_end_clean();
			$fields['sns'] = array(
				'label'       => __( 'SNS Account', 'hashboard' ),
				'description' => __( 'Manage your SNS accounts.', 'hashboard' ),
				'submit'      => false,
				'fields'      => array(
					'gianism-accounts' => array(
						'html' => $html,
					),
				),
			);
		}
		return $fields;
	}

	/**
	 * Render notice on account screen.
	 *
	 * @param string $slug
	 * @param string $page
	 * @param string $name
	 */
	public function account_notice( $slug, $page, $name ) {
		if ( 'account' != $slug || '' != $page ) {
			return;
		}
		$string = esc_html__( 'Your %s is generated automatically by SNS login. Please change it to valid one. Otherwise, you may be locked from your account.', 'hashboard' );
		switch ( $name ) {
			case 'account':
				if ( preg_match( '#@pseud\.[^.]+\.[^.]+$#u', wp_get_current_user()->user_email ) ) {
					?>
					<div class="row">
						<div class="col s12">
							<div class="hb-error">
								<?php printf( $string, __( 'Email' ) ); ?>
							</div>
						</div>
					</div>
					<?php
				}
				break;
			case 'password':
				if ( get_user_meta( get_current_user_id(), '_wpg_unknown_password', true ) ) {
					?>
					<div class="row">
						<div class="col s12">
							<div class="hb-error">
								<?php printf( $string, __( 'Password' ) ); ?>
							</div>
						</div>
					</div>
					<?php
				}
				break;
		}
	}
}
