/*!
 * Sequence for React
 *
 */

import { useState } from '@wordpress/element';

/**
 * Sequence Item Component
 * @param {Object} props - Component props
 */
export const SequenceItem = ( props ) => {
	const {
		index,
		active = false,
		label = '',
		icon = '',
		onSelectIndex,
	} = props;

	// ボタンのクラス名を生成
	const btnClass = [
		'btn',
		'btn-floating',
		active ? 'pulse' : 'grey lighten-2',
	].join( ' ' );

	// アイテム選択ハンドラー
	const handleSelect = () => {
		if ( ! active && onSelectIndex ) {
			onSelectIndex( index );
		}
	};

	return (
		<li className="hb-sequence-item">
			<button type="button" onClick={ handleSelect } className={ btnClass }>
				{ icon ? (
					<i className="material-icons">{ icon }</i>
				) : (
					<span>{ index + 1 }</span>
				) }
			</button>
			<br />
			{ label && (
				<span className="hb-sequence-title">{ label }</span>
			) }
		</li>
	);
};

/**
 * Sequence Component
 * @param {Object} props - Component props
 */
export const Sequence = ( props ) => {
	const {
		active: initialActive = 0,
		steps = [],
		selectable = true,
		onPageChange,
	} = props;

	const [ activeIndex, setActiveIndex ] = useState( initialActive );

	// ステップアクティベーションハンドラー
	const handleActivate = ( index ) => {
		if ( selectable ) {
			setActiveIndex( index );
			if ( onPageChange ) {
				onPageChange( index );
			}
		}
	};

	return (
		<ul className="hb-sequence-wrapper">
			{ steps.map( ( step, index ) => (
				<SequenceItem
					key={ index }
					index={ index }
					active={ activeIndex === index }
					icon={ step.icon }
					label={ step.label }
					onSelectIndex={ handleActivate }
				/>
			) ) }
		</ul>
	);
};

// Export components - grab-deps style
