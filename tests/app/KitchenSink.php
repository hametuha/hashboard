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

	public function head( $child = '' ) {
		wp_enqueue_script( 'hb-hashboard-helper' );
		wp_enqueue_style( 'wp-components' );

		// Enqueue tab-specific scripts
		switch ( $child ) {
			case 'components':
				wp_enqueue_script(
					'hashboard-kitchen-sink-components',
					Hashboard::url( 'assets/test/kitchen-sink-components.js' ),
					[ 'wp-components' ],
					md5_file( Hashboard::dir() . '/assets/test/kitchen-sink-components.js' ),
					true
				);
				break;

			case 'charts':
				wp_enqueue_script(
					'hashboard-kitchen-sink-charts',
					Hashboard::url( 'assets/test/kitchen-sink-charts.js' ),
					[ 'hb-components-bar-chart', 'hb-components-line-chart', 'wp-components' ],
					md5_file( Hashboard::dir() . '/assets/test/kitchen-sink-charts.js' ),
					true
				);
				break;

			case 'tables':
				wp_enqueue_script(
					'hashboard-kitchen-sink-tables',
					Hashboard::url( 'assets/test/kitchen-sink-tables.js' ),
					[
						'hb-components-list-table',
						'hb-components-post-list',
						'wp-element',
						'wp-components'
					],
					md5_file( Hashboard::dir() . '/assets/test/kitchen-sink-tables.js' ),
					true
				);
				break;

			case 'bootstrap':
			default:
				wp_enqueue_script(
					'hashboard-kitchen-sink-bootstrap',
					Hashboard::url( 'assets/test/kitchen-sink-bootstrap.js' ),
					[ 'hb-plugins-toast', 'wp-components' ],
					md5_file( Hashboard::dir() . '/assets/test/kitchen-sink-bootstrap.js' ),
					true
				);
				break;
		}
	}


}
