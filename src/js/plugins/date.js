/*!
 * wpdepb=jquery
 */

/*global hoge: true*/

(function ($) {

  'use strict';

  $.extend({
    /**
     * Get last date of month
     *
     * @param {Date} date
     * @return {String}
     */
    hbGetLastDate: function(date){
      return this.hbGetLastDateOfMonth( date.getFullYear(), date.getMonth() + 1 );
    },

    /**
     * Get last date of string.
     *
     * @param {String} year
     * @param {String} month
     * @return {String}
     */
    hbGetLastDateOfMonth: function( year, month ) {
      let nextYear, nextMonth;
      if(12 == month){
        nextYear = year + 1;
        nextMonth    = 1;
      }else{
        nextYear  = year;
        nextMonth = month;
      }
      let date = new Date( nextYear, nextMonth, 0 );
      return date.getDate();
    }
  });



})(jQuery);
