/*!
 * Test script for the Kitchen Sink.
 */

/* global hb:false */

import debugHelper from './debug-helper.js';

const { createRoot, useState, useEffect, createElement } = wp.element;
const {
	Button, SelectControl, ButtonGroup, ToggleControl, Modal, RangeControl, RadioControl,
	Notice, ProgressBar, Snackbar, Spinner
} = wp.components;
const LoadingIndicator = hb.components.loading;
const DateRange = hb.components.dateRange;
const Pagination = hb.components.pagination;
const BarChart = hb.components.barChart;
const LineChart = hb.components.lineChart;
const ListTable = hb.components.listTable;
const PostList = hb.components.postList;
const { toast } = hb.plugins;

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
				<h3>Selected Date: { startDate.toLocaleDateString() } - { endDate.toLocaleDateString() }</h3>
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
								url: 'https://wordpress.org',
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

// Toast
const toastBtn = document.getElementById( 'toast-opener' );
if ( toastBtn ) {
	toastBtn.addEventListener( 'click', ( event ) => {
		event.preventDefault();
		toast( 'これは3秒で消えるToastのメッセージです', { duration: 30000 } );
		toast( 'これはアイコン付きのメッセージです', { icon: 'error', type: 'error' } );
		toast( { message: '成功しました！', type: 'success' } );
		toast( { message: '警告メッセージ', type: 'warning', duration: 50000 } );
	} );
}

// Charts Test
const initCharts = () => {
	// Bar Chart Test
	const barChartContainer = document.getElementById( 'bar-chart-test' );
	if ( barChartContainer ) {
		const chartData = {
			labels: [ '1月', '2月', '3月', '4月', '5月', '6月' ],
			datasets: [ {
				label: '売上（万円）',
				data: [ 120, 190, 300, 500, 200, 300 ],
				backgroundColor: 'rgba(54, 162, 235, 0.5)',
				borderColor: 'rgba(54, 162, 235, 1)',
				borderWidth: 1,
			} ],
		};
		
		const chartOptions = {
			responsive: true,
			maintainAspectRatio: false,
		};
		
		// Reactコンポーネントとしてレンダリング
		const chartElement = createElement( BarChart, {
			chartData: chartData,
			options: chartOptions,
			width: barChartContainer.offsetWidth,
			height: 400,
		} );
		
		createRoot( barChartContainer ).render( chartElement );
	}

	// Line Chart Test
	const lineChartContainer = document.getElementById( 'line-chart-test' );
	if ( lineChartContainer ) {
		const chartData = {
			labels: [ '月', '火', '水', '木', '金', '土', '日' ],
			datasets: [ {
				label: '訪問者数',
				data: [ 65, 59, 80, 81, 56, 55, 40 ],
				fill: false,
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1,
			} ],
		};
		
		const chartOptions = {
			responsive: true,
			maintainAspectRatio: false,
		};
		
		const chartElement = createElement( LineChart, {
			chartData: chartData,
			options: chartOptions,
			width: lineChartContainer.offsetWidth,
			height: 400,
		} );
		
		createRoot( lineChartContainer ).render( chartElement );
	}

	// Multiple Bar Chart
	const barMultipleContainer = document.getElementById( 'bar-chart-multiple' );
	if ( barMultipleContainer ) {
		BarChart( {
			labels: [ 'Q1', 'Q2', 'Q3', 'Q4' ],
			datasets: [
				{
					label: '売上',
					data: [ 300, 450, 320, 520 ],
					backgroundColor: 'rgba(255, 99, 132, 0.5)',
				},
				{
					label: '利益',
					data: [ 120, 190, 150, 250 ],
					backgroundColor: 'rgba(54, 162, 235, 0.5)',
				},
			],
			options: {
				responsive: true,
				maintainAspectRatio: false,
			},
			container: barMultipleContainer,
		} );
	}

	// Multiple Line Chart
	const lineMultipleContainer = document.getElementById( 'line-chart-multiple' );
	if ( lineMultipleContainer ) {
		LineChart( {
			labels: [ '1月', '2月', '3月', '4月', '5月' ],
			datasets: [
				{
					label: 'PC',
					data: [ 100, 120, 115, 134, 168 ],
					borderColor: 'rgb(255, 99, 132)',
				},
				{
					label: 'モバイル',
					data: [ 200, 220, 280, 300, 340 ],
					borderColor: 'rgb(54, 162, 235)',
				},
			],
			options: {
				responsive: true,
				maintainAspectRatio: false,
			},
			container: lineMultipleContainer,
		} );
	}
};

// Tables Test
const initTables = () => {
	// Basic List Table
	const listTableContainer = document.getElementById( 'list-table-test' );
	if ( listTableContainer ) {
		const sampleData = [
			{ id: 1, title: { rendered: '最初の投稿' }, status: '公開', date: '2024-01-01' },
			{ id: 2, title: { rendered: 'テスト投稿' }, status: '下書き', date: '2024-01-02' },
			{ id: 3, title: { rendered: 'サンプル記事' }, status: '公開', date: '2024-01-03' },
			{ id: 4, title: { rendered: 'お知らせ' }, status: 'レビュー待ち', date: '2024-01-04' },
			{ id: 5, title: { rendered: '新機能の紹介' }, status: '公開', date: '2024-01-05' },
		];

		ListTable( {
			items: sampleData,
			curPage: 1,
			totalPage: 3,
			onPageChanged: ( page ) => console.log( 'Page changed to:', page ),
			container: listTableContainer,
		} );
	}

	// Post List Test
	const postListContainer = document.getElementById( 'post-list-test' );
	if ( postListContainer ) {
		const posts = [
			{
				id: 1,
				title: { rendered: 'WordPressの新機能について' },
				excerpt: { rendered: 'WordPress 6.4がリリースされました。新しい機能について詳しく解説します。' },
				link: '#',
				date: '2024-01-15T10:00:00',
			},
			{
				id: 2,
				title: { rendered: 'Reactコンポーネントの作り方' },
				excerpt: { rendered: '再利用可能なReactコンポーネントを作成する方法を解説します。' },
				link: '#',
				date: '2024-01-14T15:30:00',
			},
		];

		PostList( {
			items: posts,
			curPage: 1,
			totalPage: 2,
			onPageChanged: ( page ) => console.log( 'Post page:', page ),
			container: postListContainer,
		} );
	}

	// Custom Table Test
	const customTableContainer = document.getElementById( 'custom-table-test' );
	if ( customTableContainer ) {
		const users = [
			{ id: 1, name: '山田太郎', email: 'yamada@example.com', role: '管理者' },
			{ id: 2, name: '鈴木花子', email: 'suzuki@example.com', role: '編集者' },
			{ id: 3, name: '佐藤次郎', email: 'sato@example.com', role: '投稿者' },
		];

		// カスタムレンダリング関数
		const renderUser = ( user ) => {
			const div = document.createElement( 'div' );
			div.className = 'd-flex align-items-center justify-content-between';
			div.innerHTML = `
				<div>
					<strong>${ user.name }</strong><br>
					<small class="text-muted">${ user.email }</small>
				</div>
				<span class="badge bg-secondary">${ user.role }</span>
			`;
			return div;
		};

		ListTable( {
			items: users,
			renderItem: renderUser,
			listClass: 'list-item p-3',
			container: customTableContainer,
		} );
	}

	// Loading State Test
	const loadingTableContainer = document.getElementById( 'loading-table-test' );
	if ( loadingTableContainer ) {
		let loadingState = false;
		const toggleBtn = document.getElementById( 'toggle-loading' );

		const renderTable = () => {
			ListTable( {
				items: loadingState ? [] : [ { id: 1, title: { rendered: 'Sample' } } ],
				loading: loadingState,
				container: loadingTableContainer,
			} );
		};

		renderTable();
		toggleBtn.addEventListener( 'click', () => {
			loadingState = ! loadingState;
			renderTable();
		} );
	}

	// Empty State Test
	const emptyTableContainer = document.getElementById( 'empty-table-test' );
	if ( emptyTableContainer ) {
		let showEmpty = true;
		const toggleBtn = document.getElementById( 'toggle-empty' );

		const renderTable = () => {
			ListTable( {
				items: showEmpty ? [] : [ { id: 1, title: { rendered: 'データあり' } } ],
				container: emptyTableContainer,
			} );
		};

		renderTable();
		toggleBtn.addEventListener( 'click', () => {
			showEmpty = ! showEmpty;
			renderTable();
		} );
	}
};

// Initialize on page load
document.addEventListener( 'DOMContentLoaded', () => {
	initCharts();
	initTables();
} );
