<?php

namespace Hametuha\Hashboard\Utility;
use Hametuha\Pattern\Singleton;


/**
 * Class UserContent
 *
 * @package hashboard
 */
class UserContent extends Singleton {

	public $post_type = 'user-content';

	public $taxonomy = 'user-content-position';

	/**
	 * Register user content
	 */
	protected function init() {
		add_action( 'init', array( $this, 'register_customs' ) );
		add_action( 'admin_init', array( $this, 'set_default_position' ) );
	}

	/**
	 * Register post type.
	 */
	public function register_customs() {
		// Register custom post type.
		$post_args = array(
			'label'             => __( 'User Content', 'hashboard' ),
			'public'            => false,
			'show_ui'           => true,
			'menu_icon'         => 'dashicons-info',
			'show_in_nav_menus' => false,
			'hierarchical'      => false,
			'supports'          => array( 'title', 'editor' ),
			'show_in_admin_bar' => false,
			'menu_position'     => 100,
		);
		$post_args = apply_filters( 'hashboard_user_content_args', $post_args );
		register_post_type( 'user-content', $post_args );
		// Register custom taxonomy
		$tax_args = array(
			'label'             => __( 'Position', 'hashboard' ),
			'public'            => false,
			'show_ui'           => true,
			'show_in_nav_menus' => false,
			'hierarchical'      => true,
		);
		$tax_args = apply_filters( 'hashboard_user_content_taxonomy_args', $tax_args );
		register_taxonomy( $this->taxonomy, array( 'user-content' ), $tax_args );
	}

	/**
	 * Get user content.
	 *
	 * @param string $position
	 * @param string $before
	 * @param string $after
	 */
	public static function render( $position, $before = '<div class="hb-user-content">', $after = '</div>' ) {
		$content = self::get( $position );
		if ( $content ) {
			echo $before . $content . $after;
		}
	}

	/**
	 * Get content
	 *
	 * @param string $position
	 *
	 * @return string
	 */
	public static function get( $position ) {
		$self  = self::get_instance();
		$query = new \WP_Query( array(
			'post_type'      => $self->post_type,
			'posts_per_page' => 1,
			'tax_query'      => array(
				array(
					'taxonomy' => $self->taxonomy,
					'feild'    => 'slug',
					'terms'    => $position,
				),
			),
		) );
		if ( ! $query->have_posts() ) {
			return '';
		}
		$content = '';
		ob_start();
		while ( $query->have_posts() ) {
			$query->the_post();
			the_content();
			$content = ob_get_contents();
		}
		wp_reset_postdata();
		ob_end_clean();
		return $content;
	}

	/**
	 * Get position arguments.
	 */
	protected function get_positions() {
		$positions = array();
		return apply_filters( 'hashboard_user_content_positions', $positions );
	}

	/**
	 * Register default position.
	 */
	public function set_default_position() {
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			return;
		}
		$positions = $this->get_positions();
		$hash      = md5( serialize( $positions ) );
		$saved     = get_option( 'hashboard_user_content_positions', '' );
		if ( $saved === $hash ) {
			// No change.
			return;
		}
		foreach ( $positions as $slug => $position ) {
			// Check if term exists.
			$term = get_term_by( 'slug', $slug, $this->taxonomy );
			if ( $term ) {
				// Term exists. Update it.
				wp_update_term( $term->term_id, $this->taxonomy, array(
					'name' => $position,
				) );
			} else {
				// Create new term.
				wp_insert_term( $position, $this->taxonomy, array(
					'slug' => $slug,
				) );
			}
		}
		update_option( 'hashboard_user_content_positions', $hash );
	}
}
