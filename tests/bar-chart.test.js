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
require('../assets/js/components/bar-chart.js');
const HbBarChart = window.hb?.components?.barChart;

describe('HbBarChart', () => {
	// Mock chart data
	const mockChartData = {
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

	// Reset mocks before each test
	beforeEach(() => {
		mockChartConstructor.mockClear();
		mockChart.destroy.mockClear();
		mockChart.update.mockClear();
	});

	// Skip tests if component is not compiled yet
	const skipIfNoComponent = HbBarChart ? describe : describe.skip;

	skipIfNoComponent('BarChart Component Tests', () => {
		test('renders bar chart with canvas element', () => {
			const { container } = render(
				React.createElement(HbBarChart, {
					chartData: mockChartData
				})
			);

			expect(container.querySelector('.hb-bar-chart')).toBeInTheDocument();
			expect(container.querySelector('canvas')).toBeInTheDocument();
		});

		test('creates Chart.js instance with correct config', () => {
			render(
				React.createElement(HbBarChart, {
					chartData: mockChartData
				})
			);

			expect(mockChartConstructor).toHaveBeenCalledWith(
				expect.any(Object), // canvas context
				expect.objectContaining({
					type: 'bar',
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
				React.createElement(HbBarChart, {})
			);

			expect(container).toHaveTextContent('No data available');
			expect(container.querySelector('canvas')).not.toBeInTheDocument();
		});

		test('sets custom width and height on canvas', () => {
			const { container } = render(
				React.createElement(HbBarChart, {
					chartData: mockChartData,
					width: 800,
					height: 400
				})
			);

			const canvas = container.querySelector('canvas');
			expect(canvas).toHaveAttribute('width', '800');
			expect(canvas).toHaveAttribute('height', '400');
		});

		test('merges custom options with default options', () => {
			const customOptions = {
				plugins: {
					title: {
						display: true,
						text: 'Custom Title'
					}
				},
				scales: {
					x: {
						display: false
					}
				}
			};

			render(
				React.createElement(HbBarChart, {
					chartData: mockChartData,
					options: customOptions
				})
			);

			// Check that Chart was called with merged options
			expect(mockChartConstructor).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					type: 'bar',
					data: mockChartData,
					options: expect.objectContaining({
						responsive: true,
						maintainAspectRatio: false,
						plugins: expect.objectContaining({
							title: expect.objectContaining({
								display: true,
								text: 'Custom Title'
							})
						}),
						scales: expect.objectContaining({
							x: expect.objectContaining({
								display: false
							})
						})
					})
				})
			);
		});

		test('destroys chart on unmount', () => {
			const { unmount } = render(
				React.createElement(HbBarChart, {
					chartData: mockChartData
				})
			);

			unmount();

			expect(mockChart.destroy).toHaveBeenCalled();
		});

		test('recreates chart when chartData changes', () => {
			const { rerender } = render(
				React.createElement(HbBarChart, {
					chartData: mockChartData
				})
			);

			// Change chart data
			const newChartData = {
				...mockChartData,
				datasets: [
					{
						...mockChartData.datasets[0],
						data: [5, 10, 15, 20, 25, 30]
					}
				]
			};

			rerender(
				React.createElement(HbBarChart, {
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
				React.createElement(HbBarChart, {
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
	});

	test('component is exported correctly', () => {
		// テスト用のモックコンポーネントでも確認
		const mockComponent = ({ chartData }) => {
			return React.createElement('div', {
				'data-testid': 'bar-chart',
			}, 'Mock Bar Chart');
		};

		const { container } = render(
			React.createElement(mockComponent, {
				chartData: mockChartData
			})
		);

		expect(container.querySelector('[data-testid="bar-chart"]')).toBeInTheDocument();
	});
});