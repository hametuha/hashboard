<?php

namespace Hametuha\Hashboard\Service;

use Hametuha\Hashboard;
use Ramsey\Uuid\Uuid;
use Hametuha\Pattern\Singleton;

/**
 * User mail handler
 * @package hashboard
 */
class UserMail extends Singleton {

	const NEW_MAIL_KEY     = 'hashboard_new_mail';

	const MAIL_HASH_KEY    = 'hashboard_mail_hash';

	const MAIL_HASH_LIMIT  = 'hashboard_mail_hash_expires';

	/**
	 * Detect if mail has queue
	 *
	 * @param int $user_id
	 * @return bool
	 */
	public function has_queue( $user_id )  {
		$new_mail = get_user_meta( $user_id, self::NEW_MAIL_KEY, true );
		if ( ! $new_mail ) {
			return false;
		}
		return $this->is_in_time( $user_id );
	}

	/**
	 * Check if hash is stil valid.
	 *
	 * @param int $user_id
	 * @return bool
	 */
	protected function is_in_time( $user_id ) {
		$limit = (int) get_user_meta( $user_id, self::MAIL_HASH_LIMIT, true );
		return $limit > current_time( 'timestamp', true );
	}

	/**
	 * Set user on queue.
	 *
	 * @param int    $user_id
	 * @param string $mail
	 * @return string
	 */
	public function set_queue( $user_id, $mail ) {
		update_user_meta( $user_id, self::NEW_MAIL_KEY, $mail );
		return $this->regenerate_user_hash( $user_id );
	}

	/**
	 * Check if mail existed.
	 *
	 * @param string $mail
	 * @return bool
	 */
	public function exists( $mail ) {
		if ( email_exists( $mail ) ) {
			return true;
		}
		global $wpdb;
		$query = <<<SQL
			SELECT user_id FROM {$wpdb->usermeta}
			WHERE meta_key   = %s
			  AND meta_value = %s
			LIMIT 1
SQL;
		return (bool) $wpdb->get_var( $wpdb->prepare( $query, self::NEW_MAIL_KEY, $mail ) );
	}

	/**
	 * Get user id by hash.
	 *
	 * @param string $hash
	 * @return int User ID
	 */
	public function get_user_id_by_hash( $hash ) {
		global $wpdb;
		$query = <<<SQL
			SELECT user_id FROM {$wpdb->usermeta}
			WHERE meta_key = %s
			  AND meta_value = %s
SQL;
		return (int) $wpdb->get_var( $wpdb->prepare( $query, self::MAIL_HASH_KEY, $hash ) );
	}

	/**
	 * Update user hash.
	 *
	 * @param strin g$hash
	 * @return bool|\WP_Error
	 */
	public function update_user_mail( $hash ) {
		$user_id = $this->get_user_id_by_hash( $hash );
		if ( ! $user_id ) {
			return new \WP_Error( 404, __( 'Hash key is not valid and user not found.', 'hashboard' ), [ 'status' => 404 ] );
		}
		if ( ! $this->is_in_time( $user_id ) ) {
			return new \WP_Error( 405, __( 'Email change request is expired. Please make another request at your account page.', 'hashboard' ), [ 'status' => 405 ] );
		}
		$mail = get_user_meta( $user_id, self::NEW_MAIL_KEY, true );
		if ( ! $mail ) {
			return new \WP_Error( 500, __( 'You new mail address is not found. Please try again or contact to site administrator.', 'hashboard' ), [ 'status' => 500 ] );
		}
		if ( email_exists( $mail ) ) {
			return new \WP_Error( 500, __( 'This email is used by other user. Please try another one.', 'hashboard' ), [ 'status' => 500 ] );
		}
		$result = wp_update_user( [
			'ID' => $user_id,
			'user_email' => $mail,
		] );
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		return $this->expire_user_hash( $user_id );
	}

	/**
	 * Generate UUID and set it as key.
	 *
	 * @param int $user_id
	 * @param int $expires
	 * @return string
	 */
	public function regenerate_user_hash( $user_id, $expires = 86400 ) {
		$new_mail = get_user_meta( $user_id, self::NEW_MAIL_KEY, true );
		if ( ! $new_mail ) {
			return '';
		}
		$hash = Uuid::uuid4()->toString();
		update_user_meta( $user_id, self::MAIL_HASH_KEY, $hash );
		update_user_meta( $user_id, self::MAIL_HASH_LIMIT, current_time( 'timestamp', true ) + $expires );
		return $hash;
	}

	/**
	 * Clear user mail change request.
	 *
	 * @param int $user_id
	 * @return bool
	 */
	public function expire_user_hash( $user_id ) {
		return delete_user_meta( $user_id, self::MAIL_HASH_KEY )
			&& delete_user_meta( $user_id, self::MAIL_HASH_LIMIT )
			&& delete_user_meta( $user_id, self::NEW_MAIL_KEY );
	}

	/**
	 * Send confirmation link to user.
	 *
	 * @param int  $user_id
	 * @return bool|\WP_Error
	 */
	public function notify( $user_id ) {
		$hash = get_user_meta( $user_id, self::MAIL_HASH_KEY, true );
		if ( ! $hash ) {
			return new \WP_Error( 404, __( 'Specified user doesn\'t seem on requesting mail change.', 'hashboard' ), [ 'status' => 404 ] );
		}
		$mail = get_user_meta( $user_id, self::NEW_MAIL_KEY, true );
		$url = add_query_arg( [
			'hash' => $hash,
		], rest_url( 'hashboard/v1/user/account' ) );
		/**
		 * hashboard_mail_request_subject
		 *
		 * @param string $subject Mail subject.
		 * @param int    $user_id User ID.
		 */
		$subject = apply_filters( 'hashboard_mail_request_subject', /* translators: %s is site name. */__( 'Mail change confirmation : %s', 'hashboard' ), $user_id );
		$subject = sprintf( $subject, get_bloginfo( 'name' ) );
		// translators: %1$s User name, %2$s confirmation URL, %3$s Dashboard URL, %4$s Blog name, %5$s Home URL.
		$body = __( 'Dear %1$s,

To confirm new mail address, click link below.
%2$s

This mail is sent because you requested to change email address.
If you have no idea of it, simply just ignore this mail.

To check your current email address, please go to dashboard.
%3$s

%4$s
%5$s
', 'hashboard' );
		/**
		 * hashboard_mail_request_body
		 *
		 * @param string $body    Mail body
		 * @param int    $user_id User ID.
		 */
		$body = apply_filters( 'hashboard_mail_request_body', $body, $user_id );
		$body = sprintf(
			$body,
			get_the_author_meta( 'display_name', $user_id ),
			$url,
			Hashboard::get_instance()->get_url( Hashboard\Screens\Account::get_instance() ),
			get_bloginfo( 'name' ), home_url()
		);
		if ( $subject && $body ) {
			return wp_mail( $mail, $subject, $body );
		} else {
			return new \WP_Error( 500, __( 'Failed to send confirmation mail. Please try again later or contact to site administrator.', 'hashboard' ), [ 'status' => 500] );
		}
	}
}
