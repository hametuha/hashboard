/*!
 * Bar chart component
 *
 * wpdeps=chart-js-vue,materialize
 */

/*global Vue: false*/
/*global VueChartJs:false */

(function ($) {

  'use strict';

  Vue.component('hb-bar-chart', {
    extends: VueChartJs.Bar,
    mixins: [VueChartJs.mixins.reactiveProp],
    props: ['chartData', 'options'],
    mounted: function () {
      this.renderChart( this.chartData, this.options);
    }
  });

})(jQuery);
