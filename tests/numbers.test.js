import Vue from 'vue';
import { numberFormat, moneyFormat } from '../src/js/filters/numbers';

describe( 'Check number format', () => {
	test( 'Thousnad', () => {
		expect( numberFormat( 1000 ) ).toBe( '1,000' );
	} );
	test( 'Million', () => {
		expect( numberFormat( 1000000 ) ).toBe( '1,000,000' );
	} );
	test( 'Hundred', () => {
		expect( numberFormat( 100 ) ).toBe( '100' );
	} );
	test( 'Float', () => {
		expect( numberFormat( 1000.102 ) ).toBe( '1,000.102' );
	} );
	test( 'Floor', () => {
		expect( numberFormat( 1000.102, false ) ).toBe( '1,000' );
	} );
	test( 'Big number', () => {
		expect( numberFormat( 10000000000.1 ) ).toBe( '10,000,000,000.1' );
	} );
} );

describe( 'Check Money format', () => {
	test( 'JPY', () => {
		expect( moneyFormat( 1000, 'jpy' ) ).toBe( '¥1,000' );
	} );
	test( 'USD', () => {
		expect( moneyFormat( 1000000 ) ).toBe( '$1,000,000' );
	} );
	test( 'Euro', () => {
		expect( moneyFormat( '100.00', 'eur' ) ).toBe( '€100.00' );
	} );
	test( 'No prefix.', () => {
		expect( moneyFormat( 1000000, 'usd', false ) ).toBe( '1,000,000' );
	} );
} );
