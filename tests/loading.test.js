/**
 * Test for loading.js component
 */

// @jest-environment jsdom

/* eslint-env jest */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock WordPress dependencies
global.wp = {
	element: require('@wordpress/element'),
	components: {
		Spinner: ({ style }) => React.createElement('div', {
			className: 'spinner',
			style
		}),
	},
	i18n: {
		__: (text) => text,
	},
};

// Import compiled component
require('../assets/js/components/loading.js');
const { LoadingIndicator } = window.hb?.components || {};

describe( 'LoadingIndicator Component', () => {
	// Skip tests if component is not compiled yet
	const skipIfNoComponent = LoadingIndicator ? describe : describe.skip;

	skipIfNoComponent('LoadingIndicator Component Tests', () => {
		test( 'renders hidden div when loading is false', () => {
			const { container } = render(
				React.createElement(LoadingIndicator, { loading: false })
			);

			const hiddenDiv = container.querySelector('div[style*="display: none"]');
			expect( hiddenDiv ).toBeInTheDocument();
		} );

		test( 'renders loading indicator when loading is true', () => {
			const { container } = render(
				React.createElement(LoadingIndicator, { loading: true })
			);

			expect( container.querySelector('.hb-loading-indicator') ).toBeInTheDocument();
			expect( container.querySelector('.spinner') ).toBeInTheDocument();
		} );

		test( 'displays correct title in span', () => {
			const customTitle = 'テスト中...';
			const { container } = render(
				React.createElement(LoadingIndicator, {
					loading: true,
					title: customTitle
				})
			);

			const titleSpan = container.querySelector('.hb-loading-indicator-title');
			expect( titleSpan ).toBeInTheDocument();
			expect( titleSpan ).toHaveTextContent( customTitle );
		} );

		test( 'hides title when showTitle is false', () => {
			const { container } = render(
				React.createElement(LoadingIndicator, {
					loading: true,
					showTitle: false
				})
			);

			expect( container.querySelector('.hb-loading-indicator-title') ).not.toBeInTheDocument();
		} );

		test( 'applies custom size to spinner', () => {
			const customSize = 60;
			const { container } = render(
				React.createElement(LoadingIndicator, {
					loading: true,
					size: customSize
				})
			);

			const spinner = container.querySelector('.spinner');
			expect( spinner ).toHaveStyle({
				height: `${customSize}px`,
				width: `${customSize}px`
			});
		} );
	});

	test( 'component is exported correctly', () => {
		expect( LoadingIndicator ).toBeDefined();
	} );
} );
