import Vue from 'vue';
import { momentize } from '../src/js/filters/moment';

global.moment = require( '../node_modules/moment/moment' );

describe( 'Check Date formatter:', () => {
	test( 'Datetime format', () => {
		expect( momentize( '2018-09-30 20:30:00', 'lll', 'en' ) ).toBe( 'Sep 30, 2018 8:30 PM' );
	} );
	test( 'Date format.', () => {
		expect( momentize( '2018-09-30 20:30:00', 'll', 'en' ) ).toBe( 'Sep 30, 2018' );
	} );
	test( 'Japanese format.', () => {
		expect( momentize( '2018-09-30 20:30:00', 'lll', 'ja' ) ).toBe( '2018年9月30日 20:30' );
	} );
} );
