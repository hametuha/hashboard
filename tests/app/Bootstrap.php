<?php

namespace Hametuha\Hashboard\Tests;


use Hametuha\SingletonPattern\Singleton;

/**
 * Bootstrap class for tests
 *
 *
 */
class Bootstrap extends Singleton {

	/**
	 * {@inheritDoc}
	 */
	protected function init() {
		add_filter( 'show_admin_bar', '__return_false' );
		add_filter( 'hashboard_screens', [ $this, 'register_screens' ] );
	}

	public function register_screens( $screens ) {
		$screens['kitchen-sink'] = KitchenSink::class;
		return $screens;
	}
}
