<?php
namespace Hametuha;

use Hametuha\Hashboard\API\Avatar;
use Hametuha\Hashboard\Pattern\Screen;
use Hametuha\Hashboard\Screens\Dashboard;
use Hametuha\Hashboard\Screens\Profile;
use Hametuha\Hashboard\Screens\Account;
use Hametuha\Pattern\RestApi;
use Hametuha\Pattern\Singleton;

/**
 * Bootstrap instance
 *
 * @package hashboard
 */
class Hashboard extends Singleton {

	/**
	 * List of instances.
	 *
	 * @var array
	 */
	public $screens = [];

	/**
	 * @var string
	 */
	public $current = '';

	/**
	 * Hashboard constructor.
	 */
	protected function init() {
		$this->load_text_domain();
		add_filter( 'query_vars', [ $this, 'query_vars' ] );
		add_filter( 'rewrite_rules_array', [ $this, 'rewrite_rules' ] );
		add_action( 'pre_get_posts', [ $this, 'pre_get_posts' ] );
		//add_action( 'ini', [ $this, 'register_assets' ] );
		/**
		 * hashboard_screens
		 *
		 * @param array $screens Associative array of Hametuha\Hashboard\Pattern\Screen
		 */
		$this->screens = apply_filters( 'hashboard_screens', [
			'dashboard' => Dashboard::class,
			'profile'   => Profile::class,
			'account'   => Account::class,
		] );
		// Register all API
		foreach ( scandir( __DIR__ . '/Hashboard/API' ) as $file ) {
			if ( ! preg_match( '#^([^._].*)\.php$#u', $file, $matches ) ) {
				continue;
			}
			$class_name = "Hametuha\\Hashboard\\API\\{$matches[1]}";
			if ( ! class_exists( $class_name ) ) {
				continue;
			}
			$reflection = new \ReflectionClass( $class_name );
			if ( ! $reflection->isSubclassOf( RestApi::class ) || $reflection->isAbstract() ) {
				continue;
			}
			call_user_func( [ $class_name, 'get_instance' ] );
		}

		// Enable avatar
		Avatar::get_instance();
	}

	/**
	 * Load text domain
	 *
	 * @return bool
	 */
	public function load_text_domain() {
		$mo = sprintf( 'hashboard-%s.mo', get_user_locale() );
		return load_textdomain( 'hashboard', self::dir() . '/languages/' . $mo );
	}

	/**
	 * Add dashboards
	 *
	 * @param $vars
	 * @return array
	 */
	public function query_vars( $vars ) {
		$vars[] = 'hashboard';
		$vars[] = 'hashboard-child';
		return $vars;
	}

	/**
	 * Get prefix
	 *
	 * @return string
	 */
	protected function get_prefix() {
		/**
		 * hashboard_prefix
		 *
		 * @package hashboard
		 * @param string $prefix
		 * @return string
		 */
		$prefix = apply_filters( 'hashboard_prefix', 'dashboard' );
		return $prefix;
	}

	/**
	 * Get screen URL.
	 *
	 * @param Screen $screen
	 * @param string $child
	 * @return string
	 */
	public function get_url( $screen = null, $child = '' ) {
		$prefix = $this->get_prefix();
		if ( is_null( $screen ) ) {
			return home_url( $prefix );
		} elseif ( $prefix === $screen->slug() ) {
			$slug = '';
		} else {
			$slug   = $screen->slug();
		}
		if ( $child ) {
			$slug .= "/{$child}";
		}

		return home_url( "{$prefix}/{$slug}" );
	}

	/**
	 * Generate rewrite rules.
	 *
	 * @param array $rules
	 * @return array
	 */
	public function rewrite_rules( $rules ) {
		$prefix = $this->get_prefix();
		return array_merge( [
			"^{$prefix}/?$" => 'index.php?hashboard=dashboard',
			"^{$prefix}/([^/]+)/?$" => 'index.php?hashboard=$matches[1]',
			"^{$prefix}/([^/]+)/([^/]+)/?$" => 'index.php?hashboard=$matches[1]&hashboard-child=$matches[2]',
		], $rules );
	}

	/**
	 * Get plugin version.
	 *
	 * @return string
	 */
	public static function version() {
		static $version = null;
		if ( is_null( $version ) ) {
			$data = get_file_data( self::dir() . '/hashboard.php', [
				'version' => 'Version',
			] );
			$version = $data['version'];
		}
		return $version;
	}

	/**
	 * Get user action links
	 *
	 * @return array
	 */
	public function user_actions() {
		$links = [
			[
				'label' => __( 'Log out', 'hashboard' ),
				'url'   => wp_logout_url(),
				'class' => '',
			],
		];
		if ( current_user_can( self::get_wp_accessible_capability() ) ) {
			array_unshift( $links, [
				'label' => __( 'WP Admin', 'hashboard' ),
				'url'   => admin_url(),
				'class' => '',
			] );
		}
		/**
		 * hashboar_user_actions
		 *
		 * @param array $links
		 */
		return apply_filters( 'hashboar_user_actions', $links );
	}

	/**
	 * Register assets.
	 */
	public function register_assets() {
		// Material Design Icons
		wp_register_style( 'material-design-icon', 'https://fonts.googleapis.com/icon?family=Material+Icons', [], null );
		wp_register_style( 'materialize', self::url( '/assets/css/style.css' ), [ 'material-design-icon' ], self::version() );
		// Materialize JS
		wp_register_script( 'materialize', self::url( '/assets/js/materialize.min.js' ), [ 'jquery' ], '0.100.2', true );
		// Hash Rest
		wp_register_script( 'hashboard-rest', self::url( '/assets/js/hashboard-rest.js' ), ['jquery'], self::version(), true );
		wp_localize_script( 'hashboard-rest', 'HashRest', [
			'root'  => rest_url('/'),
			'nonce' => wp_create_nonce( 'wp_rest' ),
		] );
		// Hashboard Utility
		wp_register_script( 'hashboard', self::url( '/assets/js/hashboard-helper.js' ), [ 'materialize', 'hashboard-rest' ], self::version(), true );

	}

	/**
	 * Handle request
	 *
	 * @param \WP_Query $wp_query
	 */
	public function pre_get_posts( \WP_Query &$wp_query ) {
		if ( $wp_query->is_main_query() && ( $action = $wp_query->get( 'hashboard' ) ) ) {
			if ( ! current_user_can( self::get_default_capability() ) ) {
				auth_redirect();
				exit;
			}
			switch ( $action ) {
				case $this->get_prefix():
					$slug = 'dashboard';
					break;
				default:
					$slug = $action;
					break;
			}
			if ( isset( $this->screens[ $slug ] ) ) {

				$this->current = $slug;
				$class_name = $this->screens[ $this->current ];
				/** @var Screen $screen */
				$screen = $class_name::get_instance();
				// Is there children?
				$child = $wp_query->get( 'hashboard-child' );
				if ( ! $screen->has_children( $child ) ) {
					$child = '';
				}
				// Register assets.
				$this->register_assets();
				wp_enqueue_style( 'materialize' );
				wp_enqueue_script( 'hashboard' );
				/**
				 * hashboard_enqueue_scripts
				 *
				 * @param bool $is_head
				 *
				 * Print scripts
				 */
				do_action( 'hashboard_enqueue_scripts' );
				self::load_template( 'body.php', [
					'page' => $screen,
					'hashboard' => self::get_instance(),
					'child' => $child,
				] );
				exit;
			} else {
				$wp_query->set_404();
			}
		}
	}

	/**
	 * Get default capability.
	 *
	 * @return string
	 */
	public static function get_default_capability() {
		/**
		 * hashboard_default_cap
		 *
		 * @param string $read Default 'read'
		 * @return string
		 */
		return apply_filters( 'hashboard_default_cap ', 'read' );
	}

	/**
	 * Get capability which allows wp-admin access,
	 *
	 * @return string
	 */
	public static function get_wp_accessible_capability() {
		/**
		 * hashboard_wp_link_cap
		 *
		 * @param string $capability Default 'edit_posts'
		 * @return string
		 */
		return apply_filters( 'hashboard_wp_link_cap', 'edit_posts' );
	}

	/**
	 * Get directory name.
	 *
	 * @return string
	 */
	public static function dir() {
		return dirname( dirname( __DIR__ ) );
	}

	/**
	 * Load template
	 *
	 * @param string $template
	 * @param array  $args
	 */
	public static function load_template( $template, $args = [] ) {
		$located = '';
		foreach ( [
			self::dir() . '/templates',
			get_template_directory() . '/template-parts/hashboard',
			get_stylesheet_directory() . '/template-parts/hashboard',
		] as $dir ) {
			$path = $dir . '/' . $template;
			if ( file_exists( $path ) ) {
				$located = $path;
			}
		}
		/**
		 * hashboard_template
		 *
		 * @param string $path      File path.
		 * @param string $temnplate Requited template file name.
		 * @param array  $args      Past parameters.
		 */
		$located = apply_filters( 'hashboard_template', $located, $template, $args );
		if ( ! $located || ! file_exists( $located ) ) {
			trigger_error( sprintf( __( 'Template %s doesn\'t exist.', 'hashboard' ), $located ), E_USER_WARNING );
		} else {
			if ( $args ) {
				extract( $args );
			}
			include $located;
		}
	}

	/**
	 * Get URL
	 *
	 * @param string $path
	 * @return string
	 */
	public static function url( $path = '' ) {
		if ( $path ) {
			$path = '/' . ltrim( $path, '/' );
		}
		return rtrim( plugin_dir_url( self::dir() . '/assets' ), '/' ) . $path;
	}

}
