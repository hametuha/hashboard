/*!
 * Kitchen Sink - Components Tab
 */

const { createRoot, useState, useCallback } = wp.element;
const {
	Button, SelectControl, ButtonGroup, ToggleControl, Modal, RangeControl, RadioControl,
	Notice, ProgressBar, Snackbar, Spinner
} = wp.components;

// Button Component
const ButtonTest = () => {
	const [ disabled, setDisabled ] = useState( false );
	return (
		<>
			<Button isPrimary disabled={ disabled } onClick={ () => setDisabled( ! disabled ) }>
				ボタン
			</Button>
			<Button isSecondary disabled={ disabled } onClick={ () => setDisabled( ! disabled ) }>
				ボタン
			</Button>
		</>
	);
};

// Select Component
const SelectTest = () => {
	const [ selectedOption, setSelectedOption ] = useState( '' );

	return (
		<>
			<SelectControl
				label="Select an option"
				value={ selectedOption }
				options={ [
					{ label: 'Option 1', value: 'option1' },
					{ label: 'Option 2', value: 'option2' },
					{ label: 'Option 3', value: 'option3' },
				] }
				onChange={ setSelectedOption }
			/>
			<p>Selected: { selectedOption }</p>
		</>
	);
};

// ButtonGroup Component
const ButtonGroupTest = () => {
	const [ selectedButton, setSelectedButton ] = useState( 'left' );

	return (
		<>
			<ButtonGroup>
				<Button
					isPrimary={ selectedButton === 'left' }
					onClick={ () => setSelectedButton( 'left' ) }
				>
					Left
				</Button>
				<Button
					isPrimary={ selectedButton === 'center' }
					onClick={ () => setSelectedButton( 'center' ) }
				>
					Center
				</Button>
				<Button
					isPrimary={ selectedButton === 'right' }
					onClick={ () => setSelectedButton( 'right' ) }
				>
					Right
				</Button>
			</ButtonGroup>
			<p>Selected: { selectedButton }</p>
		</>
	);
};

// Toggle Component
const ToggleTest = () => {
	const [ toggle, setToggle ] = useState( false );

	return (
		<>
			<ToggleControl
				label="Toggle setting"
				help={ toggle ? 'Enabled' : 'Disabled' }
				checked={ toggle }
				onChange={ setToggle }
			/>
			<p>Toggle is: { toggle ? 'On' : 'Off' }</p>
		</>
	);
};

// Modal Component
const ModalTest = () => {
	const [ isOpen, setIsOpen ] = useState( false );

	return (
		<>
			<Button isPrimary onClick={ () => setIsOpen( true ) }>
				Open Modal
			</Button>
			{ isOpen && (
				<Modal
					title="Test Modal"
					onRequestClose={ () => setIsOpen( false ) }
				>
					<p>This is a test modal content.</p>
					<Button isPrimary onClick={ () => setIsOpen( false ) }>
						Close
					</Button>
				</Modal>
			) }
		</>
	);
};

// Range Component
const RangeTest = () => {
	const [ range, setRange ] = useState( 50 );

	return (
		<>
			<RangeControl
				label="Range Control"
				value={ range }
				onChange={ setRange }
				min={ 0 }
				max={ 100 }
			/>
			<p>Value: { range }</p>
		</>
	);
};

// Radio Component
const RadioTest = () => {
	const [ selected, setSelected ] = useState( 'option1' );

	return (
		<>
			<RadioControl
				label="Select an option"
				selected={ selected }
				options={ [
					{ label: 'Option 1', value: 'option1' },
					{ label: 'Option 2', value: 'option2' },
					{ label: 'Option 3', value: 'option3' },
				] }
				onChange={ setSelected }
			/>
			<p>Selected: { selected }</p>
		</>
	);
};

// Notice Component
const NoticeTest = () => {
	const [ showNotice, setShowNotice ] = useState( true );

	return (
		<>
			<Button isSecondary onClick={ () => setShowNotice( ! showNotice ) }>
				Toggle Notice
			</Button>
			{ showNotice && (
				<Notice status="success" onRemove={ () => setShowNotice( false ) }>
					This is a success notice!
				</Notice>
			) }
		</>
	);
};

// Progress Component
const ProgressTest = () => {
	const [ progress, setProgress ] = useState( 50 );

	return (
		<>
			<Button isSecondary onClick={ () => setProgress( Math.random() * 100 ) }>
				Update Progress
			</Button>
			<ProgressBar value={ progress } />
			<p>Progress: { Math.round( progress ) }%</p>
		</>
	);
};

// Snackbar Component
const SnackbarTest = () => {
	const [ showSnackbar, setShowSnackbar ] = useState( false );

	return (
		<>
			<Button isPrimary onClick={ () => setShowSnackbar( true ) }>
				Show Snackbar
			</Button>
			{ showSnackbar && (
				<Snackbar onRemove={ () => setShowSnackbar( false ) }>
					This is a snackbar message!
				</Snackbar>
			) }
		</>
	);
};

// Spinner Component
const SpinnerTest = () => {
	return (
		<>
			<Spinner />
			<p>Loading spinner example</p>
		</>
	);
};

// DateRange Component Test
const DateRangeTest = () => {
	const { DateRange } = hb.components;
	const [ period, setPeriod ] = useState( null );

	const handlePeriodChange = useCallback( ( start, end ) => {
		setPeriod( { start, end } );
	}, [] );

	if ( ! DateRange ) {
		return <p>DateRange component not available</p>;
	}

	return (
		<>
			<div id="react-datepicker-test">
				<DateRange
					onPeriodChanged={ handlePeriodChange }
				/>
			</div>
			{ period && (
				<p>
					Selected period: { period.start?.toLocaleDateString() } - { period.end?.toLocaleDateString() }
				</p>
			) }
		</>
	);
};

// Mount components
const componentsContainer = document.getElementById( 'components-container' );
if ( componentsContainer ) {
	createRoot( componentsContainer ).render(
		<>
			<div className="component-section">
				<h3>日付選択コンポーネント</h3>
				<DateRangeTest />
			</div>

			<div className="component-section">
				<h3>Button Component</h3>
				<ButtonTest />
			</div>

			<div className="component-section">
				<h3>Select Component</h3>
				<SelectTest />
			</div>

			<div className="component-section">
				<h3>Button Group Component</h3>
				<ButtonGroupTest />
			</div>

			<div className="component-section">
				<h3>Toggle Component</h3>
				<ToggleTest />
			</div>

			<div className="component-section">
				<h3>Modal Component</h3>
				<ModalTest />
			</div>

			<div className="component-section">
				<h3>Range Component</h3>
				<RangeTest />
			</div>

			<div className="component-section">
				<h3>Radio Component</h3>
				<RadioTest />
			</div>

			<div className="component-section">
				<h3>Notice Component</h3>
				<NoticeTest />
			</div>

			<div className="component-section">
				<h3>Progress Component</h3>
				<ProgressTest />
			</div>

			<div className="component-section">
				<h3>Snackbar Component</h3>
				<SnackbarTest />
			</div>

			<div className="component-section">
				<h3>Spinner Component</h3>
				<SpinnerTest />
			</div>
		</>
	);
}