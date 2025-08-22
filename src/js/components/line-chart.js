/*!
 * Line chart component for React
 *
 * @deps chart-js
 */

import { useEffect, useRef, useMemo } from '@wordpress/element';

/**
 * Line Chart Component
 * @param {Object} props - Component props
 */
const LineChart = ( props ) => {
	const {
		chartData,
		options = {},
		width = 400,
		height = 200,
		redraw = false,
	} = props;

	const canvasRef = useRef( null );
	const chartRef = useRef( null );

	// Chart.js default options
	const defaultOptions = useMemo( () => ( {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: false,
			},
		},
		scales: {
			y: {
				beginAtZero: true,
			},
		},
		...options,
	} ), [ options ] );

	// Initialize and manage chart
	useEffect( () => {
		if ( ! canvasRef.current || ! chartData ) {
			return;
		}

		// Check if Chart.js is available globally
		if ( typeof window.Chart === 'undefined' ) {
			// eslint-disable-next-line no-console
			console.error( 'Chart.js is not loaded. Please include Chart.js library.' );
			return;
		}

		const ctx = canvasRef.current.getContext( '2d' );

		// Destroy existing chart if it exists
		if ( chartRef.current ) {
			chartRef.current.destroy();
		}

		// Create new chart
		chartRef.current = new window.Chart( ctx, {
			type: 'line',
			data: chartData,
			options: defaultOptions,
		} );

		// Cleanup function
		return () => {
			if ( chartRef.current ) {
				chartRef.current.destroy();
				chartRef.current = null;
			}
		};
	}, [ chartData, options, redraw, defaultOptions ] );

	// Return early if no data
	if ( ! chartData ) {
		return (
			<div className="hb-line-chart">
				<p>No data available</p>
			</div>
		);
	}

	return (
		<div className="hb-line-chart">
			<canvas
				ref={ canvasRef }
				width={ width }
				height={ height }
			/>
		</div>
	);
};

// Export component
export default LineChart;
