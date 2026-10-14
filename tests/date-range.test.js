/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

require('../assets/js/components/date-range.js');
const { DateRange } = window.hb.components;

describe('DateRange', () => {
	test('is registered under the PascalCase key', () => {
		expect(DateRange).toEqual(expect.any(Function));
	});

	test('renders trigger with formatted range and separator', () => {
		const { container } = render(
			React.createElement(DateRange, {
				start: new Date(2024, 0, 1),
				end: new Date(2024, 0, 31),
				separator: '-',
			})
		);
		const trigger = container.querySelector('.hb-date-range-trigger');
		expect(trigger).toHaveTextContent('2024/01/01 - 2024/01/31');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	test('calls onPeriodChanged with initial range', () => {
		const onPeriodChanged = jest.fn();
		const start = new Date(2024, 0, 1);
		const end = new Date(2024, 0, 31);
		render(React.createElement(DateRange, { start, end, onPeriodChanged }));
		expect(onPeriodChanged).toHaveBeenCalledWith(start, end);
	});

	test('opens popover with start and end date pickers', () => {
		const { container } = render(React.createElement(DateRange, {}));
		fireEvent.click(container.querySelector('.hb-date-range-trigger'));
		expect(screen.getByText('Start Date')).toBeInTheDocument();
		expect(screen.getByText('End Date')).toBeInTheDocument();
		expect(document.querySelectorAll('.components-datetime__date')).toHaveLength(2);
	});

	test('disables Apply when range is invalid', () => {
		const { container } = render(
			React.createElement(DateRange, {
				start: new Date(2024, 0, 31),
				end: new Date(2024, 0, 1),
			})
		);
		fireEvent.click(container.querySelector('.hb-date-range-trigger'));
		expect(screen.getByText('Apply').closest('button')).toBeDisabled();
	});
});
