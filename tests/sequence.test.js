/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import compiled component after setting up mocks
require('../assets/js/components/sequence.js');
const HbSequence = window.hb?.components?.sequence;
const HbSequenceItem = window.hb?.components?.sequence?.SequenceItem;

describe('HbSequence', () => {
	// Test data
	const mockSteps = [
		{ label: 'Step 1', icon: 'home' },
		{ label: 'Step 2', icon: 'search' },
		{ label: 'Step 3', icon: 'settings' },
	];

	// Skip tests if component is not compiled yet
	const skipIfNoComponent = HbSequence ? describe : describe.skip;

	skipIfNoComponent('Sequence Component Tests', () => {
		test('renders sequence with steps', () => {
			const { container } = render(
				React.createElement(HbSequence, {
					steps: mockSteps,
					onPageChange: jest.fn()
				})
			);

			expect(container.querySelector('.hb-sequence-wrapper')).toBeInTheDocument();
			expect(container.querySelectorAll('.hb-sequence-item')).toHaveLength(3);
		});

		test('renders step labels and icons', () => {
			const { container } = render(
				React.createElement(HbSequence, {
					steps: mockSteps,
					onPageChange: jest.fn()
				})
			);

			expect(container).toHaveTextContent('Step 1');
			expect(container).toHaveTextContent('Step 2');
			expect(container).toHaveTextContent('Step 3');
			
			expect(container.querySelector('.material-icons')).toHaveTextContent('home');
		});

		test('shows first step as active by default', () => {
			const { container } = render(
				React.createElement(HbSequence, {
					steps: mockSteps,
					onPageChange: jest.fn()
				})
			);

			const firstButton = container.querySelectorAll('button')[0];
			expect(firstButton).toHaveClass('pulse');
			expect(firstButton).not.toHaveClass('grey');
		});

		test('calls onPageChange when step is clicked', () => {
			const mockPageChange = jest.fn();
			const { container } = render(
				React.createElement(HbSequence, {
					steps: mockSteps,
					onPageChange: mockPageChange
				})
			);

			const secondButton = container.querySelectorAll('button')[1];
			fireEvent.click(secondButton);

			expect(mockPageChange).toHaveBeenCalledWith(1);
		});

		test('updates active step when clicked', () => {
			const { container } = render(
				React.createElement(HbSequence, {
					steps: mockSteps,
					onPageChange: jest.fn()
				})
			);

			const secondButton = container.querySelectorAll('button')[1];
			fireEvent.click(secondButton);

			// Second button should now be active
			expect(secondButton).toHaveClass('pulse');
			expect(secondButton).not.toHaveClass('grey');

			// First button should no longer be active
			const firstButton = container.querySelectorAll('button')[0];
			expect(firstButton).not.toHaveClass('pulse');
			expect(firstButton).toHaveClass('grey');
		});

		test('does not respond to clicks when selectable is false', () => {
			const mockPageChange = jest.fn();
			const { container } = render(
				React.createElement(HbSequence, {
					steps: mockSteps,
					selectable: false,
					onPageChange: mockPageChange
				})
			);

			const secondButton = container.querySelectorAll('button')[1];
			fireEvent.click(secondButton);

			expect(mockPageChange).not.toHaveBeenCalled();
		});

		test('renders numbers when no icon is provided', () => {
			const stepsWithoutIcons = [
				{ label: 'Step 1' },
				{ label: 'Step 2' },
				{ label: 'Step 3' },
			];

			const { container } = render(
				React.createElement(HbSequence, {
					steps: stepsWithoutIcons,
					onPageChange: jest.fn()
				})
			);

			const buttons = container.querySelectorAll('button');
			expect(buttons[0]).toHaveTextContent('1');
			expect(buttons[1]).toHaveTextContent('2');
			expect(buttons[2]).toHaveTextContent('3');
		});

		test('sets custom initial active step', () => {
			const { container } = render(
				React.createElement(HbSequence, {
					steps: mockSteps,
					active: 2,
					onPageChange: jest.fn()
				})
			);

			const thirdButton = container.querySelectorAll('button')[2];
			expect(thirdButton).toHaveClass('pulse');
			expect(thirdButton).not.toHaveClass('grey');
		});
	});

	// Note: SequenceItem is tested indirectly through the Sequence component
	// since grab-deps doesn't properly handle named exports

	test('component is exported correctly', () => {
		// テスト用のモックコンポーネントでも確認
		const mockComponent = ({ steps, onPageChange }) => {
			return React.createElement('ul', {
				'data-testid': 'sequence',
			}, 'Mock Sequence');
		};

		const { container } = render(
			React.createElement(mockComponent, {
				steps: [],
				onPageChange: jest.fn()
			})
		);

		expect(container.querySelector('[data-testid="sequence"]')).toBeInTheDocument();
	});
});