/*!
 * Date range picker
 *
 */

import { useState, useEffect } from '@wordpress/element';
import { DatePicker } from '@wordpress/components';

/**
 * Date Range Component
 * @param {Object} props - Component props
 */
const DateRange = ( props ) => {
	const {
		status: initialStatus = 'default',
		separator = '〜',
		start: initialStart = new Date(),
		end: initialEnd = new Date(),
		onPeriodChanged,
	} = props;

	const [ startDate, setStartDate ] = useState( initialStart );
	const [ endDate, setEndDate ] = useState( initialEnd );
	const [ status, setStatus ] = useState( initialStatus );

	// 日付の妥当性をチェック
	useEffect( () => {
		if ( startDate && endDate ) {
			if ( startDate <= endDate ) {
				setStatus( 'success' );
				if ( onPeriodChanged ) {
					onPeriodChanged( startDate, endDate );
				}
			} else {
				setStatus( 'error' );
			}
		} else {
			setStatus( 'default' );
		}
	}, [ startDate, endDate, onPeriodChanged ] );

	// ステータスラベルを取得
	const getStatusLabel = ( currentStatus ) => {
		const labels = {
			error: 'error',
			success: 'done_all',
			default: 'error_outline',
		};
		return labels[ currentStatus ] || labels.default;
	};

	// ステータスクラスを取得
	const getStatusClass = ( currentStatus ) => {
		const baseClasses = [ 'material-icons' ];
		switch ( currentStatus ) {
			case 'error':
				baseClasses.push( 'text-danger' );
				break;
			case 'success':
				baseClasses.push( 'text-success' );
				break;
			default:
				baseClasses.push( 'text-muted' );
				break;
		}
		return baseClasses.join( ' ' );
	};

	// 開始日変更ハンドラー
	const handleStartDateChange = ( newDate ) => {
		setStartDate( newDate );
	};

	// 終了日変更ハンドラー
	const handleEndDateChange = ( newDate ) => {
		setEndDate( newDate );
	};

	const statusLabel = getStatusLabel( status );
	const statusClass = getStatusClass( status );

	return (
		<div className="hb-date-range row">
			<div className="col-1 text-right">
				<i className={ statusClass }>{ statusLabel }</i>
			</div>
			<div className="col-5 hb-date-range-start">
				<DatePicker
					dateOrder="ymd"
					currentDate={ startDate }
					onChange={ handleStartDateChange }
				/>
			</div>
			<div className="col-1 text-center">
				<span className="hb-date-range-separator">{ separator }</span>
			</div>
			<div className="col-5 hb-date-range-end">
				<DatePicker
					dateOrder="ymd"
					currentDate={ endDate }
					onChange={ handleEndDateChange }
				/>
			</div>
		</div>
	);
};

// Export component
export default DateRange;
