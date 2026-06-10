<?php
/**
 * Regression tests for issues #38, #39, #40.
 *
 * @package hashboard
 */

/**
 * Test fixes for reported regressions in 1.0.x.
 */
class BugfixTest extends WP_UnitTestCase {

	/**
	 * Issue #40: canonical redirect must be suppressed on Hashboard pages.
	 *
	 * The editor rewrite maps to `p={id}`, so redirect_canonical() would
	 * bounce the editor route to the post's public permalink. The filter must
	 * return false whenever the `hashboard` query var is present.
	 */
	public function test_redirect_canonical_suppressed_on_hashboard() {
		$hashboard = \Hametuha\Hashboard::get_instance();
		$url       = 'https://example.com/2024/01/01/sample/';

		// Not a hashboard request: pass through untouched.
		set_query_var( 'hashboard', '' );
		$this->assertSame( $url, $hashboard->redirect_canonical( $url ) );

		// Editor request: redirect must be cancelled.
		set_query_var( 'hashboard', 'editor' );
		$this->assertFalse( $hashboard->redirect_canonical( $url ) );

		// Any hashboard screen: redirect must be cancelled.
		set_query_var( 'hashboard', 'profile' );
		$this->assertFalse( $hashboard->redirect_canonical( $url ) );

		// Clean up.
		set_query_var( 'hashboard', '' );
	}

	/**
	 * Issue #40: the redirect_canonical filter must be wired up.
	 */
	public function test_redirect_canonical_filter_registered() {
		$hashboard = \Hametuha\Hashboard::get_instance();
		$this->assertNotFalse(
			has_filter( 'redirect_canonical', array( $hashboard, 'redirect_canonical' ) ),
			'redirect_canonical filter should be registered.'
		);
	}

	/**
	 * Issue #39: hashboard_enqueue_scripts action must be fired again.
	 *
	 * The hook fires inside template_redirect() (which exits), so we guard the
	 * exact regression: the do_action() call disappearing from the render path.
	 */
	public function test_hashboard_enqueue_scripts_action_present() {
		$source = file_get_contents( \Hametuha\Hashboard::dir() . '/app/Hametuha/Hashboard.php' );
		$this->assertStringContainsString(
			"do_action( 'hashboard_enqueue_scripts'",
			$source,
			'hashboard_enqueue_scripts must be fired so downstream enqueue callbacks run.'
		);
	}

	/**
	 * Issue #38: wp-dependencies.json must not contain npm package names.
	 *
	 * npm names such as `@wordpress/element` are not valid WP script handles
	 * and silently break the dependency print loop.
	 */
	public function test_wp_dependencies_have_no_npm_package_names() {
		$json = json_decode( file_get_contents( \Hametuha\Hashboard::dir() . '/wp-dependencies.json' ), true );
		$this->assertIsArray( $json );
		foreach ( $json as $asset ) {
			$deps = isset( $asset['deps'] ) ? $asset['deps'] : array();
			foreach ( $deps as $dep ) {
				$this->assertStringStartsNotWith(
					'@',
					$dep,
					sprintf( 'Handle "%s" has an npm package name in its deps: %s', $asset['handle'], $dep )
				);
			}
		}
	}
}
