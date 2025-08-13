/**
 * Test for date.js
 */

/* eslint-env jest */

// ESモジュールとしてインポート
import { getLastDate, getLastDateOfMonth } from '../src/js/plugins/date';

describe( 'Date Utilities', () => {
	describe( 'getLastDateOfMonth', () => {
		test( 'returns 31 for January', () => {
			expect( getLastDateOfMonth( 2025, 1 ) ).toBe( 31 );
		} );

		test( 'returns 28 for February in non-leap year', () => {
			expect( getLastDateOfMonth( 2025, 2 ) ).toBe( 28 );
		} );

		test( 'returns 29 for February in leap year', () => {
			expect( getLastDateOfMonth( 2024, 2 ) ).toBe( 29 );
		} );

		test( 'returns 30 for April', () => {
			expect( getLastDateOfMonth( 2025, 4 ) ).toBe( 30 );
		} );

		test( 'returns 31 for December', () => {
			expect( getLastDateOfMonth( 2025, 12 ) ).toBe( 31 );
		} );
	} );

	describe( 'getLastDate', () => {
		test( 'returns correct last date for a given Date object', () => {
			const date = new Date( 2025, 0, 15 ); // January 15, 2025
			expect( getLastDate( date ) ).toBe( 31 );
		} );

		test( 'returns correct last date for February in leap year', () => {
			const date = new Date( 2024, 1, 15 ); // February 15, 2024 (leap year)
			expect( getLastDate( date ) ).toBe( 29 );
		} );

		test( 'returns correct last date for February in non-leap year', () => {
			const date = new Date( 2025, 1, 15 ); // February 15, 2025 (non-leap year)
			expect( getLastDate( date ) ).toBe( 28 );
		} );

		test( 'returns correct last date for April', () => {
			const date = new Date( 2025, 3, 15 ); // April 15, 2025
			expect( getLastDate( date ) ).toBe( 30 );
		} );

		test( 'returns correct last date for December', () => {
			const date = new Date( 2025, 11, 15 ); // December 15, 2025
			expect( getLastDate( date ) ).toBe( 31 );
		} );
	} );
} );
