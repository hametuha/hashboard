<?php
/**
 * Partial templates receive values via $args (issue #81).
 *
 * @package hashboard
 */

/**
 * load_template() passes values as $args, not as extracted variables.
 */
class TemplateArgsTest extends WP_UnitTestCase {

	public function test_gravatar_template_uses_passed_user() {
		$user_id = self::factory()->user->create();
		$queried = null;
		// Capture what get_avatar() receives instead of matching the URL hash (MD5 before WP 6.8, SHA-256 after).
		$capture = function ( $args, $id_or_email ) use ( &$queried ) {
			$queried = $id_or_email;
			return $args;
		};
		add_filter( 'pre_get_avatar_data', $capture, 10, 2 );
		ob_start();
		\Hametuha\Hashboard::load_template( 'gravatar.php', array( 'user' => get_userdata( $user_id ) ) );
		ob_end_clean();
		remove_filter( 'pre_get_avatar_data', $capture, 10 );
		$this->assertSame( $user_id, $queried );
	}
}
