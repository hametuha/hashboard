<?php

namespace Hametuha\Hashboard\API;


use Hametuha\Hashboard;
use Hametuha\Hashboard\Pattern\Api;
use Hametuha\Hashboard\Service\UserMail;

/**
 * Account API
 *
 * @package hashboard
 */
class Account extends Api {

	protected $route = 'user/account';

	/**
	 * Should return arguments.
	 *
	 * @param string $http_method
	 * @return array
	 */
	protected function get_args( $http_method ) {
		switch ( $http_method ) {
			case 'POST': // Register email
				return [
					'user_email' => [
						'required' => true,
						'validate_callback' => function( $mail ) {
							return preg_match( '#^.*@.*[^.]$#u', $mail );
						},
					],
				];
				break;
			case 'PUSH': // Send email again
				return [];
				break;
			case 'GET':  // Activate
				return [
					'hash' => [
						'required' => true,
						'validate_callback' => [ $this, 'is_not_empty' ],
					],
				];
				break;
			case 'DELETE': // Cancel mail change
				return [];
				break;
			default:
				return [];
				break;
		}
	}

	/**
	 * Handle POST request.
	 *
	 * @param \WP_REST_Request $request
	 * @return array|\WP_Error
	 * @throws \Exception
	 */
	public function handle_post( \WP_REST_Request $request ) {
		$mail = $request['user_email'];
		if ( UserMail::get_instance()->exists( $mail ) ) {
			throw new \Exception( __( 'This email is already registered. Please try another.' ), 400 );
		}
		$result = UserMail::get_instance()->set_queue( get_current_user_id(), $mail );
		if ( ! $result ) {
			throw new \Exception( __( 'Sorry, but failed to accept new mail request. Please try again later.', 'hashboard' ), 500 );
		} else {
			$result = UserMail::get_instance()->notify( get_current_user_id() );
			if ( is_wp_error( $result ) ) {
				return $result;
			} elseif ( ! $result ) {
				throw new \Exception( __( 'Failed to send confirmation mail. Please check if mail address is valid.', 'hashboard' ), 500 );
			}
			return [
				'success' => true,
				'message' => $this->get_notification_message(),
			];
		}
	}

	/**
	 * Handle put request.
	 *
	 * @param \WP_REST_Request $request
	 * @return array|bool|\WP_Error
	 * @throws \Exception
	 */
	public function handle_put( \WP_REST_Request $request ) {
		$mail = UserMail::get_instance();
		if ( ! $mail->regenerate_user_hash( get_current_user_id() ) ) {
			throw new \Exception( __( 'Failed to regenerate request. try again later.', 'hashboard' ), 500 );
		}
		$result = $mail->notify( get_current_user_id() );
		if ( is_wp_error( $result ) ) {
			return $result;
		} else {
			return [
				'success' => true,
				'message' => $this->get_notification_message(),
			];
		}
	}

	/**
	 * Handle delete request.
	 *
	 * @param \WP_REST_Request $request
	 * @return array
	 */
	public function handle_delete( \WP_REST_Request $request ) {
		$result = UserMail::get_instance()->expire_user_hash( get_current_user_id() );
		return [
			'success' => true,
			'message' => __( 'Your request has been canceled.', 'hashboard' ),
		];
	}

	/**
	 * Check hash and redirect user.
	 *
	 * @param \WP_REST_Request $request
	 * @return void
	 */
	public function handle_get( \WP_REST_Request $request ) {
		try {
			$result = UserMail::get_instance()->update_user_mail( $request[ 'hash' ] );
			if ( is_wp_error( $result ) ) {
				$code = $result->get_error_code();
				if ( ! is_numeric( $code ) ) {
					$code = 500;
				}
				throw new \Exception( $result->get_error_message(), $code );
			}
			wp_redirect( Hashboard::get_instance()->get_url() );
			exit;
		} catch ( \Exception $e ) {
			header( 'Content-Type: text/html; charset=UTF8' );
			$message = esc_html( $e->getMessage() ) . '<br />' . wp_kses_post( sprintf(
				// translators: %1$s URL, %2$s site name
				__( 'Return to <a href="%1$s">%2$s</a>.', 'hashboard' ),
				Hashboard::get_instance()->get_url(),
				get_bloginfo( 'name' )
			) );
			wp_die( $message, get_status_header_desc( $e->getCode() ), [
				'response' => $e->getCode(),
			] );
		}
	}


	/**
	 * Only current user can access.
	 *
	 * @param \WP_REST_Request $request
	 * @return bool
	 */
	public function permission_callback( \WP_REST_Request $request ) {
		if ( 'GET' == $request->get_method() ) {
			return true;
		} elseif( in_array( $request->get_method(), [ 'PUT', 'DELETE' ] ) ) {
			return UserMail::get_instance()->has_queue( get_current_user_id() );
		} else {
			return parent::permission_callback( $request );
		}
	}

	/**
	 * Get notification sent message.
	 *
	 * @return string
	 */
	private function get_notification_message() {
		/**
		 * hashboard_mail_request_message
		 *
		 * @param string $message
		 */
		return apply_filters( 'hashboard_mail_request_message', __( 'A confirmation mail has been sent to your new mail address. Please open it and click confirmation link.', 'hashboard' ) );
	}

}
