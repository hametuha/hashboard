/**
 * Line chart component
 */

/*global Vue: false*/

(function ($) {

  'use strict';

  Vue.component('hb-line-chart', {
    extends: VueChartJs.Line,
    mixins: [VueChartJs.mixins.reactiveProp],
    props: ['chartData', 'options'],
    mounted: function () {
      this.renderChart( this.chartData, this.options);
    }
  })

})(jQuery);
