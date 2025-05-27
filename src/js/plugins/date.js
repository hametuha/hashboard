/*!
 * wpdepb=jquery
 */

/*global hoge: true*/

( function( $ ) {
	'use strict';

	$.extend( {

		/**
		 * Get last date of month
		 *
		 * @param {Date} date
		 * @return {string}
		 */
		hbGetLastDate: function( date ) {
			return this.hbGetLastDateOfMonth( date.getFullYear(), date.getMonth() + 1 );
		},

		/**
		 * Get last date of string.
		 *
		 * @param {string} year
		 * @param {string} month
		 * @return {string}
		 */
		hbGetLastDateOfMonth: function( year, month ) {
			let nextYear, nextMonth;
			if ( 12 == month ) {
				nextYear = year + 1;
				nextMonth = 1;
			} else {
				nextYear = year;
				nextMonth = month;
			}
			const date = new Date( nextYear, nextMonth, 0 );
			return date.getDate();
		},
	} );
}( jQuery ) );
