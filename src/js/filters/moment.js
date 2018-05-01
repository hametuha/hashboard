/*!
 * wpdeps=vue-js,moment
 */

/* global HbFiltersMoment: false*/

(function(){

  'use strict';

  Vue.filter('moment', function(value, format='lll', locale=false){
    if(!locale){
      locale = HbFiltersMoment.locale;
    }
    moment.locale(locale);
    return moment(value).format(format);
  });

})();
