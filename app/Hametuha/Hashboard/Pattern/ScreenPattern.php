<?php

namespace Hametuha\Hashboard\Pattern;

use Hametuha\Hashboard;
use Hametuha\SingletonPattern\Singleton;


/**
 * All screen patterns should extend this class.
 */
abstract class ScreenPattern extends Singleton {

	/**
	 * Should return unique URL slug.
	 *
	 * @return string
	 */
	abstract public function slug();

	/**
	 * Should return string.
	 *
	 * @return string
	 */
	abstract public function label();

	/**
	 * Get description of this screen.
	 *
	 * @param string $page
	 * @return string
	 */
	public function description( $page = '' ) {
		return '';
	}

	/**
	 * Get meta description
	 *
	 * @return string
	 */
	public function meta_description( $page = '' ) {
		$description = $this->description( $page );
		return trim( strip_tags( str_replace( "\n", '', $description ) ) );
	}

	/**
	 * Head action
	 *
	 * @param string $child If this is not child page, empty string.
	 */
	public function head( $child = '' ) {
		wp_enqueue_script( 'hb-hashboard-helper' );
	}

	/**
	 * Footer action
	 *
	 * @param string $child If this is not child page, empty string.
	 */
	public function footer( $child = '' ) {
		// Do something.
	}

	/**
	 * {@inheritDoc}
	 */
	protected function init() {
		// Title tag.
		add_filter( 'document_title_parts', array( $this, 'title_parts' ) );
		// Meta description.
		add_action( 'wp_head', array( $this, 'render_meta_description' ) );
	}

	/**
	 * Support documental title parts.
	 *
	 * @param array $title
	 * @return array
	 */
	public function title_parts( $title ) {
		if ( ! $this->is_current_screen() ) {
			return $title;
		}
		$title['title'] = $this->label();
		$title['site']  = get_bloginfo( 'name' );
		return $title;
	}

	/**
	 * Render meta description.
	 *
	 * This will be used in <meta name="description" content="...">
	 */
	public function render_meta_description() {
		if ( ! $this->is_current_screen() ) {
			return;
		}
		$meta_description = $this->meta_description( get_query_var( 'hashboard-child' ) );
		if ( ! empty( $meta_description ) ) {
			echo '<meta name="description" content="' . esc_attr( $meta_description ) . '">' . "\n";
		}
	}

	/**
	 * Detect if this screen is the one being rendered.
	 *
	 * Title and meta description hooks are registered on every request,
	 * so they must bail unless this screen is the current one.
	 *
	 * @return bool
	 */
	protected function is_current_screen() {
		return Hashboard::is_page( $this->slug() );
	}
}
