/*!
 * Date utility functions
 */

// 内部で使用する関数オブジェクト（thisの参照問題を解決するため）
const dateUtils = {
	// 月の最終日を取得
	getLastDate: function( date ) {
		return this.getLastDateOfMonth( date.getFullYear(), date.getMonth() + 1 );
	},

	// 指定された年月の最終日を取得
	getLastDateOfMonth: function( year, month ) {
		let nextYear, nextMonth;
		if ( 12 === month ) {
			nextYear = year + 1;
			nextMonth = 1;
		} else {
			nextYear = year;
			nextMonth = month + 1;
		}
		const date = new Date( nextYear, nextMonth - 1, 0 );
		return date.getDate();
	},
};

// エクスポート用の関数（thisを正しく束縛）
export const getLastDate = function( date ) {
	return dateUtils.getLastDate.call( dateUtils, date );
};

export const getLastDateOfMonth = function( year, month ) {
	return dateUtils.getLastDateOfMonth.call( dateUtils, year, month );
};
