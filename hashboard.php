<?php
/**
 * Plugin Name: HashBoard
 * Plugin URI: https://hametuha.com
 * Description: Dashboard
 * Author: Hametuha INC.
 * Version: 0.8.2
 * Author URI: https://hametuha.co.jp
 * Text Domain: hashboard
 */

defined( 'ABSPATH' ) || die();

define( 'HASHBOARD', '0.8.2' );

add_action( 'plugins_loaded', function() {
	require __DIR__ . '/vendor/autoload.php';
	call_user_func( [ 'Hametuha\\Hashboard', 'get_instance' ] );
} );
