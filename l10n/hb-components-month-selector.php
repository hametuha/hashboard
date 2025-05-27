<?php
/**
 * Localization for month selector
 */
defined( 'ABSPATH' ) || die();

$vars = array(
	// phpcs:ignore WordPress.WP.I18n.NoEmptyStrings
	'yearSuffix' => _x( '', 'year_suffix', 'hashboard' ),
	'month'      => array(),
	'update'     => __( 'Update', 'hashboard' ),
);
for ( $i = 1; $i <= 12; $i++ ) {
	$vars['month'][] = mysql2date( 'F', sprintf( '2000-%02d-01 00:00:00', $i ) );
}

return $vars;
