/*!
 * Date range picker
 *
 * wpdeps=hb-components-date-range,moment
 */

/*global Vue: false*/
/*global moment: false*/
/*global HbComponentsPeriodPicker: false*/

Vue.component( 'HbPeriodPicker', {

  data: function() {
    return {
      customLabel: HbComponentsPeriodPicker.custom,
      customizing: false
    };
  },

  props: {
    mode: {
      type: String,
      default: 7
    },
    allowCustom: {
      type: Boolean,
      default: true
    }
  },

  template: `
      <div class="hb-period">
        <span v-for="button, index in buttons" class="hb-radio hb-radio-sm">
            <input type="radio" :id="'hb-date-range-' + id + '-' +index" :name="'hb-date-range-' + id" 
                :value="button.value" v-model="mode" @change="changeHandler" />
            <label class="hb-radio-label" :for="'hb-date-range-' + id + '-' +index">
                <i class="material-icons">check</i> {{button.label}}
            </label>
        </span>
        <span v-if="allowCustom" class="hb-radio hb-radio-sm">
            <input type="radio" :id="'hb-date-range-' + id + '-custom'" :name="'hb-date-range-' + id" 
                value="custom" v-model="mode" @change="changeHandler" />
            <label class="hb-radio-label" :for="'hb-date-range-' + id + '-custom'">
                <i class="material-icons">check</i> {{customLabel}}
            </label>
        </span>
        <div class="hb-period-dates" :style="style">
            <hb-date-range @date-changed="datePickerHandler"></hb-date-range>
        </divc>
      </div>
  `,

  computed: {
    buttons() {
      return HbComponentsPeriodPicker.default;
    },
    id() {
      return this._uid;
    },
    style() {
      return {
        opacity: this.customizing && this.allowCustom ? 1 : 0
      };
    }
  },

  mounted() {
    const now = this.calculate( 7 );
    this.$emit( 'date-start', now[0], now[1]);
  },

  methods: {

    calculate( days ) {
      let start;
      let now = new Date();
      switch ( days ) {
        case 'qtr':
          const month = Math.floor( now.getMonth() / 3 ) * 3 + 1;
          start = moment([ now.getFullYear(), `0${month}`.slice( -2 ), '01' ].join( '-' ) ).toDate();
          break;
        default:
          start = moment().subtract( days, 'days' ).toDate();
          break;
      }
      return [ start, now ];
    },

    changeHandler() {
      switch ( this.mode ) {
        case 'custom':
          this.customizing = true;
          break;
        default:
          this.customizing = false;
          const calculated = this.calculate( this.mode );
          this.$emit( 'date-changed', calculated[0], calculated[1]);
          break;
      }
    },

    datePickerHandler( start, end ) {
      this.$emit( 'date-changed', start, end );
    }
  }

});
