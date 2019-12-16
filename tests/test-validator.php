<?php
/**
 * Post type test
 *
 * @package Hamelp
 */

/**
 * Test validator
 */
class ValidatorTest extends WP_UnitTestCase {


	/**
	 * Test lang validator
	 */
	public function test_lang_code() {
		// allow
		$this->assertTrue( \Hametuha\Hashboard\API\Language::is_valid_locale( 'ja' ) );
		$this->assertTrue( \Hametuha\Hashboard\API\Language::is_valid_locale( 'en_US' ) );
		$this->assertTrue( \Hametuha\Hashboard\API\Language::is_valid_locale( 'en_AU' ) );
		$this->assertTrue( \Hametuha\Hashboard\API\Language::is_valid_locale( 'zh_CN' ) );
		$this->assertTrue( \Hametuha\Hashboard\API\Language::is_valid_locale( '' ) );
		// Invalid
		$this->assertFalse( \Hametuha\Hashboard\API\Language::is_valid_locale( 'ja-JP' ) );
		$this->assertFalse( \Hametuha\Hashboard\API\Language::is_valid_locale( '_EN' ) );
		$this->assertFalse( \Hametuha\Hashboard\API\Language::is_valid_locale( 'ja_' ) );
		$this->assertFalse( \Hametuha\Hashboard\API\Language::is_valid_locale( '-JP' ) );
		
		
	}
}
