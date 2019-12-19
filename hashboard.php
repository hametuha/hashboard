<?php
/**
 * Plugin Name: HashBoard
 * Plugin URI: https://hametuha.com
 * Description: Dashboard
 * Author: Hametuha INC.
 * Version: 0.8.4
 * Author URI: https://hametuha.co.jp
 * Text Domain: hashboard
 */

defined( 'ABSPATH' ) || die();



add_action( 'plugins_loaded', function() {
	$data = get_file_data( __FILE__, [
		'version' => 'Version',
	] );
	define( 'HASHBOARD', $data['version'] );
	require __DIR__ . '/vendor/autoload.php';
	call_user_func( [ 'Hametuha\\Hashboard', 'get_instance' ] );
} );
