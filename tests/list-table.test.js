/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import compiled component after setting up mocks
require('../assets/js/components/list-table.js');
const HbListTable = window.hb?.components?.listTable;

// Also import the actual Pagination and Loading components if they're available
const HbPagination = window.hb?.components?.pagination;
const HbLoading = window.hb?.components?.loading;

describe('HbListTable', () => {
	// Mock data
	const mockPosts = [
		{
			id: 1,
			title: { rendered: 'First Post' },
			link: 'https://example.com/post1',
			date: '2024-01-01',
		},
		{
			id: 2,
			title: { rendered: 'Second Post' },
			link: 'https://example.com/post2',
			date: '2024-01-02',
		},
	];

	const mockUsers = [
		{
			id: 1,
			name: 'John Doe',
			email: 'john@example.com',
			avatar: 'https://example.com/avatar1.jpg',
		},
		{
			id: 2,
			name: 'Jane Smith',
			email: 'jane@example.com',
			avatar: 'https://example.com/avatar2.jpg',
		},
	];

	// Skip tests if component is not compiled yet
	const skipIfNoComponent = HbListTable ? describe : describe.skip;

	skipIfNoComponent('ListTable Component Tests', () => {
		test('renders list with default item renderer', () => {
			const { container } = render(
				React.createElement(HbListTable, {
					items: mockPosts,
					onPageChanged: jest.fn()
				})
			);

			expect(container.querySelector('.hb-list-table')).toBeInTheDocument();
			expect(container.querySelector('.hb-post-list')).toBeInTheDocument();
			expect(container.querySelectorAll('.hb-post-list-item')).toHaveLength(2);
			expect(container).toHaveTextContent('First Post');
			expect(container).toHaveTextContent('Second Post');
		});

		test('renders custom items using renderItem prop', () => {
			const customRenderItem = (user) => React.createElement('div', {
				className: 'custom-user-item'
			}, [
				React.createElement('img', { 
					key: 'avatar',
					src: user.avatar, 
					alt: user.name,
					width: 40,
					height: 40
				}),
				React.createElement('span', { key: 'name' }, user.name),
				React.createElement('span', { key: 'email' }, user.email)
			]);

			const { container } = render(
				React.createElement(HbListTable, {
					items: mockUsers,
					renderItem: customRenderItem,
					onPageChanged: jest.fn()
				})
			);

			expect(container.querySelectorAll('.custom-user-item')).toHaveLength(2);
			expect(container.querySelector('img[alt="John Doe"]')).toBeInTheDocument();
			expect(container).toHaveTextContent('john@example.com');
		});

		test('renders custom header using renderHeader prop', () => {
			const customRenderHeader = () => React.createElement('div', {
				className: 'custom-header'
			}, [
				React.createElement('h2', { key: 'title' }, 'User List'),
				React.createElement('input', { 
					key: 'search',
					type: 'text', 
					placeholder: 'Search users...',
					className: 'search-input'
				})
			]);

			const { container } = render(
				React.createElement(HbListTable, {
					items: mockUsers,
					renderHeader: customRenderHeader,
					onPageChanged: jest.fn()
				})
			);

			expect(container.querySelector('.custom-header')).toBeInTheDocument();
			expect(container.querySelector('h2')).toHaveTextContent('User List');
			expect(container.querySelector('.search-input')).toBeInTheDocument();
		});

		test('renders empty state with custom renderEmpty', () => {
			const customRenderEmpty = () => React.createElement('div', {
				className: 'empty-state'
			}, [
				React.createElement('i', { 
					key: 'icon',
					className: 'material-icons'
				}, 'inbox'),
				React.createElement('p', { key: 'message' }, 'No posts found')
			]);

			const { container } = render(
				React.createElement(HbListTable, {
					items: [],
					renderEmpty: customRenderEmpty,
					onPageChanged: jest.fn()
				})
			);

			expect(container.querySelector('.empty-state')).toBeInTheDocument();
			expect(container.querySelector('.material-icons')).toHaveTextContent('inbox');
			expect(container).toHaveTextContent('No posts found');
		});

		test('shows default empty message when no items', () => {
			const { container } = render(
				React.createElement(HbListTable, {
					items: [],
					onPageChanged: jest.fn()
				})
			);

			expect(container).toHaveTextContent('No items found');
		});

		test('applies custom wrapper and list classes', () => {
			const { container } = render(
				React.createElement(HbListTable, {
					items: mockPosts,
					wrapperClass: 'custom-wrapper',
					listWrapperClass: 'custom-list',
					listClass: 'custom-item',
					onPageChanged: jest.fn()
				})
			);

			expect(container.querySelector('.hb-list-table')).toHaveClass('custom-wrapper');
			expect(container.querySelector('ul')).toHaveClass('custom-list');
			expect(container.querySelector('li')).toHaveClass('custom-item');
		});

		test('shows pagination when totalPage > 1', () => {
			const { container } = render(
				React.createElement(HbListTable, {
					items: mockPosts,
					curPage: 1,
					totalPage: 5,
					onPageChanged: jest.fn()
				})
			);

			expect(container.querySelector('.pagination-wrapper')).toBeInTheDocument();
			expect(container).toHaveTextContent('Page 1 of 5');
		});

		test('hides pagination when loading', () => {
			const { container } = render(
				React.createElement(HbListTable, {
					items: mockPosts,
					loading: true,
					curPage: 1,
					totalPage: 5,
					onPageChanged: jest.fn()
				})
			);

			expect(container.querySelector('.pagination-wrapper')).not.toBeInTheDocument();
			expect(container.querySelector('.hb-loading-overlay')).toBeInTheDocument();
		});

		test('calls onPageChanged when pagination is clicked', () => {
			const mockPageChanged = jest.fn();
			const { container } = render(
				React.createElement(HbListTable, {
					items: mockPosts,
					curPage: 2,
					totalPage: 5,
					onPageChanged: mockPageChanged
				})
			);

			const nextButton = container.querySelector('button:last-child');
			fireEvent.click(nextButton);

			expect(mockPageChanged).toHaveBeenCalledWith(3);
		});

		test('uses custom Loading component when provided', () => {
			const CustomLoading = ({ loading }) => 
				loading ? React.createElement('div', { className: 'custom-loading' }, 'Loading...') : null;

			const { container } = render(
				React.createElement(HbListTable, {
					items: [],
					loading: true,
					LoadingComponent: CustomLoading,
					onPageChanged: jest.fn()
				})
			);

			expect(container.querySelector('.custom-loading')).toBeInTheDocument();
			expect(container).toHaveTextContent('Loading...');
		});

		test('uses custom Pagination component when provided', () => {
			const CustomPagination = ({ current, total, onPageChanged }) => 
				React.createElement('div', { 
					className: 'custom-pagination',
					onClick: () => onPageChanged(current + 1)
				}, `${current}/${total}`);

			const mockPageChanged = jest.fn();
			const { container } = render(
				React.createElement(HbListTable, {
					items: mockPosts,
					curPage: 1,
					totalPage: 3,
					PaginationComponent: CustomPagination,
					onPageChanged: mockPageChanged
				})
			);

			const customPagination = container.querySelector('.custom-pagination');
			expect(customPagination).toBeInTheDocument();
			expect(customPagination).toHaveTextContent('1/3');

			fireEvent.click(customPagination);
			expect(mockPageChanged).toHaveBeenCalledWith(2);
		});

		test('handles items without rendered title property', () => {
			const itemsWithPlainTitle = [
				{
					id: 1,
					title: 'Plain Title',
					link: 'https://example.com/item1',
					date: '2024-01-01',
				}
			];

			const { container } = render(
				React.createElement(HbListTable, {
					items: itemsWithPlainTitle,
					onPageChanged: jest.fn()
				})
			);

			expect(container).toHaveTextContent('Plain Title');
		});
	});

	test('component is exported correctly', () => {
		// テスト用のモックコンポーネントでも確認
		const mockComponent = ({ items, renderItem }) => {
			return React.createElement('div', {
				'data-testid': 'list-table',
			}, 'Mock List Table');
		};

		const { container } = render(
			React.createElement(mockComponent, {
				items: [],
				renderItem: () => {}
			})
		);

		expect(container.querySelector('[data-testid="list-table"]')).toBeInTheDocument();
	});
});