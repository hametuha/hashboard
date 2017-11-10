<?php

namespace Hametuha\Hashboard\API;


use Hametuha\Hashboard\Pattern\Api;
use Hametuha\Hashboard\Service\UserPicture;
use Hametuha\Hashboard\Utility\Media;

/**
 * Avatar
 * @package hashboard
 */
class Avatar extends Api {

	protected $route = 'user/avatar';

	protected $regexp = '#^data:image/(png|jpe?g|gif);base64,#u';

	/**
	 * Should return arguments.
	 *
	 * @param string $http_method
	 * @return array
	 */
	protected function get_args( $http_method ) {
		switch ( $http_method ) {
			case 'POST':
				return [
					'local_img' => [
						'required' => true,
						'description' => __( 'BASE64 encoded image data.', 'hashboard' ),
						'validate_callback' => function( $var ) {
							// Should be base64 encoded string.
							if ( ! preg_match( $this->regexp, $var ) ) {
								return new \WP_Error( 'invalid_format', __( 'Only BASE64 encoded image data is acceptable.', 'hashboard' ) );
							} else {
								return true;
							}
						},
					],
				];
				break;
			case 'DELETE':
				return [];
				break;
			default:
				return [];
				break;
		}
	}

	/**
	 * Change profile picture.
	 *
	 * @param \WP_REST_Request $request
	 * @return array|\WP_Error
	 */
	public function handle_post( \WP_REST_Request $request ) {
		// Convert image.
		$mime = '';
		$base64 = preg_replace_callback( $this->regexp, function( $matches ) use ( &$mime ) {
			$mime = $matches[1];
			return  '';
		}, $request['local_img'] );
		$file_data = base64_decode( $base64 );
		$basename = sprintf( 'profile-%d-%s.%s', get_current_user_id(), uniqid(), strtolower( $mime ) );
		$tmp_name = $this->save_file( $file_data, $basename );
		if ( ! $tmp_name ) {
			return new \WP_Error( 'operation_error', __( 'Failed to save file data.', 'hashboard' ), [ 'status' => 500 ] );
		}
		$file = [
			'name'    => $basename,
			'tmp_name' => $tmp_name,
			'size' => filesize( $tmp_name ),
		];
		if ( ! UserPicture::get_instance()->upload( $file, get_current_user_id() ) ) {
			return new \WP_Error( 'upload_failed', __( 'Failed to upload', 'hashboard' ) );
		}
		return [
			'success'    => true,
			'message'    => __( 'Your profile picture is successfully changed.', 'hashboard' ),
			'avatar_url' => get_avatar_url( get_current_user_id(), [ 'size' => '160' ] ),
		];
	}




}
