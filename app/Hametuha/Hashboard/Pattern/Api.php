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

	protected $version   = '1';

	/**
	 * Default permission callback
	 *
	 * @param \WP_REST_Request $request
	 * @return bool
	 */
	public function permission_callback( \WP_REST_Request $request ) {
		return current_user_can( Hashboard::get_default_capability() );
	}

}