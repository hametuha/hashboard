"use strict";/*!
 * Line chart component
 *
 * wpdeps=chart-js-vue,bootstrap
 */
!function(t){Vue.component("hb-line-chart",{"extends":VueChartJs.Line,mixins:[VueChartJs.mixins.reactiveProp],props:["chartData","options"],mounted:function(){this.renderChart(this.chartData,this.options)}})}(jQuery);
//# sourceMappingURL=../map/components/line-chart.js.map
