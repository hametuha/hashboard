<?php
/**
 * Screen template must print exactly one <title> (issue #50).
 *
 * @package hashboard
 */

use Hametuha\Hashboard\Screens\Dashboard;

/**
 * Block themes don't declare title-tag, so body.php must print the title itself.
 */
class BodyTitleTest extends WP_UnitTestCase {

	/**
	 * Log in a user so the template can render the header.
	 */
	public function set_up() {
		parent::set_up();
		wp_set_current_user( self::factory()->user->create( array( 'role' => 'subscriber' ) ) );
	}

	/**
	 * Reset query vars and theme support.
	 */
	public function tear_down() {
		set_query_var( 'hashboard', '' );
		remove_theme_support( 'title-tag' );
		parent::tear_down();
	}

	/**
	 * Render the screen template.
	 *
	 * @return string
	 */
	private function render() {
		set_query_var( 'hashboard', 'dashboard' );
		$screen = Dashboard::get_instance();
		// Singletons outlive WP_UnitTestCase's hook reset, so re-register the title filter.
		add_filter( 'document_title_parts', array( $screen, 'title_parts' ) );
		ob_start();
		\Hametuha\Hashboard::load_template( 'body.php', array(
			'page'      => $screen,
			'hashboard' => \Hametuha\Hashboard::get_instance(),
			'child'     => '',
		) );
		return ob_get_clean();
	}

	public function test_theme_without_title_tag_prints_title() {
		remove_theme_support( 'title-tag' );
		$html = $this->render();
		$this->assertSame( 1, preg_match_all( '#<title>#', $html ) );
		$this->assertStringContainsString( '<title>' . esc_html( Dashboard::get_instance()->label() ) . ' &#8211; ', $html );
	}

	public function test_title_tag_theme_prints_one_title() {
		// add_theme_support( 'title-tag' ) is a no-op after wp_loaded, so register it directly.
		global $_wp_theme_features;
		$_wp_theme_features['title-tag'] = true;
		$html = $this->render();
		$this->assertSame( 1, preg_match_all( '#<title>#', $html ) );
		$this->assertStringContainsString( '<title>' . esc_html( Dashboard::get_instance()->label() ) . ' &#8211; ', $html );
	}
}
