/**
 * Test for toast.js
 */

/* eslint-env jest */

// Import compiled plugin
require('../assets/js/plugins/toast.js');
const { toast } = window.hb?.plugins || {};

describe( 'Toast Plugin', () => {
	// 各テスト後にDOMをクリーンアップ
	afterEach( () => {
		document.body.innerHTML = '';
	} );

	test( 'creates toast element with correct structure', () => {
		const testMessage = 'Test Toast';
		const toastElement = toast( testMessage );

		// 要素が作成されていることを確認
		expect( toastElement ).toBeDefined();
		expect( toastElement instanceof HTMLElement ).toBe( true );
		expect( toastElement.className ).toContain( 'hb-toast' );

		// メッセージがspan要素内に含まれていることを確認
		const spanElement = toastElement.querySelector( 'span' );
		expect( spanElement ).not.toBeNull();
		expect( spanElement.textContent ).toBe( testMessage );

		// DOMに追加されていることを確認
		const toastInDOM = document.querySelector( '.hb-toast' );
		expect( toastInDOM ).not.toBeNull();
		expect( toastInDOM ).toBe( toastElement );
	} );

	test( 'adds init class after timeout', ( done ) => {
		const toastElement = toast( 'Test' );

		// 最初はinitクラスがない
		expect( toastElement.classList.contains( 'init' ) ).toBe( false );

		// requestAnimationFrame後にinitクラスが追加される
		requestAnimationFrame( () => {
			expect( toastElement.classList.contains( 'init' ) ).toBe( true );
			done();
		} );
	} );

	test( 'removes init class after duration', ( done ) => {
		const duration = 50;
		const toastElement = toast( 'Test', { duration } );

		// requestAnimationFrame後にinitクラスが追加される
		requestAnimationFrame( () => {
			expect( toastElement.classList.contains( 'init' ) ).toBe( true );

			// duration後にinitクラスが削除される
			setTimeout( () => {
				expect( toastElement.classList.contains( 'init' ) ).toBe( false );
				expect( toastElement.classList.contains( 'removing' ) ).toBe( true );
				done();
			}, duration + 10 );
		} );
	} );

	test( 'registers in global namespace when in browser environment', () => {
		// グローバル名前空間に登録されていることを確認
		expect( window.hb ).toBeDefined();
		expect( window.hb.plugins ).toBeDefined();
		expect( typeof window.hb.plugins.toast ).toBe( 'function' );
	} );
} );
