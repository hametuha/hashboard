<?php
/**
 * Plugin Name: HashBoard
 * Plugin URI: https://hametuha.com
 * Description: Dashboard library for WordPress.
 * Author: Hametuha INC.
 * Version: 0.8.8
 * Requires at least: 6.1
 * Requires PHP: 7.4
 * Author URI: https://hametuha.co.jp
 * Text Domain: hashboard
 */

defined( 'ABSPATH' ) || die();

add_action( 'plugins_loaded', function () {
	// Installed by composer, the site's autoloader has already loaded the classes.
	if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
		require __DIR__ . '/vendor/autoload.php';
	}
	if ( ! class_exists( 'Hametuha\Hashboard' ) ) {
		return;
	}
	Hametuha\Hashboard::get_instance();
	if ( class_exists( 'Hametuha\Hashboard\Tests\Bootstrap' ) ) {
		\Hametuha\Hashboard\Tests\Bootstrap::get_instance();
	}
} );
