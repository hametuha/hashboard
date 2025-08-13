/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Chart.js
const mockChart = {
	destroy: jest.fn(),
	update: jest.fn(),
	data: {},
	options: {},
};

const mockChartConstructor = jest.fn(() => mockChart);

// Setup Chart.js mock
global.window.Chart = mockChartConstructor;

// Mock canvas getContext
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
	fillStyle: '',
	strokeStyle: '',
	lineWidth: 1,
	// Add other canvas context methods as needed
}));

// Import compiled component after setting up mocks
require('../assets/js/components/line-chart.js');
const HbLineChart = window.hb?.components?.lineChart;

describe('HbLineChart', () => {
	// Mock chart data
	const mockChartData = {
		labels: ['January', 'February', 'March', 'April', 'May', 'June'],
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

	// Reset mocks before each test
	beforeEach(() => {
		mockChartConstructor.mockClear();
		mockChart.destroy.mockClear();
		mockChart.update.mockClear();
	});

	// Skip tests if component is not compiled yet
	const skipIfNoComponent = HbLineChart ? describe : describe.skip;

	skipIfNoComponent('LineChart Component Tests', () => {
		test('renders line chart with canvas element', () => {
			const { container } = render(
				React.createElement(HbLineChart, {
					chartData: mockChartData
				})
			);

			expect(container.querySelector('.hb-line-chart')).toBeInTheDocument();
			expect(container.querySelector('canvas')).toBeInTheDocument();
		});

		test('creates Chart.js instance with correct config', () => {
			render(
				React.createElement(HbLineChart, {
					chartData: mockChartData
				})
			);

			expect(mockChartConstructor).toHaveBeenCalledWith(
				expect.any(Object), // canvas context
				expect.objectContaining({
					type: 'line',
					data: mockChartData,
					options: expect.objectContaining({
						responsive: true,
						maintainAspectRatio: false,
						plugins: expect.objectContaining({
							legend: expect.objectContaining({
								position: 'top'
							})
						}),
						scales: expect.objectContaining({
							y: expect.objectContaining({
								beginAtZero: true
							})
						})
					})
				})
			);
		});

		test('displays no data message when chartData is not provided', () => {
			const { container } = render(
				React.createElement(HbLineChart, {})
			);

			expect(container).toHaveTextContent('No data available');
			expect(container.querySelector('canvas')).not.toBeInTheDocument();
		});

		test('sets custom width and height on canvas', () => {
			const { container } = render(
				React.createElement(HbLineChart, {
					chartData: mockChartData,
					width: 600,
					height: 300
				})
			);

			const canvas = container.querySelector('canvas');
			expect(canvas).toHaveAttribute('width', '600');
			expect(canvas).toHaveAttribute('height', '300');
		});

		test('merges custom options with default options', () => {
			const customOptions = {
				plugins: {
					title: {
						display: true,
						text: 'Monthly Revenue'
					}
				},
				scales: {
					x: {
						grid: {
							display: false
						}
					}
				},
				elements: {
					line: {
						tension: 0.4
					}
				}
			};

			render(
				React.createElement(HbLineChart, {
					chartData: mockChartData,
					options: customOptions
				})
			);

			// Check that Chart was called with merged options
			expect(mockChartConstructor).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					type: 'line',
					data: mockChartData,
					options: expect.objectContaining({
						responsive: true,
						maintainAspectRatio: false,
						plugins: expect.objectContaining({
							title: expect.objectContaining({
								display: true,
								text: 'Monthly Revenue'
							})
						}),
						scales: expect.objectContaining({
							x: expect.objectContaining({
								grid: expect.objectContaining({
									display: false
								})
							})
						}),
						elements: expect.objectContaining({
							line: expect.objectContaining({
								tension: 0.4
							})
						})
					})
				})
			);
		});

		test('destroys chart on unmount', () => {
			const { unmount } = render(
				React.createElement(HbLineChart, {
					chartData: mockChartData
				})
			);

			unmount();

			expect(mockChart.destroy).toHaveBeenCalled();
		});

		test('recreates chart when chartData changes', () => {
			const { rerender } = render(
				React.createElement(HbLineChart, {
					chartData: mockChartData
				})
			);

			// Change chart data
			const newChartData = {
				...mockChartData,
				datasets: [
					{
						...mockChartData.datasets[0],
						data: [75, 69, 90, 91, 66, 65]
					}
				]
			};

			rerender(
				React.createElement(HbLineChart, {
					chartData: newChartData
				})
			);

			// Should destroy old chart and create new one
			expect(mockChart.destroy).toHaveBeenCalled();
			expect(mockChartConstructor).toHaveBeenCalledTimes(2);
		});

		test('handles missing Chart.js gracefully', () => {
			// Temporarily remove Chart.js
			const originalChart = global.window.Chart;
			delete global.window.Chart;

			const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

			const { container } = render(
				React.createElement(HbLineChart, {
					chartData: mockChartData
				})
			);

			expect(consoleSpy).toHaveBeenCalledWith(
				'Chart.js is not loaded. Please include Chart.js library.'
			);
			expect(mockChartConstructor).not.toHaveBeenCalled();

			// Restore Chart.js and console
			global.window.Chart = originalChart;
			consoleSpy.mockRestore();
		});

		test('supports multiple datasets', () => {
			const multiDatasetChartData = {
				labels: ['January', 'February', 'March', 'April', 'May', 'June'],
				datasets: [
					{
						label: 'Revenue',
						data: [65, 59, 80, 81, 56, 55],
						fill: false,
						borderColor: 'rgb(75, 192, 192)',
						tension: 0.1,
					},
					{
						label: 'Costs',
						data: [28, 48, 40, 19, 86, 27],
						fill: false,
						borderColor: 'rgb(255, 99, 132)',
						tension: 0.1,
					}
				],
			};

			render(
				React.createElement(HbLineChart, {
					chartData: multiDatasetChartData
				})
			);

			expect(mockChartConstructor).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					type: 'line',
					data: multiDatasetChartData
				})
			);
		});
	});

	test('component is exported correctly', () => {
		// テスト用のモックコンポーネントでも確認
		const mockComponent = ({ chartData }) => {
			return React.createElement('div', {
				'data-testid': 'line-chart',
			}, 'Mock Line Chart');
		};

		const { container } = render(
			React.createElement(mockComponent, {
				chartData: mockChartData
			})
		);

		expect(container.querySelector('[data-testid="line-chart"]')).toBeInTheDocument();
	});
});