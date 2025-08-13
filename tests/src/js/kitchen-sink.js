/*!
 * Test script for the Kitchen Sink.
 */

/* global hb:false */

const { createRoot, useState } = wp.element;
const { Button } = wp.components;
const LoadingIndicator = hb.components.loading;
const DateRange = hb.components.dateRange;

// Datepicker
const DatepickerTest = () => {
	const [ startDate, setStartDate ] = useState( new Date() );
	const [ endDate, setEndDate ] = useState( new Date() );
	return (
		<div className="datepicker-example">
			<div className="datepicker-example-container">
				<h3>Selected Date: { startDate.toString() } - { endDate.toString() }</h3>
				<DateRange start={ startDate } end={ endDate } onPeriodChanged={ ( start, end ) => {
					setStartDate( start );
					setEndDate( end );
				} } />
			</div>
		</div>
	);
};
const datepickerContainer = document.getElementById( 'react-datepicker-test' );
if ( datepickerContainer ) {
	const root = createRoot( datepickerContainer );
	root.render( <DatepickerTest /> );
}

// Loading Indicator.
const LoadingIndicatorTest = () => {
	const [ loading, setLoading ] = useState( false );
	return (
		<div className="loading-indicator-example">
			<Button isSecondary onClick={ () => setLoading( ! loading ) }>
				Toggle Loading Indicator
			</Button>
			<div className="loading-indicator-exmplle-container">
				<LoadingIndicator loading={ loading } />
			</div>
		</div>
	);
};
const loadingContainer = document.getElementById( 'react-loading-test' );
if ( loadingContainer ) {
	const root = createRoot( loadingContainer );
	root.render( <LoadingIndicatorTest /> );
}
