<?php
/**
 * Regression tests for issue #12.
 *
 * @package hashboard
 */

/**
 * The plugin main file must ship with the composer package.
 */
class MainFileTest extends WP_UnitTestCase {

	/**
	 * Issue #12: composer.json declares `wordpress-plugin`, so the main file
	 * must not be excluded from the dist archive.
	 */
	public function test_main_file_is_not_export_ignored() {
		$attributes = file_get_contents( \Hametuha\Hashboard::dir() . '/.gitattributes' );
		$this->assertDoesNotMatchRegularExpression( '#^/?hashboard\.php\s+export-ignore#m', $attributes );
	}

	/**
	 * Issue #12: a composer-installed copy has no inner vendor/autoload.php.
	 */
	public function test_main_file_does_not_require_inner_autoloader() {
		$source = file_get_contents( \Hametuha\Hashboard::dir() . '/hashboard.php' );
		$this->assertMatchesRegularExpression( "#file_exists\( __DIR__ \. '/vendor/autoload\.php' \)#", $source );
	}
}
