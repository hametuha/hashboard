/*!
 * Line chart component
 *
 * wpdeps=chart-js-vue,bootstrap
 */

/*global Vue: false*/
/*global VueChartJs: false*/

( function( $ ) {

  'use strict';

  Vue.component( 'hb-line-chart', {
    extends: VueChartJs.Line,
    mixins: [ VueChartJs.mixins.reactiveProp ],
    props: [ 'chartData', 'options' ],
    mounted: function() {
      this.renderChart( this.chartData, this.options );
    }
  });

}( jQuery ) );
