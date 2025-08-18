/*!
 * Date range picker using WordPress DatePicker components
 *
 */

import { useState, useEffect } from '@wordpress/element';
import { DatePicker, Button, Popover, Flex, FlexItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Date Range Component using WordPress native DatePicker
 *
 * @param {Object} props - Component props
 * @param {Date} props.start - Initial start date
 * @param {Date} props.end - Initial end date
 * @param {Function} props.onPeriodChanged - Callback when period changes
 * @param {string} props.separator - Date separator text
 */
const DateRange = ( props ) => {
	const {
		separator = '〜',
		start: initialStart = new Date(),
		end: initialEnd = new Date(),
		onPeriodChanged,
	} = props;

	const [ startDate, setStartDate ] = useState( initialStart );
	const [ endDate, setEndDate ] = useState( initialEnd );
	const [ isOpen, setIsOpen ] = useState( false );
	const [ anchor, setAnchor ] = useState( null );

	// 日付変更時のコールバック
	useEffect( () => {
		if ( onPeriodChanged && startDate && endDate ) {
			onPeriodChanged( startDate, endDate );
		}
	}, [ startDate, endDate, onPeriodChanged ] );

	// 文字列またはDateオブジェクトをDateオブジェクトに変換
	const parseDate = ( dateValue ) => {
		if ( ! dateValue ) return null;
		if ( dateValue instanceof Date ) return dateValue;
		if ( typeof dateValue === 'string' ) return new Date( dateValue );
		return null;
	};

	// 日付フォーマット関数
	const formatDate = ( date ) => {
		const parsedDate = parseDate( date );
		if ( ! parsedDate ) return '';
		return parsedDate.toLocaleDateString( 'ja-JP', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		} );
	};

	// 開始日変更ハンドラー
	const handleStartDateChange = ( newDate ) => {
		const parsedDate = parseDate( newDate );
		if ( parsedDate ) {
			setStartDate( parsedDate );
			// 開始日が終了日より後の場合、終了日を開始日に合わせる
			if ( endDate && parsedDate > endDate ) {
				setEndDate( parsedDate );
			}
		}
	};

	// 終了日変更ハンドラー
	const handleEndDateChange = ( newDate ) => {
		const parsedDate = parseDate( newDate );
		if ( parsedDate ) {
			setEndDate( parsedDate );
			// 終了日が開始日より前の場合、開始日を終了日に合わせる
			if ( startDate && parsedDate < startDate ) {
				setStartDate( parsedDate );
			}
		}
	};

	const handleToggle = ( event ) => {
		setAnchor( event.currentTarget );
		setIsOpen( ! isOpen );
	};

	const handleClose = () => {
		setIsOpen( false );
		setAnchor( null );
	};

	const isValidRange = startDate && endDate && startDate <= endDate;

	return (
		<div className="hb-date-range">
			<Button
				variant={ isValidRange ? 'secondary' : 'tertiary' }
				onClick={ handleToggle }
				aria-expanded={ isOpen }
				className="hb-date-range-trigger"
			>
				{ formatDate( startDate ) } { separator } { formatDate( endDate ) }
			</Button>

			{ isOpen && (
				<Popover
					anchor={ anchor }
					onClose={ handleClose }
					position="bottom center"
					className="hb-date-range-popover"
					// スマホ対応: viewport内に収める
					shift
					flip
				>
					<div style={ { 
						padding: '12px', 
						width: 'min(320px, calc(100vw - 32px))',
						maxWidth: '320px'
					} }>
						<Flex 
							direction="column" 
							gap={ 3 }
							style={ { width: '100%' } }
						>
							<FlexItem>
								<h4 style={ { 
									margin: '0 0 8px 0', 
									fontSize: '14px',
									fontWeight: '600'
								} }>
									{ __( 'Start Date', 'hashboard' ) }
								</h4>
								<div style={ { width: '100%' } }>
									<DatePicker
										currentDate={ startDate }
										onChange={ handleStartDateChange }
									/>
								</div>
							</FlexItem>
							<FlexItem>
								<h4 style={ { 
									margin: '12px 0 8px 0', 
									fontSize: '14px',
									fontWeight: '600'
								} }>
									{ __( 'End Date', 'hashboard' ) }
								</h4>
								<div style={ { width: '100%' } }>
									<DatePicker
										currentDate={ endDate }
										onChange={ handleEndDateChange }
									/>
								</div>
							</FlexItem>
							<FlexItem>
								<div style={ { 
									marginTop: '12px', 
									textAlign: 'right',
									borderTop: '1px solid #e0e0e0',
									paddingTop: '12px'
								} }>
									<Button
										variant="primary"
										onClick={ handleClose }
										size="small"
										disabled={ ! isValidRange }
									>
										{ __( 'Apply', 'hashboard' ) }
									</Button>
								</div>
							</FlexItem>
						</Flex>
					</div>
				</Popover>
			) }
		</div>
	);
};

export default DateRange;
