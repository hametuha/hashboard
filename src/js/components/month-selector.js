/*!
 * Month selector
 *
 */

import { useState, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Month Selector Component
 * @param {Object} props - Component props
 */
const MonthSelector = ( props ) => {
	const {
		label,
		maxYear = new Date().getFullYear(),
		minYear = new Date().getFullYear() - 10,
		initialMonth = new Date().getMonth() + 1,
		initialYear = new Date().getFullYear(),
		onDateUpdated,
	} = props;

	const [ curMonth, setCurMonth ] = useState( initialMonth );
	const [ curYear, setCurYear ] = useState( initialYear );

	// 月の選択肢（国際化対応）
	const months = useMemo( () => [
		__( 'January', 'hashboard' ),
		__( 'February', 'hashboard' ),
		__( 'March', 'hashboard' ),
		__( 'April', 'hashboard' ),
		__( 'May', 'hashboard' ),
		__( 'June', 'hashboard' ),
		__( 'July', 'hashboard' ),
		__( 'August', 'hashboard' ),
		__( 'September', 'hashboard' ),
		__( 'October', 'hashboard' ),
		__( 'November', 'hashboard' ),
		__( 'December', 'hashboard' ),
	], [] );

	// 年の選択肢
	const years = useMemo( () => {
		const range = [];
		let year = maxYear;
		while ( year >= minYear ) {
			range.push( {
				value: year,
				label: year + __( '年', 'hashboard' ),
			} );
			year--;
		}
		return range;
	}, [ maxYear, minYear ] );

	// 更新ボタンのラベル
	const updateLabel = __( 'Update', 'hashboard' );

	// 日付更新ハンドラー
	const handleUpdateYearMonth = () => {
		if ( onDateUpdated ) {
			const formattedMonth = ( '0' + curMonth ).slice( -2 );
			onDateUpdated( curYear.toString(), formattedMonth );
		}
	};

	return (
		<div className="hb-month-selector form-row" title={ label }>
			<div className="form-group col">
				<select
					className="form-control"
					value={ curYear }
					onChange={ ( e ) => setCurYear( parseInt( e.target.value ) ) }
				>
					{ years.map( ( year ) => (
						<option key={ year.value } value={ year.value }>
							{ year.label }
						</option>
					) ) }
				</select>
			</div>
			<div className="form-group col">
				<select
					className="form-control"
					value={ curMonth }
					onChange={ ( e ) => setCurMonth( parseInt( e.target.value ) ) }
				>
					{ months.map( ( monthLabel, index ) => (
						<option key={ index + 1 } value={ index + 1 }>
							{ monthLabel }
						</option>
					) ) }
				</select>
			</div>
			<div className="form-group col">
				<button
					type="button"
					className="btn btn-secondary ripple"
					onClick={ handleUpdateYearMonth }
				>
					{ updateLabel }
				</button>
			</div>
		</div>
	);
};

// Export component
export default MonthSelector;
