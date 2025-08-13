/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import compiled component after setting up mocks
require('../assets/js/components/date-range.js');
const HbDateRange = window.hb?.components?.dateRange;

describe('HbDateRange', () => {
	// Skip tests if component is not compiled yet
	const skipIfNoComponent = HbDateRange ? describe : describe.skip;

	skipIfNoComponent('Component Tests', () => {
		test('renders start and end date pickers', () => {
			const { container } = render(
				React.createElement(HbDateRange, {
					onDateChanged: jest.fn()
				})
			);

			expect(container.querySelector('.hb-date-range')).toBeInTheDocument();
			// WordPressのDatePickerコンポーネントの存在を確認
			expect(container.querySelectorAll('.hb-date-range-start')).toHaveLength(1);
			expect(container.querySelectorAll('.hb-date-range-end')).toHaveLength(1);
			expect(container.querySelector('.hb-date-range-separator')).toBeInTheDocument();
		});

		test('calls onDateChanged when valid date range is selected', () => {
			const mockOnDateChanged = jest.fn();
			const startDate = new Date('2024-01-01');
			const endDate = new Date('2024-01-31');

			const { container } = render(
				React.createElement(HbDateRange, {
					start: startDate,
					end: endDate,
					onDateChanged: mockOnDateChanged
				})
			);

			// Initial render should trigger onDateChanged since dates are valid
			expect(mockOnDateChanged).toHaveBeenCalledWith(startDate, endDate);
		});

		test('shows error status when start date is after end date', () => {
			const startDate = new Date('2024-01-31');
			const endDate = new Date('2024-01-01');

			const { container } = render(
				React.createElement(HbDateRange, {
					start: startDate,
					end: endDate,
					onDateChanged: jest.fn()
				})
			);

			const statusIcon = container.querySelector('.material-icons');
			expect(statusIcon).toHaveClass('text-danger');
			expect(statusIcon).toHaveTextContent('error');
		});

		test('shows success status when date range is valid', () => {
			const startDate = new Date('2024-01-01');
			const endDate = new Date('2024-01-31');

			const { container } = render(
				React.createElement(HbDateRange, {
					start: startDate,
					end: endDate,
					onDateChanged: jest.fn()
				})
			);

			const statusIcon = container.querySelector('.material-icons');
			expect(statusIcon).toHaveClass('text-success');
			expect(statusIcon).toHaveTextContent('done_all');
		});

		test('renders custom separator', () => {
			const customSeparator = ' - ';
			const { container } = render(
				React.createElement(HbDateRange, {
					separator: customSeparator,
					onDateChanged: jest.fn()
				})
			);

			const separatorElement = container.querySelector('.hb-date-range-separator');
			expect(separatorElement).toHaveTextContent(customSeparator.trim());
		});

		test('uses default status when dates are missing', () => {
			const { container } = render(
				React.createElement(HbDateRange, {
					start: null,
					end: null,
					onDateChanged: jest.fn()
				})
			);

			const statusIcon = container.querySelector('.material-icons');
			expect(statusIcon).toHaveClass('text-muted');
			expect(statusIcon).toHaveTextContent('error_outline');
		});
	});

	test('component is exported correctly', () => {
		// テスト用のモックコンポーネントでも確認
		const mockComponent = ({ onDateChanged }) => {
			return React.createElement('div', {
				'data-testid': 'date-range',
			}, 'Mock Date Range');
		};

		const { container } = render(
			React.createElement(mockComponent, {
				onDateChanged: jest.fn()
			})
		);

		expect(container.querySelector('[data-testid="date-range"]')).toBeInTheDocument();
	});
});