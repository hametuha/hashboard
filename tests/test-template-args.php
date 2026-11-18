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
		$user_id = self::factory()->user->create( array( 'user_email' => 'gravatar-test@example.com' ) );
		$user    = get_userdata( $user_id );
		ob_start();
		\Hametuha\Hashboard::load_template( 'gravatar.php', array( 'user' => $user ) );
		$html = ob_get_clean();
		// Avatar for the passed user: Gravatar hashes the email (SHA-256 since WP 6.8).
		$this->assertStringContainsString( hash( 'sha256', 'gravatar-test@example.com' ), $html );
	}
}
