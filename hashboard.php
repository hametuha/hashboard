<?php
/**
 * Plugin Name: HashBoard
 * Plugin URI: https://hametuha.com
 * Description: Dashboard
 * Author: Hametuha INC.
 * Version: 0.8.8
 * Author URI: https://hametuha.co.jp
 * Text Domain: hashboard
 */

defined( 'ABSPATH' ) || die();

add_action( 'plugins_loaded', function () {
	require __DIR__ . '/vendor/autoload.php';
	call_user_func( array( 'Hametuha\\Hashboard', 'get_instance' ) );
	define( 'HASHBOARD', Hametuha\Hashboard::version() );
} );
