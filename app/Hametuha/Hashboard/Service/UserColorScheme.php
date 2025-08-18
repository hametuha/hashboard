<?php

namespace Hametuha\Hashboard\Service;

use Hametuha\SingletonPattern\Singleton;
use Hametuha\Hashboard;

/**
 * Hashboard Color Scheme Service
 *
 * Manages dynamic CSS variables and WordPress admin color integration
 * Approach: SASS variables → CSS variables → Runtime PHP output
 */
class UserColorScheme extends Singleton {

	/**
	 * Initialize service
	 */
	protected function init() {
		// Dynamic CSS variable output
		add_action( 'wp_head', array( $this, 'output_dynamic_css_variables' ) );
		add_action( 'admin_head', array( $this, 'output_dynamic_css_variables' ) );

		// WordPress admin color scheme integration
		add_action( 'admin_init', array( $this, 'register_hashboard_color_scheme' ) );

		// Force hashboard color scheme for all users (optional)
		add_filter( 'get_user_option_admin_color', array( $this, 'force_hashboard_color_scheme' ), 10, 3 );
	}

	/**
	 * Get Bootstrap colors from theme configuration
	 *
	 * @return array Color values that can be overridden by theme.json or filters
	 */
	public function get_theme_colors() {
		/**
		 * hashboard_theme_colors
		 *
		 * Allows themes to override Hashboard colors via theme.json or filters
		 *
		 * @param array $colors Default color scheme
		 */
		return apply_filters( 'hashboard_theme_colors', array(
			'primary'   => '#1F1C1D',  // Bootstrap $gray-900 equivalent
			'secondary' => '#949395',  // Bootstrap $gray-500 equivalent  
			'success'   => '#7fae49',  // Bootstrap $green equivalent
			'danger'    => '#f44336',  // Bootstrap $red equivalent
			'warning'   => '#F5AC37',  // Bootstrap $yellow equivalent
			'yellow'    => '#F5AC37',
			'brown'     => '#594324',
			'red'       => '#f44336',
			'blue'      => '#176B86',
			'green'     => '#7fae49',
		) );
	}

	/**
	 * Output dynamic CSS variables in <head>
	 * This allows runtime theme switching via PHP
	 */
	public function output_dynamic_css_variables() {
		$colors = $this->get_theme_colors();

		// Support for theme-based color switching
		$current_theme = get_option( 'hashboard_color_theme', 'default' );

		echo "<style id='hashboard-dynamic-colors'>\n";
		echo ":root {\n";

		// Output CSS variables that can override compiled SCSS
		foreach ( $colors as $name => $color ) {
			echo "  --hb-{$name}: {$color};\n";

			// Generate RGB values for Bootstrap
			$rgb = $this->hex_to_rgb( $color );
			echo "  --hb-{$name}-rgb: {$rgb};\n";

			// Generate variations
			if ( in_array( $name, array( 'primary', 'success', 'danger', 'warning' ) ) ) {
				$darker_10 = $this->adjust_color_brightness( $color, 10, true );
				$darker_20 = $this->adjust_color_brightness( $color, 20, true );
				echo "  --hb-{$name}-darker-10: {$darker_10};\n";
				echo "  --hb-{$name}-darker-20: {$darker_20};\n";
			}
		}

		// Theme-specific overrides
		if ( $current_theme !== 'default' ) {
			echo "  /* Theme: {$current_theme} */\n";
			$this->output_theme_specific_variables( $current_theme );
		}

		echo "}\n";
		echo "</style>\n";
	}

	/**
	 * Output theme-specific CSS variables
	 *
	 * @param string $theme Theme name
	 */
	private function output_theme_specific_variables( $theme ) {
		$theme_colors = $this->get_theme_specific_colors( $theme );

		foreach ( $theme_colors as $name => $color ) {
			echo "  --hb-{$name}: {$color};\n";
		}
	}

	/**
	 * Get theme-specific color overrides
	 *
	 * @param string $theme Theme name
	 * @return array Theme colors
	 */
	private function get_theme_specific_colors( $theme ) {
		$themes = array(
			'blue'  => array(
				'primary' => '#176B86',
			),
			'green' => array(
				'primary' => '#4D8E26',
			),
			'red'   => array(
				'primary' => '#E03A01',
			),
		);

		return $themes[ $theme ] ?? array();
	}

	/**
	 * Register Hashboard as WordPress admin color scheme
	 */
	public function register_hashboard_color_scheme() {
		$colors = $this->get_theme_colors();

		wp_admin_css_color(
			'hashboard',
			__( 'Hashboard', 'hashboard' ),
			Hashboard::url( '/assets/css/hashboard-admin-color.css' ),
			array( $colors['primary'], $colors['secondary'], $colors['success'], $colors['danger'] ),
			array(
				'base'    => $this->adjust_color_brightness( $colors['primary'], 20, true ),
				'focus'   => $colors['primary'],
				'current' => '#fff',
			)
		);
	}

	/**
	 * Force hashboard color scheme for all users
	 *
	 * @param mixed $result Current result
	 * @param string $option Option name
	 * @param int $user_id User ID
	 * @return string Color scheme
	 */
	public function force_hashboard_color_scheme( $result, $option, $user_id ) {
		/**
		 * hashboard_force_admin_color
		 *
		 * @param bool $force Whether to force hashboard color scheme
		 */
		if ( apply_filters( 'hashboard_force_admin_color', true ) ) {
			return 'hashboard';
		}

		return $result;
	}

	/**
	 * Convert hex color to RGB values
	 *
	 * @param string $hex Hex color
	 * @return string RGB values (e.g., "33, 117, 155")
	 */
	private function hex_to_rgb( $hex ) {
		$hex = ltrim( $hex, '#' );

		if ( strlen( $hex ) === 3 ) {
			$hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
		}

		$r = hexdec( substr( $hex, 0, 2 ) );
		$g = hexdec( substr( $hex, 2, 2 ) );
		$b = hexdec( substr( $hex, 4, 2 ) );

		return "{$r}, {$g}, {$b}";
	}

	/**
	 * Adjust color brightness
	 *
	 * @param string $hex_color Base color
	 * @param int $percent Percentage to adjust
	 * @param bool $darker Whether to darken or lighten
	 * @return string Adjusted color
	 */
	private function adjust_color_brightness( $hex_color, $percent, $darker = true ) {
		$hex_color = ltrim( $hex_color, '#' );

		if ( strlen( $hex_color ) === 3 ) {
			$hex_color = $hex_color[0] . $hex_color[0] . $hex_color[1] . $hex_color[1] . $hex_color[2] . $hex_color[2];
		}

		$r = hexdec( substr( $hex_color, 0, 2 ) );
		$g = hexdec( substr( $hex_color, 2, 2 ) );
		$b = hexdec( substr( $hex_color, 4, 2 ) );

		$factor = $darker ? ( 100 - $percent ) / 100 : ( 100 + $percent ) / 100;
		$r      = max( 0, min( 255, intval( $r * $factor ) ) );
		$g      = max( 0, min( 255, intval( $g * $factor ) ) );
		$b      = max( 0, min( 255, intval( $b * $factor ) ) );

		return sprintf( '#%02x%02x%02x', $r, $g, $b );
	}
}
