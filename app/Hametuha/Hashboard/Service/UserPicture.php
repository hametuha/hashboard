<?php

namespace Hametuha\Hashboard\Service;


use Hametuha\Hashboard\Utility\Media;
use Hametuha\Pattern\Singleton;

/**
 * User's local avatar
 *
 * @package hashboard
 */
class UserPicture extends Singleton {


	/**
	 * Uploadable max size
	 */
	const UPLOAD_MAX_SIZE = '2MB';

	/**
	 * Directory name in wp-uploads folder
	 *
	 * @var string
	 */
	private $dir = 'profile-picture';

	/**
	 * User meta key
	 *
	 * @var string
	 */
	private $user_meta_key = '_profile_picture';

	/**
	 * Post meta key
	 *
	 * @var string
	 */
	public $post_meta_key = '_is_profile_pic';

	/**
	 * Get user avatar
	 */
	protected function init() {
		// Filter avatars
		add_filter( 'pre_get_avatar_data', [ $this, 'pre_get_avatar_data' ], 10, 2 );
		// Remove avatar's srcset
		add_filter( 'get_avatar', [ $this, 'get_avatar' ], 11 );
	}

	/**
	 * Get upload directory
	 *
	 * @return string
	 */
	public function get_dir() {
		$dir = wp_upload_dir();
		return $dir['basedir'] . DIRECTORY_SEPARATOR . $this->dir . DIRECTORY_SEPARATOR;
	}

	/**
	 * Get user dir
	 *
	 * @param int $user_id
	 *
	 * @return string
	 */
	private function get_user_dir( $user_id ) {
		return $this->get_dir() . $user_id . DIRECTORY_SEPARATOR;
	}

	/**
	 * Get directory url
	 *
	 * @return string
	 */
	private function get_url() {
		$dir = wp_upload_dir();
		$url = $dir['baseurl'] . '/' . $this->dir;
		return $url;
	}

	/**
	 * Get user directory url
	 *
	 * @param int $user_id
	 *
	 * @return string
	 */
	private function get_user_url( $user_id ) {
		return $this->get_url() . '/' . $user_id . '/';
	}

	/**
	 * Detect if user has profile pic
	 *
	 * @param int $user_id
	 *
	 * @return int
	 */
	public function has_profile_pic( $user_id ) {
		return (int) get_user_meta( $user_id, $this->user_meta_key, true );
	}

	/**
	 * Upload file
	 *
	 * @param array  $file
	 * @param int    $user_id
	 *
	 * @throws \Exception
	 * @return bool
	 */
	public function upload( array $file, $user_id = 0 ) {
		$path = $file['tmp_name'];
		if ( filesize( $path ) > $this->get_allowed_size( true ) ) {
			throw new \Exception( sprintf( __( 'Uploaded file is too large. Size cannot exceed %s.', 'hashboard' ), $this->get_allowed_size() ), 500 );
		}
		if ( ! Media::is_image( $path ) ) {
			throw new \Exception( __( 'File must be image. Allowed type is Jpeg, GIF and PNG.', 'hashboard' ), 500 );
		}
		// Include all required files
		$attachment_id = Media::upload( $file, 0, [
			'post_author' => $user_id,
		], '' );
		if ( is_wp_error( $attachment_id ) ) {
			throw new \Exception( $attachment_id->get_error_message(), 500 );
		}
		update_post_meta( $attachment_id, $this->post_meta_key, 1 );
		return $this->assign_user_pic( $user_id, $attachment_id );
	}

	/**
	 * Get user profile pic
	 *
	 * @param int $user_id
	 * @param string $size
	 * @param array $args
	 *
	 * @return array
	 */
	public function get_profile_pic( $user_id, $size = 'pinky', array $args = [] ) {
		$pictures = [];
		$query    = new \WP_Query( wp_parse_args( $args, [
			'post_type'      => 'attachment',
			'author'         => $user_id,
			'post_mime_type' => 'image',
			'posts_per_page' => - 1,
			'post_status'    => 'inherit',
			'meta_query'     => [
				[
					'key'   => $this->post_meta_key,
					'value' => 1
				]
			],
		] ) );
		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				$img        = wp_get_attachment_image( get_the_ID(), $size );
				$guid       = get_the_guid();
				$pictures[] = [
					'attachment_id' => get_the_ID(),
					'guid'          => $guid,
					'img'           => $img,
					'src'           => preg_match( '/src="([^"]+)"/u', $img, $match ) ? $match[1] : $guid,
				];
			}
			wp_reset_postdata();
		}

		return $pictures;
	}

	/**
	 * Update user's profile pic
	 *
	 * @param int $user_id
	 * @param int $attachment_id
	 *
	 * @return bool|int
	 */
	public function assign_user_pic( $user_id, $attachment_id ) {
		return update_user_meta( $user_id, $this->user_meta_key, $attachment_id );
	}

	/**
	 * Remove user's profile pic
	 *
	 * @param int $user_id
	 *
	 * @return bool
	 */
	public function detach_user_pic( $user_id ) {
		return delete_user_meta( $user_id, $this->user_meta_key );
	}

	/**
	 * Remove avatar's srcsets.
	 *
	 * @param string $avatar
	 *
	 * @return string
	 */
	public function get_avatar( $avatar ) {
		return preg_replace( '#srcset=["\'][^"\']+["\']#u', '', $avatar );
	}

	/**
	 * Filter avatar
	 *
	 * @param array               $args
	 * @param string|int|\WP_User $id_or_email
	 *
	 * @return array
	 */
	public function pre_get_avatar_data( $args, $id_or_email ) {
		$user_id = 0;
		if ( ! isset( $args['size'] ) ) {
			$size = 'thumbnail';
		} else {
			$size = $args['size'];
		}
		if ( is_numeric( $id_or_email ) ) {
			$user_id = $id_or_email;
		} elseif ( is_object( $id_or_email ) ) {
			if ( $id_or_email->user_id > 0 ) {
				$user_id = $id_or_email->user_id;
			}
		} else {
			$user_id = email_exists( $id_or_email );
		}
		// Search user meta
		if ( $user_id && $this->has_profile_pic( $user_id ) ) {
			$attachment_id = get_user_meta( $user_id, $this->user_meta_key, true );
			if ( $url = wp_get_attachment_image_url( $attachment_id, $size ) ) {
				$args['url'] = $url;
			}
		}
		return $args;
	}

	/**
	 * When user is deleted
	 *
	 * @param int $user_id
	 * @param int $attachment_id
	 *
	 * @return bool
	 */
	public function delete_user_pic( $user_id, $attachment_id ) {
		if ( ! $this->is_available_for( $user_id, $attachment_id ) ) {
			return false;
		}
		if ( $this->has_profile_pic( $user_id ) ) {
			delete_user_meta( $user_id, $this->user_meta_key, $attachment_id );
		}

		return delete_post_meta( $attachment_id, $this->post_meta_key, 1 );
	}


	/**
	 * User is allowed to handle image
	 *
	 * @param int $user_id
	 * @param int $attachment_id
	 *
	 * @return bool
	 */
	public function is_available_for( $user_id, $attachment_id ) {
		$post = get_post( $attachment_id );
		if ( ! $post || $post->post_author != $user_id || ! get_post_meta( $attachment_id, $this->post_meta_key, true ) ) {
			return false;
		} else {
			return true;
		}
	}

	/**
	 * Detect allowed file size
	 *
	 * @param bool $in_bit
	 *
	 * @return int
	 */
	public function get_allowed_size( $in_bit = false ) {
		return $in_bit ? intval( self::UPLOAD_MAX_SIZE ) * 1024 * 1024 : self::UPLOAD_MAX_SIZE;
	}
}
