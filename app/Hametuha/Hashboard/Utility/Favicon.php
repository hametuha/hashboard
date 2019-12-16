<?php

namespace Hametuha\Hashboard\Utility;


use Hametuha\Pattern\Singleton;

/**
 * Favicon API
 *
 * @package hashboard
 */
class Favicon extends Singleton {
	/**
	 * Constructor
	 */
	protected function init() {
		add_action( 'hashboard_head', 'wp_site_icon', 1 );
	}
}
