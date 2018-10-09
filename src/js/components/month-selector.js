/*!
 * Month selector
 *
 * wpdeps=vue-js,bootstrap
 */


/*global Vue: true*/
/*global HbComponentsMonthSelector*/

( function() {

  'use strict';

  Vue.component( 'hb-month-selector', {
    template: `
      <div class="hb-month-selector form-row" :title="label">
        <div class="form-group col">
          <select class="form-control" v-model="curYear">
            <option v-for="year in years" :value="year.value">{{year.label}}</option>
          </select>
          </div>
        <div class="form-group col">
          <select class="form-control" v-model="curMonth">
            <option v-for="(label, value) in month" :value="value+1" :key="value">{{label}}</option>
          </select>
        </div>
        <div class="form-group col">
          <button type="button" class="btn btn-secondary ripple" v-on:click="updateYearMonth">
            {{updateLabel}}
          </button>
        </div>
      </div>`,
    props: {
      label: {
        type: String,
        required: true
      },
      maxYear: {
        type: Number,
        default: function() {
          return new Date().getFullYear();
        }
      },
      minYear: {
        type: Number,
        default: function() {
          return new Date().getFullYear() - 10;
        }
      },
      curMonth: {
        type: Number,
        default: function() {
          return new Date().getMonth() + 1;
        }
      },
      curYear: {
        type: Number,
        default: function() {
          return new Date().getFullYear();
        }
      }
    },
    computed: {
      month: function() {
        return HbComponentsMonthSelector.month;
      },
      years: function() {
        var range = [];
        var year = this.maxYear;
        while ( year >= this.minYear ) {
          range.push({
            value: year,
            label: year + HbComponentsMonthSelector.yearSuffix
          });
          year--;
        }
        return range;
      },
      updateLabel: function() {
        return HbComponentsMonthSelector.update;
      }
    },
    mounted: function() {

        // console.log(this.curMonth, this.curYear);
    },
    methods: {
      updateYearMonth: function() {
        this.$emit( 'date-updated', this.curYear.toString(), ( '0' + this.curMonth ).slice( -2 ) );
      }
    }
  });

}() );
