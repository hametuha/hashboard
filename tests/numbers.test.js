import Vue from 'vue';
import { numberFormat, moneyFormat } from '../src/js/filters/numbers';

test('Check number format', () => {
  expect(numberFormat(1000)).toBe('1,000');
  expect(numberFormat(1000000)).toBe('1,000,000');
  expect(numberFormat(100)).toBe('100');
  expect(numberFormat(1000.102)).toBe('1,000.102');
  expect(numberFormat(1000.102, false)).toBe('1,000');
  expect(numberFormat(10000000000.1)).toBe('10,000,000,000.1');
});

test('Check Money format', () => {
  expect(moneyFormat(1000, 'jpy')).toBe('¥1,000');
  expect(moneyFormat(1000000)).toBe('$1,000,000');
  expect(moneyFormat('100.00', 'eur')).toBe('€100.00');
  expect(moneyFormat(1000000, 'usd', false)).toBe('1,000,000');
});
