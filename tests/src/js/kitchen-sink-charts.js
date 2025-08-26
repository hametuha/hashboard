/*!
 * Kitchen Sink - Charts Tab
 */

const { createRoot, useState, useEffect } = wp.element;
const { Button, SelectControl, RangeControl } = wp.components;

// Chart components from hb namespace (available at runtime)
let BarChart, LineChart;

// Initialize components when available
const initChartComponents = () => {
	if ( window.hb?.components?.barChart ) {
		BarChart = window.hb.components.barChart;
	}
	if ( window.hb?.components?.lineChart ) {
		LineChart = window.hb.components.lineChart;
	}
};

// Sample chart data
const sampleChartData = {
	labels: ['January', 'February', 'March', 'April', 'May', 'June'],
	datasets: [
		{
			label: 'Sales',
			data: [12, 19, 3, 5, 2, 3],
			backgroundColor: 'rgba(54, 162, 235, 0.2)',
			borderColor: 'rgba(54, 162, 235, 1)',
			borderWidth: 1,
		},
	],
};

const lineChartData = {
	labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
	datasets: [
		{
			label: 'Revenue',
			data: [65, 59, 80, 81, 56, 55],
			fill: false,
			borderColor: 'rgb(75, 192, 192)',
			tension: 0.1,
		},
	],
};

// Bar Chart Test Component
const BarChartTest = () => {
	const [ chartType, setChartType ] = useState( 'bar' );
	const [ datasetCount, setDatasetCount ] = useState( 1 );

	const generateData = () => {
		const datasets = [];
		const colors = [
			'rgba(54, 162, 235, 0.8)',
			'rgba(255, 99, 132, 0.8)',
			'rgba(255, 205, 86, 0.8)',
			'rgba(75, 192, 192, 0.8)',
		];

		for ( let i = 0; i < datasetCount; i++ ) {
			datasets.push( {
				label: `Dataset ${ i + 1 }`,
				data: Array.from( { length: 6 }, () => Math.floor( Math.random() * 100 ) ),
				backgroundColor: colors[ i % colors.length ],
				borderColor: colors[ i % colors.length ].replace( '0.8', '1' ),
				borderWidth: 1,
			} );
		}

		return {
			labels: ['January', 'February', 'March', 'April', 'May', 'June'],
			datasets,
		};
	};

	const [ chartData, setChartData ] = useState( generateData );

	useEffect( () => {
		setChartData( generateData() );
	}, [ datasetCount ] );

	if ( ! BarChart ) {
		return <p>Bar Chart component not available</p>;
	}

	return (
		<>
			<div className="chart-controls mb-3">
				<RangeControl
					label="Number of Datasets"
					value={ datasetCount }
					onChange={ setDatasetCount }
					min={ 1 }
					max={ 4 }
				/>
				<Button isSecondary onClick={ () => setChartData( generateData() ) }>
					Regenerate Data
				</Button>
			</div>
			<div style={ { height: '400px', marginBottom: '2rem' } }>
				<BarChart
					chartData={ chartData }
					options={ {
						responsive: true,
						maintainAspectRatio: false,
						scales: {
							y: {
								beginAtZero: true,
							},
						},
					} }
					width={ 800 }
					height={ 400 }
				/>
			</div>
		</>
	);
};

// Line Chart Test Component
const LineChartTest = () => {
	const [ animated, setAnimated ] = useState( true );
	const [ tension, setTension ] = useState( 0.1 );

	const generateLineData = () => {
		return {
			labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
			datasets: [
				{
					label: 'Page Views',
					data: Array.from( { length: 6 }, () => Math.floor( Math.random() * 1000 ) ),
					borderColor: 'rgb(75, 192, 192)',
					backgroundColor: 'rgba(75, 192, 192, 0.2)',
					tension,
					fill: true,
				},
				{
					label: 'Unique Visitors',
					data: Array.from( { length: 6 }, () => Math.floor( Math.random() * 500 ) ),
					borderColor: 'rgb(255, 99, 132)',
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
					tension,
					fill: false,
				},
			],
		};
	};

	const [ lineData, setLineData ] = useState( generateLineData );

	useEffect( () => {
		setLineData( ( prevData ) => ( {
			...prevData,
			datasets: prevData.datasets.map( ( dataset ) => ( {
				...dataset,
				tension,
			} ) ),
		} ) );
	}, [ tension ] );

	if ( ! LineChart ) {
		return <p>Line Chart component not available</p>;
	}

	return (
		<>
			<div className="chart-controls mb-3">
				<RangeControl
					label="Line Tension"
					value={ tension }
					onChange={ setTension }
					min={ 0 }
					max={ 0.5 }
					step={ 0.05 }
				/>
				<Button isSecondary onClick={ () => setLineData( generateLineData() ) }>
					Regenerate Data
				</Button>
			</div>
			<div style={ { height: '400px', marginBottom: '2rem' } }>
				<LineChart
					chartData={ lineData }
					options={ {
						responsive: true,
						maintainAspectRatio: false,
						animation: animated,
						scales: {
							y: {
								beginAtZero: true,
							},
						},
					} }
					width={ 800 }
					height={ 400 }
				/>
			</div>
		</>
	);
};

// Mount charts when DOM is ready and components are available
const initCharts = () => {
	console.log('initCharts called');
	
	const chartsContainer = document.getElementById( 'charts-container' );
	console.log('chartsContainer:', chartsContainer);
	
	if ( chartsContainer ) {
		try {
			initChartComponents();
			console.log('BarChart:', BarChart, 'LineChart:', LineChart);
			console.log('window.hb:', window.hb);
			console.log('window.hb.components:', window.hb?.components);
			
			if ( BarChart || LineChart ) {
				console.log('Rendering charts...');
				createRoot( chartsContainer ).render(
					<>
						<div className="chart-section">
							<h3>Bar Chart</h3>
							<BarChartTest />
						</div>

						<div className="chart-section">
							<h3>Line Chart</h3>
							<LineChartTest />
						</div>
					</>
				);
			} else {
				// Show loading message if components aren't available yet
				const availableComponents = Object.keys(window.hb?.components || {});
				chartsContainer.innerHTML = '<div class="alert alert-info"><p>Loading chart components...</p><p>Available hb.components: <code>' + 
					availableComponents.join(', ') + '</code></p><p>window.Chart available: ' + 
					(typeof window.Chart !== 'undefined') + '</p></div>';
				
				// Retry after a short delay
				setTimeout( initCharts, 100 );
			}
		} catch (error) {
			console.error('Error in initCharts:', error);
			chartsContainer.innerHTML = '<div class="alert alert-danger"><p>Error initializing charts: ' + error.message + '</p></div>';
		}
	} else {
		console.log('charts-container not found');
	}
};

// Initialize when DOM is ready
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initCharts );
} else {
	// Add a small delay to ensure all scripts are loaded
	setTimeout( initCharts, 50 );
}