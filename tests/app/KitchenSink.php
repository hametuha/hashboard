<?php

namespace Hametuha\Hashboard\Tests;


use Hametuha\Hashboard;
use Hametuha\Hashboard\Pattern\Screen;

/**
 * KitchenSink screen for testing purposes.
 *
 * This screen is used to test various features and functionalities of the Hashboard.
 *
 * @package Hametuha\Hashboard\Tests
 */
class KitchenSink extends Screen {

	protected $icon = 'kitchen';

	protected function default_children() {
		return [
			'bootstrap'  => 'Bootstrap',
			'components' => 'Components',
			'charts'     => 'Charts',
			'tables'     => 'Tables',
		];
	}

	public function description( $page = '' ) {
		return __( 'This is a kitchen sink screen for testing purposes.', 'hashboard' );
	}

	public function slug() {
		return 'kitchen-sink';
	}

	public function label() {
		return __( 'Kitchen Sink', 'hashboard' );
	}

	public function render( $page = '' ) {
		load_template( Hashboard::dir() . '/tests/template-parts/kitchen-sink/' . $page . '.php' );
	}

	public function head() {
		wp_enqueue_script( 'hb-hashboard-helper' );
		wp_enqueue_script( 'hashboard-kitchen-sink', Hashboard::url( 'assets/test/kitchen-sink.js' ), [
			'hb-components-loading',
			'hb-components-date-range',
			'hb-components-pagination',
			'hb-components-bar-chart',
			'hb-components-line-chart',
			'hb-components-list-table',
			'hb-components-post-list',
			'wp-components',
		], md5_file( Hashboard::dir() . '/assets/test/kitchen-sink.js' ), true );
		wp_enqueue_style( 'wp-components' );
	}


}
