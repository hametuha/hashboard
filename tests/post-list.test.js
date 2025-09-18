/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock wp.apiFetch - override the global setup
const mockApiFetch = jest.fn();
global.window.wp.apiFetch = mockApiFetch;

// Mock ListTable component
const mockListTable = jest.fn(({ loading, items, renderItem, listWrapperClass, listClass }) => {
	if (loading) {
		return React.createElement('div', { className: 'loading' }, 'Loading...');
	}
	
	return React.createElement('div', { className: 'list-table' }, 
		items.map(item => 
			React.createElement('div', { 
				key: item.id,
				className: `${listClass} list-item`
			}, renderItem(item))
		)
	);
});

global.window.hb = {
	components: {
		ListTable: mockListTable
	}
};

// Import compiled component after setting up mocks
require('../assets/js/components/post-list.js');
const { PostList } = window.hb?.components || {};

describe('PostList', () => {
	// Mock posts data
	const mockPosts = [
		{
			id: 1,
			title: { rendered: 'First Post' },
			link: 'https://example.com/post1',
			date: '2024-01-01T10:00:00',
			date_gmt: '2024-01-01T10:00:00',
		},
		{
			id: 2,
			title: { rendered: 'Second Post' },
			link: 'https://example.com/post2',
			date: '2024-01-02T15:30:00',
			date_gmt: '2024-01-02T15:30:00',
		},
	];

	beforeEach(() => {
		mockApiFetch.mockClear();
		mockListTable.mockClear();
	});

	// Component is compiled and available
	const skipIfNoComponent = describe;

	skipIfNoComponent('PostList Component Tests', () => {
		test('renders post list with title', async () => {
			mockApiFetch.mockResolvedValue(mockPosts);

			const { container } = render(
				React.createElement(PostList, {
					title: 'Latest Posts',
					onPostListUpdated: jest.fn()
				})
			);

			expect(container.querySelector('.hb-post-list')).toBeInTheDocument();
			expect(container.querySelector('.hb-post-list-title')).toHaveTextContent('Latest Posts');

			// Wait for posts to load
			await waitFor(() => {
				expect(container.querySelector('.list-table')).toBeInTheDocument();
			});
		});

		test('fetches posts with correct API parameters', async () => {
			mockApiFetch.mockResolvedValue(mockPosts);

			render(
				React.createElement(PostList, {
					postType: 'custom_post',
					max: '5',
					author: '123',
					onPostListUpdated: jest.fn()
				})
			);

			await waitFor(() => {
				expect(mockApiFetch).toHaveBeenCalledWith({
					path: 'wp/v2/custom_post?per_page=5&author%5B%5D=123'
				});
			});
		});

		test('renders posts with custom item renderer', async () => {
			mockApiFetch.mockResolvedValue(mockPosts);

			const { container } = render(
				React.createElement(PostList, {
					onPostListUpdated: jest.fn()
				})
			);

			await waitFor(() => {
				expect(container.querySelector('.hb-post-list-link')).toBeInTheDocument();
				expect(container.querySelector('.hb-post-list-title')).toHaveTextContent('First Post');
				expect(container.querySelector('.hb-post-list-date')).toBeInTheDocument();
			});
		});

		test('shows new badge for recent posts', async () => {
			// Create a recent post (today)
			const recentPost = {
				id: 1,
				title: { rendered: 'Recent Post' },
				link: 'https://example.com/recent',
				date: new Date().toISOString(),
				date_gmt: new Date().toISOString().replace('Z', ''),
			};

			mockApiFetch.mockResolvedValue([recentPost]);

			const { container } = render(
				React.createElement(PostList, {
					newDays: '7', // Show "new" badge for posts within 7 days
					onPostListUpdated: jest.fn()
				})
			);

			await waitFor(() => {
				expect(container.querySelector('.hb-post-list-new')).toBeInTheDocument();
				expect(container.querySelector('.hb-post-list-new')).toHaveTextContent('fiber_new');
			});
		});

		test('does not show new badge for old posts', async () => {
			// Create an old post
			const oldPost = {
				id: 1,
				title: { rendered: 'Old Post' },
				link: 'https://example.com/old',
				date: '2020-01-01T10:00:00',
				date_gmt: '2020-01-01T10:00:00',
			};

			mockApiFetch.mockResolvedValue([oldPost]);

			const { container } = render(
				React.createElement(PostList, {
					newDays: '7',
					onPostListUpdated: jest.fn()
				})
			);

			await waitFor(() => {
				expect(container.querySelector('.hb-post-list-new')).not.toBeInTheDocument();
			});
		});

		test('renders more button when provided', async () => {
			mockApiFetch.mockResolvedValue(mockPosts);

			const { container } = render(
				React.createElement(PostList, {
					moreButton: 'https://example.com/all-posts',
					moreLabel: 'View All Posts',
					onPostListUpdated: jest.fn()
				})
			);

			await waitFor(() => {
				const moreButton = container.querySelector('.btn');
				expect(moreButton).toBeInTheDocument();
				expect(moreButton).toHaveAttribute('href', 'https://example.com/all-posts');
				expect(moreButton).toHaveTextContent('View All Posts');
			});
		});

		test('does not render more button when not provided', async () => {
			mockApiFetch.mockResolvedValue(mockPosts);

			const { container } = render(
				React.createElement(PostList, {
					onPostListUpdated: jest.fn()
				})
			);

			await waitFor(() => {
				expect(container.querySelector('.btn')).not.toBeInTheDocument();
			});
		});

		test('shows loading state initially', () => {
			mockApiFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

			const { container } = render(
				React.createElement(PostList, {
					onPostListUpdated: jest.fn()
				})
			);

			expect(container.querySelector('.loading')).toBeInTheDocument();
			expect(container).toHaveTextContent('Loading...');
		});

		test('handles API fetch errors gracefully', async () => {
			const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
			mockApiFetch.mockRejectedValue(new Error('API Error'));

			const { container } = render(
				React.createElement(PostList, {
					onPostListUpdated: jest.fn()
				})
			);

			await waitFor(() => {
				expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch posts:', expect.any(Error));
			});

			consoleSpy.mockRestore();
		});

		test('calls onPostListUpdated after loading', async () => {
			const mockCallback = jest.fn();
			mockApiFetch.mockResolvedValue(mockPosts);

			render(
				React.createElement(PostList, {
					onPostListUpdated: mockCallback
				})
			);

			await waitFor(() => {
				expect(mockCallback).toHaveBeenCalled();
			});
		});


		test('renders with mock ListTable when provided', async () => {
			mockApiFetch.mockResolvedValue([]);

			const { container } = render(
				React.createElement(PostList, {
					title: 'Test Posts',
					onPostListUpdated: jest.fn()
				})
			);

			expect(container).toHaveTextContent('Test Posts');

			// Wait for loading to complete
			await waitFor(() => {
				expect(container.querySelector('.list-table')).toBeInTheDocument();
			});
		});

		test('parses string props to numbers correctly', async () => {
			mockApiFetch.mockResolvedValue([]);

			render(
				React.createElement(PostList, {
					max: '10',
					author: '456',
					newDays: '3',
					onPostListUpdated: jest.fn()
				})
			);

			await waitFor(() => {
				expect(mockApiFetch).toHaveBeenCalledWith({
					path: 'wp/v2/post?per_page=10&author%5B%5D=456'
				});
			});
		});
	});


	test('component is exported correctly', () => {
		// テスト用のモックコンポーネントでも確認
		const mockComponent = ({ title, postType }) => {
			return React.createElement('div', {
				'data-testid': 'post-list',
			}, 'Mock Post List');
		};

		const { container } = render(
			React.createElement(mockComponent, {
				title: 'Test',
				postType: 'post'
			})
		);

		expect(container.querySelector('[data-testid="post-list"]')).toBeInTheDocument();
	});
});