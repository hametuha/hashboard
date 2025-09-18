// Import from compiled assets (grab-deps output)
require('../assets/js/filters/numbers');
const { numberFormat, moneyFormat } = window.hb?.filters || {};

describe( 'Check number format', () => {
	test( 'Thousnad', () => {
		expect( numberFormat( 1000 ) ).toBe( '1,000.00' );
	} );
	test( 'Million', () => {
		expect( numberFormat( 1000000 ) ).toBe( '1,000,000.00' );
	} );
	test( 'Hundred', () => {
		expect( numberFormat( 100 ) ).toBe( '100.00' );
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
		expect( moneyFormat( 1000000 ) ).toBe( '$1,000,000.00' );
	} );
	test( 'Euro', () => {
		expect( moneyFormat( '100.00', 'eur' ) ).toBe( '€100.00' );
	} );
	test( 'Unkowwn Currency', () => {
		expect( moneyFormat( 1000000, 'unknown', '' ) ).toBe( '1,000,000.00' );
	} );
	test( 'Unkowwn Currency with prefix', () => {
		expect( moneyFormat( 10.01, 'unknown', '฿' ) ).toBe( '฿10.01' );
	} );
	test( 'Force decimal for JPY', () => {
		expect( moneyFormat( 1000.00, 'jpy', '', true ) ).toBe( '¥1,000.00' );
	} );
	test( 'Force no decimal for USD', () => {
		expect( moneyFormat( 1000.99, 'usd', '', false ) ).toBe( '$1,000' );
	} );
	test( 'Korean Won', () => {
		expect( moneyFormat( 50000, 'krw' ) ).toBe( '₩50,000' );
	} );
	test( 'Vietnamese Dong', () => {
		expect( moneyFormat( 1000000, 'vnd' ) ).toBe( '₫1,000,000' );
	} );
} );
