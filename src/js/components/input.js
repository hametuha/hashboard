/*!
 * Input field component for React
 *
 */

import { useState, useEffect } from '@wordpress/element';

/**
 * Input Field Component
 * @param {Object} props - Component props
 */
const InputField = ( props ) => {
	const {
		id,
		original = '',
		title,
		description = '',
		rows = '3',
		type = 'text',
		onDataChanged,
		editingLabel = 'Editing',
		editLabel = 'Edit',
		noValue = 'No value',
	} = props;

	const [ editing, setEditing ] = useState( false );
	const [ current, setCurrent ] = useState( '' );

	// 入力タイプのバリデーション
	const validTypes = [
		'text', 'password', 'email', 'number', 'url',
		'textarea', 'tel',
	];
	const isValidType = validTypes.includes( type );
	const isTextArea = type === 'textarea';

	// 複数行テキストを配列に変換
	const originalLines = original ? original.split( '\n' ) : [];

	// forId生成
	const forId = `${ id }::for`;

	// 編集モード切り替えハンドラー
	const handleCheckboxChange = () => {
		if ( ! editing ) {
			// 編集モードに入る
			setCurrent( original );
			setEditing( true );
		} else {
			// 編集モードを終了
			setEditing( false );
			if ( current !== original && onDataChanged ) {
				onDataChanged( current, id );
			}
		}
	};

	// 入力値変更ハンドラー
	const handleInputChange = ( e ) => {
		setCurrent( e.target.value );
	};

	// ツールチップ初期化（jQueryベースなので、useEffectで処理）
	useEffect( () => {
		// jQueryが利用可能な場合のみツールチップを初期化
		if ( typeof window.jQuery !== 'undefined' && description ) {
			const $ = window.jQuery;
			$( `label[for="${ id }"] .tooltipped` ).tooltip( { delay: 50 } );
		}
	}, [ id, description ] );

	// 無効なタイプの場合は何も表示しない
	if ( ! isValidType ) {
		return null;
	}

	return (
		<div className="hb-input-field">
			<div className="form-row">
				<div className="form-group col-sm-10">
					<label className="hb-input-field-label" htmlFor={ id }>
						{ title }
						{ description && (
							<span
								className="hb-input-field-tooltip tooltipped"
								data-position="top"
								title={ description }
							>
								<i className="material-icons">help</i>
							</span>
						) }
					</label>

					{ ! isTextArea && editing && (
						<input
							id={ id }
							type={ type }
							value={ current }
							onChange={ handleInputChange }
							className="validate form-control"
						/>
					) }

					{ isTextArea && editing && (
						<textarea
							id={ id }
							value={ current }
							onChange={ handleInputChange }
							rows={ rows }
							className="validate form-control"
						/>
					) }

					{ original && ! editing && (
						<div className="hb-input-field-value">
							{ originalLines.map( ( line, index ) => (
								<div key={ index }>{ line }</div>
							) ) }
						</div>
					) }

					{ ! original && ! editing && (
						<p className="hb-input-field-no-value">{ noValue }</p>
					) }

					<p className="hb-input-field-helper" />
				</div>

				<div className="form-group col-sm-2 text-right">
					<div className="switch">
						<input
							className="switch-input sr-only"
							id={ forId }
							type="checkbox"
							checked={ editing }
							onChange={ handleCheckboxChange }
						/>
						<label className="switch-label" htmlFor={ forId }>
							{ editing ? (
								<span className="switch-on">{ editingLabel }</span>
							) : (
								<span className="switch-off">{ editLabel }</span>
							) }
						</label>
					</div>
				</div>
			</div>
		</div>
	);
};

// Export component
export default InputField;
