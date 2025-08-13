/*!
 * HbFitRows Plugin
 * Fit textarea's height with rows.
 *
 * @strategy defer
 */

( function() {
	'use strict';

	/**
	 * Fit textarea's height with rows.
	 * @param {HTMLTextAreaElement} textarea - Textarea element to resize
	 */
	function fitRows( textarea ) {
		if ( ! textarea ) {
			return;
		}

		// 行の高さを計算
		const computed = parseInt( window.getComputedStyle( textarea ).getPropertyValue( 'line-height' ).replace( /[^0-9.]/, '' ), 10 );
		const height = textarea.scrollHeight;

		// data-min-rows属性から最小行数を取得（指定がなければ1）
		const minRows = parseInt( textarea.getAttribute( 'data-min-rows' ) || '1', 10 );

		// 必要な行数を計算（スクロール高さ÷行の高さ）と最小行数を比較して大きい方を採用
		const lines = Math.max( Math.floor( height / computed ), minRows );

		// rows属性を設定
		textarea.setAttribute( 'rows', lines );
	}

	// すべての対象テキストエリアに適用する関数
	function applyToAll() {
		document.querySelectorAll( 'textarea.resizable' ).forEach( fitRows );
	}

	// キー入力イベントにバインド
	document.addEventListener( 'keyup', function( event ) {
		if ( event.target.tagName.toLowerCase() === 'textarea' &&
			event.target.classList.contains( 'resizable' ) ) {
			fitRows( event.target );
		}
	} );

	// DOM読み込み完了時に実行
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', applyToAll );
	} else {
		applyToAll();
	}
}() );
