<?php
/**
 * Date range localization
 * @package hashboard
 */
defined( 'ABSPATH' ) || die();


return [
	'custom'  => __( 'Custom', 'hashboard' ),
	'default' => [
		[
			'label' => __( 'Last 7d', 'hashboard' ),
			'value' => 7,
		],
		[
			'label' => __( 'Last 30d', 'hashboard' ),
			'value' => 30,
		],
		[
			'label' => __( 'Current QTR', 'hashboard' ),
			'value' => 'qtr',
		],
	],
];
