/*!
 * Toast Plugin
 */

// トーストコンテナを格納する変数
let toastContainer = null;

/**
 * トーストコンテナを取得または作成する
 * @return {HTMLElement} トーストコンテナ要素
 */
const getToastContainer = () => {
	if ( ! toastContainer ) {
		toastContainer = document.createElement( 'div' );
		toastContainer.className = 'hb-toast-container';
		toastContainer.setAttribute( 'aria-live', 'polite' );
		toastContainer.setAttribute( 'aria-atomic', 'true' );
		document.body.appendChild( toastContainer );
	}
	return toastContainer;
};

/**
 * トーストメッセージを表示する
 *
 * @param {string|Object} message          表示するメッセージ（文字列またはオプションオブジェクト）
 * @param {Object}        options          オプション設定（messageが文字列の場合のみ）
 * @param {string}        options.icon     Material Iconsのアイコン名（例: 'done', 'error', 'info'）
 * @param {string}        options.type     タイプクラス（'success', 'error', 'warning', 'info'）
 * @param {number}        options.duration 表示時間（ミリ秒）デフォルト: 4000
 * @return {HTMLElement} 作成されたトースト要素
 *
 * @example
 * // シンプルな使い方
 * toast('保存しました');
 *
 * // アイコン付き
 * toast('保存しました', { icon: 'done', type: 'success' });
 *
 * // オブジェクト形式
 * toast({
 *   message: 'エラーが発生しました',
 *   icon: 'error',
 *   type: 'error',
 *   duration: 5000
 * });
 */
export const toast = function( message, options = {} ) {
	// 引数を正規化
	let config;
	if ( typeof message === 'object' && message !== null ) {
		config = message;
	} else {
		config = { ...options, message };
	}

	// デフォルト値を設定
	const {
		message: text = '',
		icon = null,
		type = '',
		duration = 4000,
	} = config;

	// アイコンをタイプから自動設定
	let finalIcon = icon;
	if ( ! finalIcon && type ) {
		switch ( type ) {
			case 'success':
				finalIcon = 'check_circle';
				break;
			case 'error':
				finalIcon = 'error';
				break;
			case 'warning':
				finalIcon = 'warning';
				break;
			case 'info':
				finalIcon = 'info';
				break;
		}
	}

	const container = getToastContainer();
	const toastElement = document.createElement( 'div' );
	toastElement.className = 'hb-toast';
	if ( type ) {
		toastElement.classList.add( `hb-toast-${ type }` );
	}
	toastElement.setAttribute( 'role', 'alert' );

	// アイコンを追加
	if ( finalIcon ) {
		const iconElement = document.createElement( 'i' );
		iconElement.className = `material-icons ${ type }`;
		iconElement.textContent = finalIcon;
		toastElement.appendChild( iconElement );
	}

	// メッセージを追加
	const messageElement = document.createElement( 'span' );
	messageElement.textContent = text;
	toastElement.appendChild( messageElement );

	// コンテナに追加（スタック）
	container.appendChild( toastElement );

	// アニメーション開始
	requestAnimationFrame( () => {
		toastElement.classList.add( 'init' );

		if ( duration > 0 ) {
			setTimeout( () => {
				toastElement.classList.remove( 'init' );
				toastElement.classList.add( 'removing' );

				// アニメーション終了後に要素を削除
				const removeToast = () => {
					if ( toastElement.parentNode ) {
						toastElement.parentNode.removeChild( toastElement );

						// コンテナが空になったら削除
						if ( container.children.length === 0 && toastContainer ) {
							document.body.removeChild( toastContainer );
							toastContainer = null;
						}
					}
				};

				// transitionendイベントを使用
				toastElement.addEventListener( 'transitionend', removeToast, { once: true } );

				// フォールバック: transitionendが発火しない場合
				setTimeout( removeToast, 500 );
			}, duration );
		}
	} );

	return toastElement;
};
