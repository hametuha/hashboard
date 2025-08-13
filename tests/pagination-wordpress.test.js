/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// WordPress依存関係のテスト
describe('WordPress Dependencies Test', () => {
	test('wp.element is available', () => {
		expect(wp.element).toBeDefined();
		expect(wp.element.useState).toBeDefined();
		expect(wp.element.createElement).toBeDefined();
	});

	test('wp.i18n is available', () => {
		expect(wp.i18n).toBeDefined();
		expect(wp.i18n.__).toBeDefined();
	});

	test('React createElement works with wp.element', () => {
		const { createElement } = wp.element;
		const element = createElement('div', { className: 'test' }, 'Hello World');
		
		expect(element).toBeDefined();
		expect(element.type).toBe('div');
		expect(element.props.className).toBe('test');
		expect(element.props.children).toBe('Hello World');
	});

	test('i18n function works', () => {
		const { __ } = wp.i18n;
		const translated = __('Hello', 'textdomain');
		
		// モック環境では翻訳されずにそのまま返される
		expect(translated).toBe('Hello');
	});
});

// grab-depsで生成されたコンポーネントのテスト例
describe('Compiled Component Test', () => {
	beforeEach(() => {
		// grab-depsが生成するグローバル登録をシミュレート
		global.window.hb = {
			components: {
				pagination: {
					HbPagination: ({ total, current, onPageChanged }) => {
						const { createElement: el } = wp.element;
						return el('div', {
							'data-testid': 'pagination',
							'data-total': total,
							'data-current': current
						}, `Page ${current} of ${total}`);
					}
				}
			}
		};
	});

	test('compiled component is accessible via global namespace', () => {
		expect(window.hb.components.pagination).toBeDefined();
		expect(window.hb.components.pagination.HbPagination).toBeDefined();
	});

	test('compiled component renders correctly', () => {
		const { HbPagination } = window.hb.components.pagination;
		const { container } = render(
			React.createElement(HbPagination, {
				total: 10,
				current: 5,
				onPageChanged: jest.fn()
			})
		);

		expect(container.querySelector('[data-testid="pagination"]')).toBeInTheDocument();
		expect(container.querySelector('[data-total="10"]')).toBeInTheDocument();
		expect(container.querySelector('[data-current="5"]')).toBeInTheDocument();
	});
});