/*!
 * Test script for the Kitchen Sink.
 */

/* global hb:false */

const { createRoot, useState, useEffect } = wp.element;
const {
	Button, SelectControl, ButtonGroup, ToggleControl, Modal, RangeControl, RadioControl,
	Notice, ProgressBar, Snackbar, Spinner
} = wp.components;
const LoadingIndicator = hb.components.loading;
const DateRange = hb.components.dateRange;
const Pagination = hb.components.pagination;

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
const buttonContainer = document.getElementById( 'react-button-test' );
if ( buttonContainer ) {
	createRoot( buttonContainer ).render( <ButtonTest /> );
}

// Button Component
const PaginationTest = () => {
	const [ curPage, setCurPage ] = useState( 1 );
	return (
		<Pagination total={ 10 } current={ curPage } onPageChanged={ ( number ) => setCurPage( number ) }>
		</Pagination>
	);
};
const paginationContainer = document.getElementById( 'react-pagination-test' );
if ( paginationContainer ) {
	createRoot( paginationContainer ).render( <PaginationTest /> );
}

// Inputs
const inputOptions = [ 1, 2, 3 ].map( ( number ) => {
	return {
		label: '選択肢' + number,
		value: number.toString(),
	};
} );
const InputTest = () => {
	const [ selectValue, setSelectValue ] = useState( '1' );
	const [ toggleValue, setToggleValue ] = useState( false );
	const [ modalValue, setModalValue ] = useState( false );
	const [ rangeValue, setRangeValue ] = useState( 50 );
	return (
		<>
			<div className="mb-3">
				<SelectControl label="セレクトコントロール" value={ selectValue } options={ inputOptions } onChange={ ( value ) => setSelectValue( value ) } />
				<RadioControl
					label="ラジオコントロール"
					onChange={ setSelectValue }
					options={ inputOptions }
					selected={ selectValue } />
			</div>
			<div className="mb-3">
				<ButtonGroup>
					<Button isSecondary>50%</Button>
					<Button isPrimary>100%</Button>
				</ButtonGroup>
			</div>
			<div className="mb-3">
				<ToggleControl label="トグルコントロール" checked={ toggleValue } onChange={ ( value ) => setToggleValue( value ) } />
			</div>
			<div className="mb-3" style={ { opacity: rangeValue / 100 }}>
				<RangeControl
					help="透明度を変更するオプション"
					label="透明度"
					max={ 100 }
					min={ 0 }
					value={ rangeValue }
					onChange={ setRangeValue }
				/>
			</div>
			<div className="mb-3">
				<Button isSecondary onClick={ () => setModalValue( true ) }>
					モーダルを開く
				</Button>
				{ modalValue && (
					<Modal title="モーダルのタイトル" onRequestClose={ () => setModalValue( false ) }>
						<Button isPrimary onClick={ () => setModalValue( false ) }>
							モーダルを閉じる
						</Button>
					</Modal>
				) }
			</div>
		</>
	);
};
const inputContainer = document.getElementById( 'react-input-test' );
if ( inputContainer ) {
	createRoot( inputContainer ).render( <InputTest /> );
}

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
				<h2 className="pt-5">ローディングでブロックされるもの</h2>
				<p>
					ここに入る要素はローディング中にブロックされます。
				</p>
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

// Feedback controls.
const FeedbackTest = () => {
	const [ progress, setProgress ] = useState( 0 );
	const [ isRunning, setIsRunning ] = useState( false );
	const [ snackbar, setSnackbar ] = useState( false );

	useEffect( () => {
		// isRunningがfalseまたはprogressが100以上なら何もしない
		if ( ! isRunning || progress >= 100 ) {
			return;
		}

		// 100msごとに1増やす
		const intervalId = setInterval( () => {
			setProgress( ( prevProgress ) => {
				// 100に達したら停止
				if ( prevProgress >= 100 ) {
					setIsRunning( false );
					return 100;
				}
				return prevProgress + 1;
			} );
		}, 100 );

		// クリーンアップ関数でintervalをクリア
		return () => clearInterval( intervalId );
	}, [ isRunning, progress ] );

	const handleStart = () => {
		setProgress( 0 );
		setIsRunning( true );
	};

	const handleStop = () => {
		setIsRunning( false );
	};

	const handleReset = () => {
		setProgress( 0 );
		setIsRunning( false );
	};

	return (
		<>
			<div className="mb-3">
				<Notice status="error">An unknown error occurred.</Notice>
			</div>
			<div className="mb-3">
				<Notice status="warning" isDismissible={ false }>
					Warning: This is a warning message.
				</Notice>
			</div>
			<div className="mb-3">
				<Notice status="success" isDismissible={ false }>
					Success! Operation completed successfully.
				</Notice>
			</div>
			<div className="mb-3">
				<Notice status="info" isDismissible={ false }>
					Info: This is an informational message.
				</Notice>
			</div>
			<div className="mb-3">
				<h4>プログレスバー: { progress }%</h4>
				<ProgressBar value={ progress } />
				<div className="mt-2">
					<Button isPrimary onClick={ handleStart } disabled={ isRunning } className="me-2">
						開始
					</Button>
					<Button isSecondary onClick={ handleStop } disabled={ ! isRunning } className="me-2">
						停止
					</Button>
					<Button isTertiary onClick={ handleReset } className="me-2">
						リセット
					</Button>
				</div>
			</div>

			<div className="mb-3">
				<Button isPrimary onClick={ () => setSnackbar( true ) }>
					スナックバーを開く
				</Button>
				{ snackbar && (
					<Snackbar
						actions={ [
							{
								label: 'Open WP.org',
								url: 'https://wordpress.org'
							},
						] }
						onDismiss={ () => setSnackbar( false ) }
						onRemove={ () => setSnackbar( false ) }
					>
						このナックバーではアクションが表示されます。
					</Snackbar>
				) }
			</div>

			<div className="mb-3">
				<Spinner
					style={ {
						height: 'calc(4px * 20)',
						width: 'calc(4px * 20)',
					} }
				/>
			</div>
		</>
	);
};
const feedbackContainer = document.getElementById( 'react-feedback-test' );
if ( feedbackContainer ) {
	createRoot( feedbackContainer ).render( <FeedbackTest /> );
}
