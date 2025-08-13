/*!
 * Toast Plugin
 */

/**
 * トーストメッセージを表示する
 *
 * @param {string} html     表示するHTML
 * @param {number} duration 表示時間（ミリ秒）
 * @return {HTMLElement}    作成されたトースト要素
 */
const toast = function( html, duration ) {
	const toastElement = document.createElement( 'div' );
	toastElement.className = 'toast';
	toastElement.innerHTML = html;
	document.body.appendChild( toastElement );

	// DOMの更新を確実に行うために少し遅延させる
	setTimeout( () => {
		toastElement.classList.add( 'init' );

		if ( duration ) {
			setTimeout( () => {
				toastElement.classList.remove( 'init' );

				// アニメーション終了後に要素を削除
				toastElement.addEventListener( 'transitionend', () => {
					if ( toastElement.parentNode ) {
						toastElement.parentNode.removeChild( toastElement );
					}
				}, { once: true } );
			}, duration );
		}
	}, 1 );

	return toastElement;
};

export default toast;
