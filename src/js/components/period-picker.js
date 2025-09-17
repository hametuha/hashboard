/*!
 * Period Picker component for React
 *
 * @deps @wordpress/element, @wordpress/i18n
 */

import { useState, useEffect, useMemo, useCallback, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Period Picker Component
 * @param {Object} props - Component props
 */
export const PeriodPicker = ( props ) => {
	const {
		defaultMode = '7',
		allowCustom = true,
		onDateStart,
		onDateChanged,
		customLabel = __( 'Custom', 'hashboard' ),
		buttons = [
			{ value: '7', label: __( 'Last 7 days', 'hashboard' ) },
			{ value: '30', label: __( 'Last 30 days', 'hashboard' ) },
			{ value: '90', label: __( 'Last 90 days', 'hashboard' ) },
			{ value: 'qtr', label: __( 'Current Quarter', 'hashboard' ) },
		],
	} = props;

	const [ mode, setMode ] = useState( defaultMode );
	const [ customizing, setCustomizing ] = useState( false );
	const [ componentId ] = useState( () => Math.random().toString( 36 ).substr( 2, 9 ) );
	const initializedRef = useRef( false );

	// Get DateRange component from global registry
	const DateRange = window.hb?.components?.dateRange;

	// Calculate date range based on mode
	const calculate = useCallback( ( days ) => {
		let start;
		const now = new Date();

		switch ( days ) {
			case 'qtr':
				const month = Math.floor( now.getMonth() / 3 ) * 3;
				start = new Date( now.getFullYear(), month, 1 );
				break;
			default:
				const daysNum = parseInt( days, 10 );
				start = new Date();
				start.setDate( start.getDate() - daysNum );
				break;
		}

		return [ start, now ];
	}, [] );

	// Notify parent of date change
	const notify = useCallback( () => {
		const dateRange = calculate( mode );
		if ( onDateStart ) {
			onDateStart( dateRange[ 0 ], dateRange[ 1 ] );
		}
	}, [ mode, calculate, onDateStart ] );

	// Handle date picker changes (for custom mode)
	const datePickerHandler = useCallback( ( start, end ) => {
		if ( onDateChanged ) {
			onDateChanged( start, end );
		}
	}, [ onDateChanged ] );

	// Handle mode change
	const handleModeChange = useCallback( ( event ) => {
		const newMode = event.target.value;
		setMode( newMode );

		if ( newMode === 'custom' ) {
			setCustomizing( true );
		} else {
			setCustomizing( false );
			// Calculate and notify for predefined periods
			const dateRange = calculate( newMode );
			if ( onDateStart ) {
				onDateStart( dateRange[ 0 ], dateRange[ 1 ] );
			}
		}
	}, [ calculate, onDateStart ] );

	// Style for custom date range
	const dateRangeStyle = useMemo( () => ( {
		opacity: customizing && allowCustom ? 1 : 0,
		transition: 'opacity 0.3s ease',
	} ), [ customizing, allowCustom ] );

	// Initialize on mount
	useEffect( () => {
		if ( ! initializedRef.current ) {
			initializedRef.current = true;
			const dateRange = calculate( mode );
			if ( onDateStart ) {
				onDateStart( dateRange[ 0 ], dateRange[ 1 ] );
			}
		}
	}, [ calculate, mode, onDateStart ] );

	return (
		<div className="hb-period">
			{ buttons.map( ( button, index ) => (
				<span key={ button.value } className="hb-radio hb-radio-sm">
					<input
						type="radio"
						id={ `hb-date-range-${ componentId }-${ index }` }
						name={ `hb-date-range-${ componentId }` }
						value={ button.value }
						checked={ mode === button.value }
						onChange={ handleModeChange }
					/>
					<label
						className="hb-radio-label"
						htmlFor={ `hb-date-range-${ componentId }-${ index }` }
					>
						<i className="material-icons">check</i>
						{ ' ' }
						{ button.label }
					</label>
				</span>
			) ) }

			{ allowCustom && (
				<span className="hb-radio hb-radio-sm">
					<input
						type="radio"
						id={ `hb-date-range-${ componentId }-custom` }
						name={ `hb-date-range-${ componentId }` }
						value="custom"
						checked={ mode === 'custom' }
						onChange={ handleModeChange }
					/>
					<label
						className="hb-radio-label"
						htmlFor={ `hb-date-range-${ componentId }-custom` }
					>
						<i className="material-icons">check</i>
						{ ' ' }
						{ customLabel }
					</label>
				</span>
			) }

			<div className="hb-period-dates" style={ dateRangeStyle }>
				{ DateRange ? (
					<DateRange onDateChanged={ datePickerHandler } />
				) : (
					<p className="text-muted">DateRange component not available</p>
				) }
			</div>
		</div>
	);
};

