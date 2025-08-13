/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock DateRange component
const mockDateRange = jest.fn(({ onDateChanged }) => {
	return React.createElement('div', { 
		'data-testid': 'date-range',
		onClick: () => {
			if (onDateChanged) {
				onDateChanged(new Date('2024-01-01'), new Date('2024-01-31'));
			}
		}
	}, 'Mock Date Range');
});

global.window.hb = {
	components: {
		dateRange: mockDateRange
	}
};

// Import compiled component
require('../assets/js/components/period-picker.js');
const HbPeriodPicker = window.hb?.components?.periodPicker;

describe('HbPeriodPicker', () => {
	const mockOnDateStart = jest.fn();
	const mockOnDateChanged = jest.fn();

	beforeEach(() => {
		mockOnDateStart.mockClear();
		mockOnDateChanged.mockClear();
		mockDateRange.mockClear();
	});

	// Skip tests if component is not compiled yet
	const skipIfNoComponent = HbPeriodPicker ? describe : describe.skip;

	skipIfNoComponent('PeriodPicker Component Tests', () => {
		test('renders period picker with default buttons', () => {
			const { container } = render(
				React.createElement(HbPeriodPicker, {
					onDateStart: mockOnDateStart,
					onDateChanged: mockOnDateChanged
				})
			);

			expect(container.querySelector('.hb-period')).toBeInTheDocument();
			
			// Should have radio buttons for predefined periods
			const radioInputs = container.querySelectorAll('input[type="radio"]');
			expect(radioInputs.length).toBeGreaterThan(0);
			
			// Should have labels
			const labels = container.querySelectorAll('.hb-radio-label');
			expect(labels.length).toBeGreaterThan(0);
		});

		test('renders custom period option when allowCustom is true', () => {
			const { container } = render(
				React.createElement(HbPeriodPicker, {
					allowCustom: true,
					onDateStart: mockOnDateStart
				})
			);

			const customInput = container.querySelector('input[value="custom"]');
			expect(customInput).toBeInTheDocument();
		});

		test('does not render custom option when allowCustom is false', () => {
			const { container } = render(
				React.createElement(HbPeriodPicker, {
					allowCustom: false,
					onDateStart: mockOnDateStart
				})
			);

			const customInput = container.querySelector('input[value="custom"]');
			expect(customInput).not.toBeInTheDocument();
		});

		test('calls onDateStart on mount with default mode', async () => {
			render(
				React.createElement(HbPeriodPicker, {
					defaultMode: '30',
					onDateStart: mockOnDateStart
				})
			);

			await waitFor(() => {
				expect(mockOnDateStart).toHaveBeenCalledTimes(1);
				const [startDate, endDate] = mockOnDateStart.mock.calls[0];
				expect(startDate).toBeInstanceOf(Date);
				expect(endDate).toBeInstanceOf(Date);
			});
		});

		test('handles mode change to predefined period', async () => {
			const { container } = render(
				React.createElement(HbPeriodPicker, {
					defaultMode: '7',
					onDateStart: mockOnDateStart
				})
			);

			// Clear initial call
			mockOnDateStart.mockClear();

			// Change to 30 days
			const thirtyDaysInput = container.querySelector('input[value="30"]');
			fireEvent.click(thirtyDaysInput);

			await waitFor(() => {
				expect(mockOnDateStart).toHaveBeenCalledTimes(1);
				const [startDate, endDate] = mockOnDateStart.mock.calls[0];
				expect(startDate).toBeInstanceOf(Date);
				expect(endDate).toBeInstanceOf(Date);
				
				// Check that start date is approximately 30 days before end date
				const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
				expect(daysDiff).toBeCloseTo(30, 0);
			});
		});

		test('handles quarterly period calculation', async () => {
			const { container } = render(
				React.createElement(HbPeriodPicker, {
					buttons: [
						{ value: 'qtr', label: 'Current Quarter' }
					],
					onDateStart: mockOnDateStart
				})
			);

			// Clear initial call
			mockOnDateStart.mockClear();

			// Select quarterly option
			const qtrInput = container.querySelector('input[value="qtr"]');
			fireEvent.click(qtrInput);

			await waitFor(() => {
				expect(mockOnDateStart).toHaveBeenCalledTimes(1);
				const [startDate, endDate] = mockOnDateStart.mock.calls[0];
				expect(startDate).toBeInstanceOf(Date);
				expect(endDate).toBeInstanceOf(Date);
				
				// Start date should be the beginning of current quarter
				const currentMonth = endDate.getMonth();
				const expectedQuarterStart = Math.floor(currentMonth / 3) * 3;
				expect(startDate.getMonth()).toBe(expectedQuarterStart);
				expect(startDate.getDate()).toBe(1);
			});
		});

		test('shows custom date range when custom mode is selected', () => {
			const { container } = render(
				React.createElement(HbPeriodPicker, {
					allowCustom: true,
					onDateStart: mockOnDateStart
				})
			);

			// Initially, custom date range should be hidden (opacity 0)
			const dateRangeDiv = container.querySelector('.hb-period-dates');
			expect(dateRangeDiv).toHaveStyle('opacity: 0');

			// Select custom mode
			const customInput = container.querySelector('input[value="custom"]');
			fireEvent.click(customInput);

			// Custom date range should now be visible (opacity 1)
			expect(dateRangeDiv).toHaveStyle('opacity: 1');
		});

		test('calls onDateChanged when custom date range changes', () => {
			const { container } = render(
				React.createElement(HbPeriodPicker, {
					allowCustom: true,
					onDateChanged: mockOnDateChanged
				})
			);

			// Select custom mode first
			const customInput = container.querySelector('input[value="custom"]');
			fireEvent.click(customInput);

			// Trigger date range change
			const dateRange = container.querySelector('[data-testid="date-range"]');
			fireEvent.click(dateRange);

			expect(mockOnDateChanged).toHaveBeenCalledWith(
				new Date('2024-01-01'),
				new Date('2024-01-31')
			);
		});

		test('shows fallback when DateRange component not available', () => {
			// Temporarily remove DateRange
			const originalDateRange = global.window.hb.components.dateRange;
			delete global.window.hb.components.dateRange;

			const { container } = render(
				React.createElement(HbPeriodPicker, {
					allowCustom: true,
					onDateStart: mockOnDateStart
				})
			);

			// Select custom mode
			const customInput = container.querySelector('input[value="custom"]');
			fireEvent.click(customInput);

			expect(container).toHaveTextContent('DateRange component not available');

			// Restore DateRange
			global.window.hb.components.dateRange = originalDateRange;
		});

		test('uses custom buttons when provided', () => {
			const customButtons = [
				{ value: '1', label: 'Yesterday' },
				{ value: '14', label: 'Last 2 weeks' }
			];

			const { container } = render(
				React.createElement(HbPeriodPicker, {
					buttons: customButtons,
					onDateStart: mockOnDateStart
				})
			);

			expect(container).toHaveTextContent('Yesterday');
			expect(container).toHaveTextContent('Last 2 weeks');
		});

		test('uses custom label for custom option', () => {
			const { container } = render(
				React.createElement(HbPeriodPicker, {
					allowCustom: true,
					customLabel: 'Select Range',
					onDateStart: mockOnDateStart
				})
			);

			expect(container).toHaveTextContent('Select Range');
		});

		test('generates unique component IDs', () => {
			const { container: container1 } = render(
				React.createElement(HbPeriodPicker, {
					onDateStart: mockOnDateStart
				})
			);

			const { container: container2 } = render(
				React.createElement(HbPeriodPicker, {
					onDateStart: mockOnDateStart
				})
			);

			const inputs1 = container1.querySelectorAll('input[type="radio"]');
			const inputs2 = container2.querySelectorAll('input[type="radio"]');

			// Check that IDs are different between instances
			if (inputs1.length > 0 && inputs2.length > 0) {
				expect(inputs1[0].id).not.toBe(inputs2[0].id);
			}
		});
	});

	test('component is exported correctly', () => {
		expect(HbPeriodPicker).toBeDefined();
	});
});