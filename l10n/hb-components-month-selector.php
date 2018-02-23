<?php
/**
 * Localization for month selector
 */
defined( 'ABSPATH' ) || die();

$vars = [
	'yearSuffix' => _x( '', 'year_suffix', 'hashboard' ),
	'month' => [],
	'update' => __( 'Update', 'hashboard' ),
];
for ( $i = 1; $i <= 12; $i++ ) {
	$vars['month'][] = mysql2date( 'F', sprintf( '2000-%02d-01 00:00:00', $i ) );
}

return $vars;
