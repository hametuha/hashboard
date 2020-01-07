<?php

namespace Hametuha;

use Hametuha\Hashboard\API\Avatar;
use Hametuha\Hashboard\Pattern\Editor;
use Hametuha\Hashboard\Pattern\Screen;
use Hametuha\Hashboard\Screens\Dashboard;
use Hametuha\Hashboard\Screens\Profile;
use Hametuha\Hashboard\Screens\Account;
use Hametuha\Hashboard\Utility\Favicon;
use Hametuha\Pattern\RestApi;
use Hametuha\Pattern\Singleton;
use Hametuha\WpEnqueueManager;
use WP_CLI\Iterators\Exception;

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
	 * List of editors.
	 *
	 * @var array
	 */
	protected $editors = [];

	/**
	 * @var string
	 */
	public $current = '';

	/**
	 * Hashboard constructor.
	 */
	protected function init() {
		$this->load_text_domain();
		/**
		 * Register editors.
		 */
		$this->editors = apply_filters( 'hashboard_editors', [] );
		add_filter( 'query_vars', [ $this, 'query_vars' ] );
		add_filter( 'rewrite_rules_array', [ $this, 'rewrite_rules' ] );
		add_action( 'pre_get_posts', [ $this, 'pre_get_posts' ] );
		add_action( 'hashboard_head', [ $this, 'enqueue_screen_styles' ], 11 );
		add_action( 'hashboard_footer', [ $this, 'enqueue_screen_scripts' ], 11 );
		add_action( 'init', function () {
			/**
			 * hashboard_screens
			 *
			 * @param array $screens Associative array of Hametuha\Hashboard\Pattern\Screen
			 */
			$this->screens = apply_filters( 'hashboard_screens', [
				'dashboard' => Dashboard::class,
				'profile' => Profile::class,
				'account' => Account::class,
			] );
		}, 1 );
		// Register assets globally.
		add_action( 'init', [ $this, 'register_assets' ], 11 );
		// Register all API.
		foreach ( [
					  'API' => RestApi::class,
					  'Bridge' => Singleton::class,
				  ] as $name => $subclass ) {
			foreach ( scandir( __DIR__ . '/Hashboard/' . $name ) as $file ) {
				if ( !preg_match( '#^([^._].*)\.php$#u', $file, $matches ) ) {
					continue;
				}
				$class_name = "Hametuha\\Hashboard\\{$name}\\{$matches[1]}";
				if ( !class_exists( $class_name ) ) {
					continue;
				}
				$reflection = new \ReflectionClass( $class_name );
				if ( !$reflection->isSubclassOf( $subclass ) || $reflection->isAbstract() ) {
					continue;
				}
				call_user_func( [ $class_name, 'get_instance' ] );
			}
		}
		// Render screen.

		// Enable avatar
		Avatar::get_instance();
		// Enable Favicon
		Favicon::get_instance();
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
			$slug = $screen->slug();
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
			"^{$prefix}/editor/([^/]+)/(\d+)/?$" => 'index.php?hashboard=editor&hashboard-child=$matches[1]&p=$matches[2]',
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
			$version = $data[ 'version' ];
		}
		return $version;
	}

	/**
	 * Get user action links
	 *
	 * @return array
	 */
	public function user_actions() {
		$links = [];
		if ( current_user_can( self::get_wp_accessible_capability() ) ) {
			array_unshift( $links, [
				'label' => __( 'WP Admin', 'hashboard' ),
				'url' => admin_url(),
				'class' => '',
			] );
		}
		$links['logout'] = [
			'label' => __( 'Log out', 'hashboard' ),
			'url' => wp_logout_url(),
			'class' => '',
		];
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
		wp_register_style( 'bootstrap', self::url( '/assets/css/hashboard.css' ), [ 'material-design-icon' ], self::version() );
		// Bootstrap
		wp_register_script( 'popper', self::url( '/assets/js/popper.min.js' ), [], '1.16.0', true );
		// Popper
		wp_register_script( 'bootstrap', self::url( '/assets/js/bootstrap.min.js' ), [ 'jquery', 'popper' ], '4.4.1', true );
		// Chart JS
		wp_register_script( 'chart-js', self::url( '/assets/js/Chart.min.js' ), [], '2.9.3', true );
		// Moment
		if ( wp_script_is( 'moment', 'registered' ) ) {
			wp_deregister_script( 'moment' );
		}
		wp_register_script( 'moment', self::url( '/assets/js/moment-with-locales.min.js' ), [], '2.24.0', true );
		// Vue.js.
		wp_register_script( 'vue-js', self::url( '/assets/js/vue.min.js' ), [], '2.6.11', true );
		$vue_helper = <<<JS
			window.bus = new Vue({});
JS;
		wp_add_inline_script( 'vue-js', $vue_helper );
		// Chart JS vue.
		wp_register_script( 'chart-js-vue', self::url( '/assets/js/vue-chartjs.min.js' ), [ 'chart-js', 'vue-js' ], '3.5.0', true );
		// Hash Rest
		wp_register_script( 'hashboard-rest', self::url( '/assets/js/hashboard-rest.js' ), [ 'jquery', 'hb-plugins-toast' ], self::version(), true );
		wp_localize_script( 'hashboard-rest', 'HashRest', [
			'root' => rest_url( '/' ),
			'nonce' => wp_create_nonce( 'wp_rest' ),
			'error' => __( 'Server returns error. Please try again later', 'hashboard' ),
		] );
		// Hashboard Utility.
		wp_register_script( 'hashboard', self::url( '/assets/js/hashboard-helper.js' ), [
			'bootstrap', 'hashboard-rest', 'hb-plugins-toast', 'hb-plugins-fitrows'
		], self::version(), true );
		// Register scripts.
		foreach ( [ 'components', 'filters', 'plugins' ] as $group ) {
			$base_dir = self::dir() . "/assets/js/{$group}";
			if ( ! is_dir( $base_dir ) ) {
				continue;
			}
			// Bulk register.
			WpEnqueueManager::register_js( $base_dir, "hb-{$group}-", self::version() );
		}
		// Localize scripts.
		WpEnqueueManager::register_js_var_files( self::dir() . '/l10n' );
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
			try {
				$this->current = $slug;
				if ( 'editor' === $slug ) {
					// Render editor if available.
					$key = $wp_query->get( 'hashboard-child' );
					if ( ! isset( $this->editors[ $key ] ) ) {
						throw new \Exception( 'no editor', 404 );
					}
					$class_name = $this->editors[ $key ];
					if ( ! class_exists( $class_name ) ) {
						throw new \Exception( 'no editor', 404 );
					}
					$reflection = new \ReflectionClass( $class_name );
					if ( $reflection->isAbstract() || ! $reflection->isSubclassOf( Editor::class ) ) {
						throw new \Exception( 'no editor', 404 );
					}
					/** @var Editor $class_name */
					$class_name::get_instance()->render( $wp_query->get( 'p' ), wp_get_current_user() );
					exit;
				} elseif ( isset( $this->screens[ $slug ] ) ) {
					// Render screen.
					$class_name = $this->screens[ $this->current ];
					/** @var Screen $screen */
					$screen = $class_name::get_instance();
					// Is there children?
					$child = $wp_query->get( 'hashboard-child' );
					if ( !$screen->has_children( $child ) ) {
						$child = '';
					}
					global $wp_styles;
					wp_enqueue_style( 'bootstrap' );
					wp_enqueue_script( 'hashboard' );
					/**
					 * hashboard_enqueue_scripts
					 *
					 * Print scripts
					 *
					 * @param bool $is_head
					 */
					do_action( 'hashboard_enqueue_scripts', $screen, $child );
					self::load_template( 'body.php', [
						'page' => $screen,
						'hashboard' => self::get_instance(),
						'child' => $child,
					] );
					exit;
				} else {
					throw new Exception( 'no editor', 404 );
				}
			} catch ( \Exception $e ) {
				if ( 404 == $e->getCode() ) {
					$wp_query->set_404();
				} else {
					wp_die( $e->getMessage(), get_status_header_desc( $e->getCode() ), [
						'back_link' => true,
						'response'  => $e->getCode(),
					] );
				}
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
	 * Get editor URL
	 *
	 * @param $key
	 * @param $object
	 *
	 * @return string
	 */
	public static function editor( $key, $object ) {
		return self::url( sprintf( '/%s/%d', $key, $object ) );
	}

	/**
	 * Load template
	 *
	 * @param string $template
	 * @param array $args
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
		 * @param string $path File path.
		 * @param string $temnplate Requited template file name.
		 * @param array $args Past parameters.
		 */
		$located = apply_filters( 'hashboard_template', $located, $template, $args );
		if ( !$located || !file_exists( $located ) ) {
			trigger_error( sprintf( __( 'Template %s doesn\'t exist.', 'hashboard' ), $located ), E_USER_WARNING );
		} else {
			if ( $args ) {
				extract( $args );
			}
			include $located;
		}
	}

	/**
	 * Get screen URL
	 *
	 * @param string $path
	 * @return string
	 */
	public static function screen_url( $path = '' ) {
		$base = untrailingslashit( home_url( self::get_instance()->get_prefix() ) );
		if ( $path ) {
			$base .= '/' . ltrim( $path, '/' );
		}
		return $base;
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
		$base_url = explode( 'wp-content/themes', get_stylesheet_directory_uri() );
		$base_url = str_replace( ABSPATH, $base_url[ 0 ], self::dir() );
		return untrailingslashit( $base_url ) . $path;
	}

	/**
	 * Enqueue screen css.
	 */
	public function enqueue_screen_styles() {
		wp_styles()->do_items( false );
	}

	/**
	 * Enqueue screen scripts.
	 */
	public function enqueue_screen_scripts() {
		wp_scripts()->do_footer_items();
	}
}
