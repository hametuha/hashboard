"use strict";/*!
 * Bar chart component
 *
 * wpdeps=chart-js-vue,materialize
 */
!function(t){Vue.component("hb-bar-chart",{"extends":VueChartJs.Bar,mixins:[VueChartJs.mixins.reactiveProp],props:["chartData","options"],mounted:function(){this.renderChart(this.chartData,this.options)}})}(jQuery);
//# sourceMappingURL=../map/components/bar-chart.js.map
