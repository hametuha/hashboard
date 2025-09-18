/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock WordPress global objects
global.wp = {
	element: {
		createElement: React.createElement,
		useState: React.useState,
		useMemo: React.useMemo
	}
};

// Import components after setting up mocks
require('../assets/js/components/pagination.js');
const { Pagination, PaginationButton } = window.hb.components || {};

describe('PaginationButton', () => {
	test('renders page number correctly', () => {
		const { container } = render(
			React.createElement(PaginationButton, {
				number: 5,
				current: false,
				disabled: false,
				onPaginated: jest.fn()
			})
		);

		expect(container.querySelector('.page-link').textContent).toBe('5');
	});

	test('renders left chevron icon', () => {
		const { container } = render(
			React.createElement(PaginationButton, {
				number: 1,
				label: 'left',
				disabled: false,
				onPaginated: jest.fn()
			})
		);

		const icon = container.querySelector('.material-icons');
		expect(icon).toBeInTheDocument();
		expect(icon.textContent).toBe('chevron_left');
	});

	test('applies active class when current', () => {
		const { container } = render(
			React.createElement(PaginationButton, {
				number: 3,
				current: true,
				onPaginated: jest.fn()
			})
		);

		expect(container.querySelector('.page-item')).toHaveClass('active');
	});

	test('applies disabled class when disabled', () => {
		const { container } = render(
			React.createElement(PaginationButton, {
				number: 1,
				disabled: true,
				onPaginated: jest.fn()
			})
		);

		expect(container.querySelector('.page-item')).toHaveClass('disabled');
	});

	test('calls onPaginated when clicked', () => {
		const mockOnPaginated = jest.fn();
		const { container } = render(
			React.createElement(PaginationButton, {
				number: 5,
				current: false,
				disabled: false,
				onPaginated: mockOnPaginated
			})
		);

		fireEvent.click(container.querySelector('.page-link'));
		expect(mockOnPaginated).toHaveBeenCalledWith(5);
	});

	test('does not call onPaginated when disabled', () => {
		const mockOnPaginated = jest.fn();
		const { container } = render(
			React.createElement(PaginationButton, {
				number: 5,
				disabled: true,
				onPaginated: mockOnPaginated
			})
		);

		fireEvent.click(container.querySelector('.page-link'));
		expect(mockOnPaginated).not.toHaveBeenCalled();
	});
});

describe('Pagination', () => {
	test('renders basic pagination correctly', () => {
		const { container } = render(
			React.createElement(Pagination, {
				total: 10,
				current: 5,
				max: 5,
				onPageChanged: jest.fn()
			})
		);

		const pageItems = container.querySelectorAll('.page-item');
		// Previous + left ellipsis + 3,4,5,6,7 + right ellipsis + Next = 9 items
		expect(pageItems).toHaveLength(9);
	});

	test('renders small pagination without ellipsis', () => {
		const { container } = render(
			React.createElement(Pagination, {
				total: 3,
				current: 2,
				max: 5,
				onPageChanged: jest.fn()
			})
		);

		const pageItems = container.querySelectorAll('.page-item');
		// Previous + 1,2,3 + Next = 5 items
		expect(pageItems).toHaveLength(5);
	});

	test('applies center alignment class', () => {
		const { container } = render(
			React.createElement(Pagination, {
				total: 10,
				current: 5,
				align: 'center',
				onPageChanged: jest.fn()
			})
		);

		expect(container.querySelector('.pagination')).toHaveClass('justify-content-center');
	});

	test('calls onPageChanged when page is clicked', () => {
		const mockOnPageChanged = jest.fn();
		const { container } = render(
			React.createElement(Pagination, {
				total: 10,
				current: 5,
				max: 5,
				onPageChanged: mockOnPageChanged
			})
		);

		// Find and click page 6
		const pageLinks = container.querySelectorAll('.page-link');
		const page6 = Array.from(pageLinks).find(link => link.textContent === '6');
		fireEvent.click(page6);

		expect(mockOnPageChanged).toHaveBeenCalledWith(6);
	});

	test('disables previous button on first page', () => {
		const { container } = render(
			React.createElement(Pagination, {
				total: 10,
				current: 1,
				max: 5,
				onPageChanged: jest.fn()
			})
		);

		const firstPageItem = container.querySelector('.page-item');
		expect(firstPageItem).toHaveClass('disabled');
	});

	test('disables next button on last page', () => {
		const { container } = render(
			React.createElement(Pagination, {
				total: 10,
				current: 10,
				max: 5,
				onPageChanged: jest.fn()
			})
		);

		const pageItems = container.querySelectorAll('.page-item');
		const lastPageItem = pageItems[pageItems.length - 1];
		expect(lastPageItem).toHaveClass('disabled');
	});
});
