<?php
/**
 * Roles allowed to open wp-admin/profile.php (issue #86).
 *
 * @package hashboard
 */

use Hametuha\Hashboard\Router\Profile;

/**
 * Profile::user_can() must respect the hashboard_allowed_roles filter.
 */
class ProfileRouterTest extends WP_UnitTestCase {

	public function test_only_administrator_by_default() {
		$admin  = self::factory()->user->create( array( 'role' => 'administrator' ) );
		$editor = self::factory()->user->create( array( 'role' => 'editor' ) );
		$this->assertTrue( Profile::get_instance()->user_can( $admin ) );
		$this->assertFalse( Profile::get_instance()->user_can( $editor ) );
	}

	public function test_filter_changes_allowed_roles() {
		$admin  = self::factory()->user->create( array( 'role' => 'administrator' ) );
		$editor = self::factory()->user->create( array( 'role' => 'editor' ) );
		add_filter( 'hashboard_allowed_roles', function () {
			return array( 'editor' );
		} );
		$this->assertTrue( Profile::get_instance()->user_can( $editor ) );
		$this->assertFalse( Profile::get_instance()->user_can( $admin ) );
	}
}
