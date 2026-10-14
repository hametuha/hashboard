<?php
/**
 * Regression tests for issue #48.
 *
 * @package hashboard
 */

use Hametuha\Hashboard\Pattern\Editor;
use Hametuha\Hashboard\Pattern\Screen;

/**
 * Screen fixture.
 */
class Hashboard_Test_Scope_Screen extends Screen {

	public function slug() {
		return 'scope-screen';
	}

	public function label() {
		return 'Scope Screen';
	}

	public function description( $page = '' ) {
		return 'Scope screen description.';
	}
}

/**
 * Editor fixture.
 */
class Hashboard_Test_Scope_Editor extends Editor {

	public function slug() {
		return 'scope-editor';
	}

	public function label() {
		return 'Scope Editor';
	}

	public function description( $page = '' ) {
		return 'Scope editor description.';
	}

	protected function get_object( $object_id, \WP_User $user ) {
		return null;
	}

	protected function is_editable( $object, \WP_User $user ) {
		return false;
	}

	public function content() {
		return '';
	}
}

/**
 * Title and meta description must only apply to the current screen.
 */
class ScreenScopeTest extends WP_UnitTestCase {

	/**
	 * Reset query vars.
	 */
	public function tear_down() {
		set_query_var( 'hashboard', '' );
		set_query_var( 'hashboard-child', '' );
		parent::tear_down();
	}

	/**
	 * Get filtered title parts for the current request.
	 *
	 * @return array
	 */
	private function title_parts() {
		// Singletons outlive WP_UnitTestCase's hook reset, so chain the callbacks directly.
		$title = array( 'title' => 'Original' );
		$title = Hashboard_Test_Scope_Screen::get_instance()->title_parts( $title );
		return Hashboard_Test_Scope_Editor::get_instance()->title_parts( $title );
	}

	/**
	 * Get rendered meta descriptions for the current request.
	 *
	 * @return string
	 */
	private function meta_html() {
		ob_start();
		Hashboard_Test_Scope_Screen::get_instance()->render_meta_description();
		Hashboard_Test_Scope_Editor::get_instance()->render_meta_description();
		return ob_get_clean();
	}

	public function test_non_hashboard_page_untouched() {
		$this->assertSame( 'Original', $this->title_parts()['title'] );
		$this->assertSame( '', $this->meta_html() );
	}

	public function test_other_hashboard_screen_untouched() {
		set_query_var( 'hashboard', 'profile' );
		$this->assertSame( 'Original', $this->title_parts()['title'] );
		$this->assertSame( '', $this->meta_html() );
	}

	public function test_current_screen_applies() {
		set_query_var( 'hashboard', 'scope-screen' );
		$this->assertSame( 'Scope Screen', $this->title_parts()['title'] );
		$html = $this->meta_html();
		$this->assertStringContainsString( 'Scope screen description.', $html );
		$this->assertSame( 1, substr_count( $html, '<meta name="description"' ) );
	}

	public function test_current_editor_applies() {
		set_query_var( 'hashboard', 'editor' );
		set_query_var( 'hashboard-child', 'scope-editor' );
		$this->assertSame( 'Scope Editor', $this->title_parts()['title'] );
		$html = $this->meta_html();
		$this->assertStringContainsString( 'Scope editor description.', $html );
		$this->assertSame( 1, substr_count( $html, '<meta name="description"' ) );
	}

	public function test_editor_slug_does_not_match_screen_route() {
		// /dashboard/scope-editor is not the editor route.
		set_query_var( 'hashboard', 'scope-editor' );
		$this->assertSame( 'Original', $this->title_parts()['title'] );
		$this->assertSame( '', $this->meta_html() );
	}
}
