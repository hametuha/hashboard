<?php
/**
 * Regression tests for issue #47.
 *
 * @package hashboard
 */

/**
 * Logged-in users without the default capability must not be logged out.
 */
class ForbiddenTest extends WP_UnitTestCase {

	/**
	 * Run main-query pre_get_posts for a Hashboard request.
	 */
	private function request_dashboard() {
		global $wp_the_query;
		$original     = $wp_the_query;
		$query        = new WP_Query();
		$wp_the_query = $query;
		$query->set( 'hashboard', 'dashboard' );
		try {
			\Hametuha\Hashboard::get_instance()->pre_get_posts( $query );
		} finally {
			$wp_the_query = $original;
		}
	}

	/**
	 * Create and log in a user who has no capability.
	 *
	 * @return int
	 */
	private function login_powerless_user() {
		add_role( 'hb_powerless', 'Powerless', array() );
		$user_id = self::factory()->user->create( array( 'role' => 'hb_powerless' ) );
		wp_set_current_user( $user_id );
		return $user_id;
	}

	public function tear_down() {
		remove_role( 'hb_powerless' );
		wp_set_current_user( 0 );
		parent::tear_down();
	}

	public function test_forbidden_user_gets_403() {
		$this->login_powerless_user();
		try {
			$this->request_dashboard();
			$this->fail( 'wp_die() should be called.' );
		} catch ( WPDieException $e ) {
			$this->assertStringContainsString( 'permission', $e->getMessage() );
		}
	}

	public function test_forbidden_action_fires() {
		$user_id = $this->login_powerless_user();
		$fired   = 0;
		add_action( 'hashboard_forbidden', function ( $user ) use ( &$fired ) {
			$fired = $user->ID;
		} );
		try {
			$this->request_dashboard();
		} catch ( WPDieException $e ) {
			// Expected.
		}
		$this->assertSame( $user_id, $fired );
	}

	public function test_forbidden_redirect_filter() {
		$this->login_powerless_user();
		add_filter( 'hashboard_forbidden_redirect', function () {
			return home_url( '/verify-email/' );
		} );
		// Intercept wp_safe_redirect() before exit.
		add_filter( 'wp_redirect', function ( $location ) {
			throw new RuntimeException( $location );
		} );
		try {
			$this->request_dashboard();
			$this->fail( 'Should redirect.' );
		} catch ( RuntimeException $e ) {
			$this->assertSame( home_url( '/verify-email/' ), $e->getMessage() );
		}
	}

	public function test_permitted_user_passes() {
		wp_set_current_user( self::factory()->user->create( array( 'role' => 'subscriber' ) ) );
		$this->request_dashboard();
		$this->assertTrue( true, 'No redirect or die for permitted user.' );
	}
}
