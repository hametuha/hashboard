/**
 * Test for toast.js
 */

/* eslint-env jest */

// ESモジュールとしてインポート
import { toast } from '../src/js/plugins/toast';

describe( 'Toast Plugin', () => {
	// 各テスト後にDOMをクリーンアップ
	afterEach( () => {
		document.body.innerHTML = '';
	} );

	test( 'creates toast element with correct HTML', () => {
		const testHtml = '<p>Test Toast</p>';
		const toastElement = toast( testHtml );

		// 要素が作成されていることを確認
		expect( toastElement ).toBeDefined();
		expect( toastElement instanceof HTMLElement ).toBe( true );
		expect( toastElement.className ).toContain( 'toast' );
		expect( toastElement.innerHTML ).toBe( testHtml );

		// DOMに追加されていることを確認
		const toastInDOM = document.querySelector( '.toast' );
		expect( toastInDOM ).not.toBeNull();
		expect( toastInDOM ).toBe( toastElement );
	} );

	test( 'adds init class after timeout', ( done ) => {
		const toastElement = toast( 'Test' );

		// 最初はinitクラスがない
		expect( toastElement.classList.contains( 'init' ) ).toBe( false );

		// setTimeout後にinitクラスが追加される
		setTimeout( () => {
			expect( toastElement.classList.contains( 'init' ) ).toBe( true );
			done();
		}, 10 );
	} );

	test( 'removes init class after duration', ( done ) => {
		const duration = 50;
		const toastElement = toast( 'Test', duration );

		// durationミリ秒後にinitクラスが削除される
		setTimeout( () => {
			expect( toastElement.classList.contains( 'init' ) ).toBe( true );

			setTimeout( () => {
				expect( toastElement.classList.contains( 'init' ) ).toBe( false );
				done();
			}, duration + 10 );
		}, 10 );
	} );

	test( 'registers in global namespace when in browser environment', () => {
		// グローバル名前空間に登録されていることを確認
		expect( window.hb ).toBeDefined();
		expect( window.hb.plugins ).toBeDefined();
		expect( typeof window.hb.plugins.toast ).toBe( 'function' );

		// 後方互換性のための名前空間も確認
		expect( window.Hashboard ).toBeDefined();
		expect( typeof window.Hashboard.toast ).toBe( 'function' );
	} );
} );
