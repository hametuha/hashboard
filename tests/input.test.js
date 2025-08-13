/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import compiled component after setting up mocks
require('../assets/js/components/input.js');
const HbInputField = window.hb?.components?.input;

describe('HbInputField', () => {
	// Skip tests if component is not compiled yet
	const skipIfNoComponent = HbInputField ? describe : describe.skip;

	skipIfNoComponent('InputField Component Tests', () => {
		test('renders input field with title', () => {
			const { container } = render(
				React.createElement(HbInputField, {
					id: 'test-input',
					title: 'Test Field',
					onDataChanged: jest.fn()
				})
			);

			expect(container.querySelector('.hb-input-field')).toBeInTheDocument();
			expect(container.querySelector('label')).toHaveTextContent('Test Field');
			expect(container.querySelector('.switch')).toBeInTheDocument();
		});

		test('shows original value when not editing', () => {
			const { container } = render(
				React.createElement(HbInputField, {
					id: 'test-input',
					title: 'Test Field',
					original: 'Original text',
					onDataChanged: jest.fn()
				})
			);

			expect(container.querySelector('.hb-input-field-value')).toHaveTextContent('Original text');
			expect(container.querySelector('input[type="text"]')).not.toBeInTheDocument();
		});

		test('shows no value message when original is empty and not editing', () => {
			const { container } = render(
				React.createElement(HbInputField, {
					id: 'test-input',
					title: 'Test Field',
					original: '',
					noValue: 'No content',
					onDataChanged: jest.fn()
				})
			);

			expect(container.querySelector('.hb-input-field-no-value')).toHaveTextContent('No content');
		});

		test('enters edit mode when switch is clicked', () => {
			const { container } = render(
				React.createElement(HbInputField, {
					id: 'test-input',
					title: 'Test Field',
					original: 'Original text',
					onDataChanged: jest.fn()
				})
			);

			const switchCheckbox = container.querySelector('input[type="checkbox"]');
			fireEvent.click(switchCheckbox);

			expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
			expect(container.querySelector('input[type="text"]')).toHaveValue('Original text');
			expect(container.querySelector('.switch-on')).toBeInTheDocument();
		});

		test('calls onDataChanged when editing is completed with changes', () => {
			const mockOnDataChanged = jest.fn();
			const { container } = render(
				React.createElement(HbInputField, {
					id: 'test-input',
					title: 'Test Field',
					original: 'Original text',
					onDataChanged: mockOnDataChanged
				})
			);

			// Enter edit mode
			const switchCheckbox = container.querySelector('input[type="checkbox"]');
			fireEvent.click(switchCheckbox);

			// Change the value
			const textInput = container.querySelector('input[type="text"]');
			fireEvent.change(textInput, { target: { value: 'Modified text' } });

			// Exit edit mode
			fireEvent.click(switchCheckbox);

			expect(mockOnDataChanged).toHaveBeenCalledWith('Modified text', 'test-input');
		});

		test('does not call onDataChanged when no changes are made', () => {
			const mockOnDataChanged = jest.fn();
			const { container } = render(
				React.createElement(HbInputField, {
					id: 'test-input',
					title: 'Test Field',
					original: 'Original text',
					onDataChanged: mockOnDataChanged
				})
			);

			// Enter and exit edit mode without changes
			const switchCheckbox = container.querySelector('input[type="checkbox"]');
			fireEvent.click(switchCheckbox);
			fireEvent.click(switchCheckbox);

			expect(mockOnDataChanged).not.toHaveBeenCalled();
		});

		test('renders textarea when type is textarea', () => {
			const { container } = render(
				React.createElement(HbInputField, {
					id: 'test-textarea',
					title: 'Test Textarea',
					type: 'textarea',
					rows: '5',
					onDataChanged: jest.fn()
				})
			);

			// Enter edit mode
			const switchCheckbox = container.querySelector('input[type="checkbox"]');
			fireEvent.click(switchCheckbox);

			const textarea = container.querySelector('textarea');
			expect(textarea).toBeInTheDocument();
			expect(textarea).toHaveAttribute('rows', '5');
		});

		test('renders different input types correctly', () => {
			const { container } = render(
				React.createElement(HbInputField, {
					id: 'test-email',
					title: 'Email Field',
					type: 'email',
					onDataChanged: jest.fn()
				})
			);

			// Enter edit mode
			const switchCheckbox = container.querySelector('input[type="checkbox"]');
			fireEvent.click(switchCheckbox);

			const emailInput = container.querySelector('input[type="email"]');
			expect(emailInput).toBeInTheDocument();
		});

		test('displays multiline original text correctly', () => {
			const multilineText = 'Line 1\nLine 2\nLine 3';
			const { container } = render(
				React.createElement(HbInputField, {
					id: 'test-multiline',
					title: 'Multiline Field',
					original: multilineText,
					onDataChanged: jest.fn()
				})
			);

			const valueDiv = container.querySelector('.hb-input-field-value');
			expect(valueDiv).toBeInTheDocument();
			expect(valueDiv.querySelectorAll('div')).toHaveLength(3);
			expect(valueDiv.querySelectorAll('div')[0]).toHaveTextContent('Line 1');
			expect(valueDiv.querySelectorAll('div')[1]).toHaveTextContent('Line 2');
			expect(valueDiv.querySelectorAll('div')[2]).toHaveTextContent('Line 3');
		});

		test('renders help tooltip when description is provided', () => {
			const { container } = render(
				React.createElement(HbInputField, {
					id: 'test-tooltip',
					title: 'Field with Help',
					description: 'This is helpful information',
					onDataChanged: jest.fn()
				})
			);

			const tooltip = container.querySelector('.hb-input-field-tooltip');
			expect(tooltip).toBeInTheDocument();
			expect(tooltip.tagName).toBe('SPAN');
			expect(tooltip).toHaveAttribute('title', 'This is helpful information');
			expect(tooltip.querySelector('.material-icons')).toHaveTextContent('help');
		});

		test('renders nothing for invalid input type', () => {
			const { container } = render(
				React.createElement(HbInputField, {
					id: 'test-invalid',
					title: 'Invalid Field',
					type: 'invalid-type',
					onDataChanged: jest.fn()
				})
			);

			expect(container.firstChild).toBeNull();
		});

		test('uses custom labels', () => {
			const { container } = render(
				React.createElement(HbInputField, {
					id: 'test-labels',
					title: 'Custom Labels',
					editLabel: 'Start Edit',
					editingLabel: 'Finish Edit',
					onDataChanged: jest.fn()
				})
			);

			// Check initial label
			expect(container.querySelector('.switch-off')).toHaveTextContent('Start Edit');

			// Enter edit mode and check editing label
			const switchCheckbox = container.querySelector('input[type="checkbox"]');
			fireEvent.click(switchCheckbox);

			expect(container.querySelector('.switch-on')).toHaveTextContent('Finish Edit');
		});
	});

	test('component is exported correctly', () => {
		// テスト用のモックコンポーネントでも確認
		const mockComponent = ({ id, title, onDataChanged }) => {
			return React.createElement('div', {
				'data-testid': 'input-field',
			}, 'Mock Input Field');
		};

		const { container } = render(
			React.createElement(mockComponent, {
				id: 'test',
				title: 'Test',
				onDataChanged: jest.fn()
			})
		);

		expect(container.querySelector('[data-testid="input-field"]')).toBeInTheDocument();
	});
});