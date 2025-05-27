<?php

namespace Hametuha\Hashboard\Pattern;

use Hametuha\Hashboard;
use Hametuha\Pattern\RestApi;

/**
 * Wrapper for namespace.
 *
 * @package hashbaord
 */
abstract class Api extends RestApi {

	protected $namespace = 'hashboard';

	protected $version = '1';

	/**
	 * Default permission callback
	 *
	 * @param \WP_REST_Request $request
	 * @return bool
	 */
	public function permission_callback( \WP_REST_Request $request ) {
		return current_user_can( Hashboard::get_default_capability() );
	}

	/**
	 * Put file to temp dir
	 *
	 * @param string $data File data
	 * @param string $name File name.
	 * @return bool|string If failed, return false. Else return file path.
	 */
	protected function save_file( $data, $name ) {
		$path = sys_get_temp_dir() . '/' . ltrim( $name, DIRECTORY_SEPARATOR );
		if ( file_put_contents( $path, $data ) ) {
			return $path;
		} else {
			return false;
		}
	}
}
