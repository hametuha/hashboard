"use strict";/*!
 * wpdeps=vue-js,moment
 */
!function(){Vue.filter("moment",function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"lll",l=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return l||(l=HbFiltersMoment.locale),moment.locale(l),moment(t).format(e)})}();
//# sourceMappingURL=../map/filters/moment.js.map
