/*!
 * Date range picker
 *
 */

import { useState, useEffect } from '@wordpress/element';
import { DatePicker, Button, Dropdown } from '@wordpress/components';

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

	// 日付フォーマット関数
	const formatDate = ( date ) => {
		if ( ! date ) return '';
		return date.toLocaleDateString( 'ja-JP', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		} );
	};

	// 開始日変更ハンドラー
	const handleStartDateChange = ( newDate ) => {
		if ( newDate ) {
			setStartDate( newDate );
		}
	};

	// 終了日変更ハンドラー
	const handleEndDateChange = ( newDate ) => {
		if ( newDate ) {
			setEndDate( newDate );
		}
	};

	const statusLabel = getStatusLabel( status );
	const statusClass = getStatusClass( status );

	return (
		<div className="hb-date-range row">
			<div className="col-1 text-right">
				<i className={ statusClass }>{ statusLabel }</i>
			</div>
			<div className="col-5 hb-date-range-start">
				<Dropdown
					position="bottom center"
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Button
							variant="secondary"
							onClick={ onToggle }
							aria-expanded={ isOpen }
							className="w-100"
						>
							{ formatDate( startDate ) || '開始日を選択' }
						</Button>
					) }
					renderContent={ ( { onClose } ) => (
						<div style={ { padding: '16px', minWidth: '280px' } }>
							<DatePicker
								currentDate={ startDate }
								onChange={ ( newDate ) => {
									handleStartDateChange( newDate );
									onClose();
								} }
							/>
						</div>
					) }
				/>
			</div>
			<div className="col-1 text-center">
				<span className="hb-date-range-separator">{ separator }</span>
			</div>
			<div className="col-5 hb-date-range-end">
				<Dropdown
					position="bottom center"
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Button
							variant="secondary"
							onClick={ onToggle }
							aria-expanded={ isOpen }
							className="w-100"
						>
							{ formatDate( endDate ) || '終了日を選択' }
						</Button>
					) }
					renderContent={ ( { onClose } ) => (
						<div style={ { padding: '16px', minWidth: '280px' } }>
							<DatePicker
								currentDate={ endDate }
								onChange={ ( newDate ) => {
									handleEndDateChange( newDate );
									onClose();
								} }
							/>
						</div>
					) }
				/>
			</div>
		</div>
	);
};

// Export component
export default DateRange;
