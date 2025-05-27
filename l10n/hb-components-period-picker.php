<?php
/**
 * Date range localization
 * @package hashboard
 */
defined( 'ABSPATH' ) || die();


return array(
	'custom'  => __( 'Custom', 'hashboard' ),
	'default' => array(
		array(
			'label' => __( 'Last 7d', 'hashboard' ),
			'value' => 7,
		),
		array(
			'label' => __( 'Last 30d', 'hashboard' ),
			'value' => 30,
		),
		array(
			'label' => __( 'Current QTR', 'hashboard' ),
			'value' => 'qtr',
		),
	),
);
