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

/**
 * Bootstrap instance
 *
 * @package hashboard
 */
class Hashboard extends Singleton {

	private static $version = '0.8.8';

	/**
	 * List of instances.
	 *
	 * @var array
	 */
	public $screens = array();

	/**
	 * List of editors.
	 *
	 * @var array
	 */
	protected $editors = array();

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
		$this->editors = apply_filters( 'hashboard_editors', array() );
		add_filter( 'query_vars', array( $this, 'query_vars' ) );
		add_filter( 'rewrite_rules_array', array( $this, 'rewrite_rules' ) );
		add_action( 'pre_get_posts', array( $this, 'pre_get_posts' ) );
		add_action( 'hashboard_head', array( $this, 'enqueue_screen_styles' ), 11 );
		add_action( 'hashboard_footer', array( $this, 'enqueue_screen_scripts' ), 11 );
		add_action( 'init', function () {
			/**
			 * hashboard_screens
			 *
			 * @param array $screens Associative array of Hametuha\Hashboard\Pattern\Screen
			 */
			$this->screens = apply_filters( 'hashboard_screens', array(
				'dashboard' => Dashboard::class,
				'profile'   => Profile::class,
				'account'   => Account::class,
			) );
		}, 1 );
		// Register assets globally.
		add_action( 'init', array( $this, 'register_assets' ), 11 );
		// Register all API.
		foreach ( array(
			'API'    => RestApi::class,
			'Bridge' => Singleton::class,
		) as $name => $subclass ) {
			foreach ( scandir( __DIR__ . '/Hashboard/' . $name ) as $file ) {
				if ( ! preg_match( '#^([^._].*)\.php$#u', $file, $matches ) ) {
					continue;
				}
				$class_name = "Hametuha\\Hashboard\\{$name}\\{$matches[1]}";
				if ( ! class_exists( $class_name ) ) {
					continue;
				}
				$reflection = new \ReflectionClass( $class_name );
				if ( ! $reflection->isSubclassOf( $subclass ) || $reflection->isAbstract() ) {
					continue;
				}
				call_user_func( array( $class_name, 'get_instance' ) );
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
		return array_merge( array(
			"^{$prefix}/?$"                      => 'index.php?hashboard=dashboard',
			"^{$prefix}/editor/([^/]+)/(\d+)/?$" => 'index.php?hashboard=editor&hashboard-child=$matches[1]&p=$matches[2]',
			"^{$prefix}/([^/]+)/?$"              => 'index.php?hashboard=$matches[1]',
			"^{$prefix}/([^/]+)/([^/]+)/?$"      => 'index.php?hashboard=$matches[1]&hashboard-child=$matches[2]',
		), $rules );
	}

	/**
	 * Get plugin version.
	 *
	 * @return string
	 */
	public static function version() {
		return self::$version;
	}

	/**
	 * Get user action links
	 *
	 * @return array
	 */
	public function user_actions() {
		$links = array();
		if ( current_user_can( self::get_wp_accessible_capability() ) ) {
			array_unshift( $links, array(
				'label' => __( 'WP Admin', 'hashboard' ),
				'url'   => admin_url(),
				'class' => '',
			) );
		}
		$links['logout'] = array(
			'label' => __( 'Log out', 'hashboard' ),
			'url'   => wp_logout_url(),
			'class' => '',
		);
		/**
		 * hashboar_user_actions
		 *
		 * @param array<string, array{label:string, url:string, class:string}> $links
		 */
		return apply_filters( 'hashboar_user_actions', $links );
	}

	/**
	 * Register assets.
	 */
	public function register_assets() {
		// Material Design Icons
		wp_register_style( 'material-design-icon', 'https://fonts.googleapis.com/icon?family=Material+Icons', array(), null );
		wp_register_style( 'bootstrap', self::url( '/assets/css/hashboard.css' ), array( 'material-design-icon' ), self::version() );
		// Bootstrap
		wp_register_script( 'popper', self::url( '/assets/js/popper.min.js' ), array(), '1.16.0', true );
		// Popper
		wp_register_script( 'bootstrap', self::url( '/assets/js/bootstrap.min.js' ), array( 'jquery', 'popper' ), '4.4.1', true );
		// Chart JS
		wp_register_script( 'chart-js', self::url( '/assets/js/Chart.min.js' ), array(), '2.9.3', true );
		// Moment
		if ( wp_script_is( 'moment', 'registered' ) ) {
			wp_deregister_script( 'moment' );
		}
		wp_register_script( 'moment', self::url( '/assets/js/moment-with-locales.min.js' ), array(), '2.24.0', true );
		// Vue.js.
		wp_register_script( 'vue-js', self::url( '/assets/js/vue.min.js' ), array(), '2.6.11', true );
		$vue_helper = <<<JS
			window.bus = new Vue({});
JS;
		wp_add_inline_script( 'vue-js', $vue_helper );
		// Chart JS vue.
		wp_register_script( 'chart-js-vue', self::url( '/assets/js/vue-chartjs.min.js' ), array( 'chart-js', 'vue-js' ), '3.5.0', true );
		// Hash Rest
		wp_register_script( 'hashboard-rest', self::url( '/assets/js/hashboard-rest.js' ), array( 'jquery', 'hb-plugins-toast' ), self::version(), true );
		wp_localize_script( 'hashboard-rest', 'HashRest', array(
			'root'  => rest_url( '/' ),
			'nonce' => wp_create_nonce( 'wp_rest' ),
			'error' => __( 'Server returns error. Please try again later', 'hashboard' ),
		) );
		// Hashboard Utility.
		wp_register_script( 'hashboard', self::url( '/assets/js/hashboard-helper.js' ), array(
			'bootstrap',
			'hashboard-rest',
			'hb-plugins-toast',
			'hb-plugins-fitrows',
		), self::version(), true );
		// Register scripts.
		foreach ( array( 'components', 'filters', 'plugins' ) as $group ) {
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
					if ( ! $screen->has_children( $child ) ) {
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
					self::load_template( 'body.php', array(
						'page'      => $screen,
						'hashboard' => self::get_instance(),
						'child'     => $child,
					) );
					exit;
				} else {
					throw new Exception( 'no editor', 404 );
				}
			} catch ( \Exception $e ) {
				if ( 404 == $e->getCode() ) {
					$wp_query->set_404();
				} else {
					wp_die( $e->getMessage(), get_status_header_desc( $e->getCode() ), array(
						'back_link' => true,
						'response'  => $e->getCode(),
					) );
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
		return apply_filters( 'hashboard_default_cap', 'read' );
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
		return dirname( __DIR__, 2 );
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
	public static function load_template( $template, $args = array() ) {
		$located = '';
		foreach ( array(
			self::dir() . '/templates',
			get_template_directory() . '/template-parts/hashboard',
			get_stylesheet_directory() . '/template-parts/hashboard',
		) as $dir ) {
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
		$path = self::dir() . $path;
		if ( str_contains( $path, WP_PLUGIN_DIR ) ) {
			// This is in plugin directory.
			return str_replace( WP_PLUGIN_DIR, WP_PLUGIN_URL, $path );
		} elseif ( str_contains( $path, WPMU_PLUGIN_DIR ) ) {
			// MU plugin directory.
			return str_replace( WPMU_PLUGIN_DIR, WPMU_PLUGIN_URL, $path );
		} elseif ( str_contains( get_theme_root(), $path ) ) {
			// Theme.
			return str_replace( get_theme_root(), get_theme_root_uri(), $path );
		}
		return str_replace( ABSPATH, home_url( '/' ), $path );
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
