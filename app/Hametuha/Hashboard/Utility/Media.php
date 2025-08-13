<?php

namespace Hametuha\Hashboard\Utility;


use Hametuha\SingletonPattern\Singleton;

/**
 * Media utility class
 *
 */
class Media extends Singleton {

	/**
	 * Load required libraries
	 */
	public static function load_lib() {
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
	}

	/**
	 * Get mime type
	 *
	 * @param string $src
	 * @return string
	 */
	public static function get_mime( $src ) {
		if ( ! file_exists( $src ) || ! ( $info = getimagesize( $src ) ) ) {
			return '';
		} else {
			return $info['mime'];
		}
	}

	/**
	 * Detect if file is image.
	 *
	 * @param string $src
	 * @return bool
	 */
	public static function is_image( $src ) {
		$mime = self::get_mime( $src );
		return $mime && preg_match( '/^image\/(jpeg|png|gif)$/', $mime );
	}

	/**
	 * Upload media file
	 *
	 * @param array $file
	 * @param int $post_id
	 * @param array $args
	 * @param string $desc
	 * @return int|\WP_Error
	 */
	public static function upload( array $file, $post_id = 0, $args = array(), $desc = '' ) {
		self::load_lib();
		// Include all required files
		$attachment_id = media_handle_sideload( $file, $post_id, $desc, $args );
		return $attachment_id;
	}
}
