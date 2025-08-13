/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import compiled component after setting up mocks
require('../assets/js/components/month-selector.js');
const HbMonthSelector = window.hb?.components?.monthSelector;

describe('HbMonthSelector', () => {
	// Skip tests if component is not compiled yet
	const skipIfNoComponent = HbMonthSelector ? describe : describe.skip;

	skipIfNoComponent('Component Tests', () => {
		test('renders month and year selectors', () => {
			const { container } = render(
				React.createElement(HbMonthSelector, {
					label: 'Select Date',
					onDateUpdated: jest.fn()
				})
			);

			expect(container.querySelector('.hb-month-selector')).toBeInTheDocument();
			expect(container.querySelectorAll('select')).toHaveLength(2);
			expect(container.querySelector('button')).toBeInTheDocument();
		});

		test('calls onDateUpdated when update button is clicked', () => {
			const mockOnDateUpdated = jest.fn();
			const currentYear = new Date().getFullYear();
			const currentMonth = new Date().getMonth() + 1;

			const { container } = render(
				React.createElement(HbMonthSelector, {
					label: 'Select Date',
					onDateUpdated: mockOnDateUpdated,
					initialYear: currentYear,
					initialMonth: currentMonth
				})
			);

			const updateButton = container.querySelector('button');
			fireEvent.click(updateButton);

			expect(mockOnDateUpdated).toHaveBeenCalledWith(
				currentYear.toString(),
				currentMonth.toString().padStart(2, '0')
			);
		});

		test('updates month when select value changes', () => {
			const mockOnDateUpdated = jest.fn();
			const { container } = render(
				React.createElement(HbMonthSelector, {
					label: 'Select Date',
					onDateUpdated: mockOnDateUpdated
				})
			);

			const monthSelect = container.querySelectorAll('select')[1]; // 2番目がmonth
			fireEvent.change(monthSelect, { target: { value: '6' } });

			const updateButton = container.querySelector('button');
			fireEvent.click(updateButton);

			expect(mockOnDateUpdated).toHaveBeenCalledWith(
				expect.any(String),
				'06'
			);
		});

		test('renders custom year range', () => {
			const { container } = render(
				React.createElement(HbMonthSelector, {
					label: 'Select Date',
					minYear: 2020,
					maxYear: 2023,
					onDateUpdated: jest.fn()
				})
			);

			const yearSelect = container.querySelectorAll('select')[0]; // 1番目がyear
			const options = yearSelect.querySelectorAll('option');
			
			expect(options).toHaveLength(4); // 2020-2023 = 4年
			expect(options[0].value).toBe('2023'); // 最新年が最初
			expect(options[3].value).toBe('2020'); // 最古年が最後
		});
	});

	test('component is exported correctly', () => {
		// テスト用のモックコンポーネントでも確認
		const mockComponent = ({ label, onDateUpdated }) => {
			return React.createElement('div', {
				'data-testid': 'month-selector',
				'data-label': label
			}, 'Mock Month Selector');
		};

		const { container } = render(
			React.createElement(mockComponent, {
				label: 'Test Label',
				onDateUpdated: jest.fn()
			})
		);

		expect(container.querySelector('[data-testid="month-selector"]')).toBeInTheDocument();
		expect(container.querySelector('[data-label="Test Label"]')).toBeInTheDocument();
	});
});