<?php
/**
 * Editor template must print exactly one <title>.
 *
 * @package hashboard
 */

use Hametuha\Hashboard\Pattern\Editor;

/**
 * Editor fixture.
 */
class Hashboard_Test_Title_Editor extends Editor {

	public function slug() {
		return 'title-editor';
	}

	public function label() {
		return 'Title Editor';
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
 * Duplicate <title> on editor screens.
 */
class EditorTitleTest extends WP_UnitTestCase {

	/**
	 * Reset query vars and theme support.
	 */
	public function tear_down() {
		set_query_var( 'hashboard', '' );
		set_query_var( 'hashboard-child', '' );
		remove_theme_support( 'title-tag' );
		parent::tear_down();
	}

	/**
	 * Render the editor template.
	 *
	 * @return string
	 */
	private function render() {
		set_query_var( 'hashboard', 'editor' );
		set_query_var( 'hashboard-child', 'title-editor' );
		$editor = Hashboard_Test_Title_Editor::get_instance();
		// Singletons outlive WP_UnitTestCase's hook reset, so re-register the title filter.
		add_filter( 'document_title_parts', array( $editor, 'title_parts' ) );
		ob_start();
		\Hametuha\Hashboard::load_template( 'editor.php', array(
			'label'    => $editor->label(),
			'back_url' => home_url(),
			'page'     => 'editor',
			'child'    => 'title-editor',
			'editor'   => $editor,
			'object'   => null,
		) );
		return ob_get_clean();
	}

	public function test_title_tag_theme_prints_one_title() {
		// Registering title-tag after wp_loaded triggers _doing_it_wrong(), which is fine in a test.
		$this->setExpectedIncorrectUsage( "add_theme_support( 'title-tag' )" );
		add_theme_support( 'title-tag' );
		$html = $this->render();
		$this->assertSame( 1, preg_match_all( '#<title>#', $html ) );
		$this->assertStringContainsString( 'Title Editor', $html );
	}

	public function test_theme_without_title_tag_keeps_fallback_title() {
		remove_theme_support( 'title-tag' );
		$html = $this->render();
		$this->assertSame( 1, preg_match_all( '#<title>#', $html ) );
		$this->assertStringContainsString( '<title>Title Editor | ', $html );
	}
}
