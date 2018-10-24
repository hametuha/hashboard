/*!
 * Date range picker
 *
 * wpdeps=vue-js
 */

/*global Vue: false*/
/*global moment: false*/
/*global HbComponentsDateRange: false*/

import Datepicker from 'vuejs-datepicker';
import * as languages from "vuejs-datepicker/src/locale";

const now = new Date();

Vue.component( 'HbDateRange', {

  data: function(){
    return {
      bootstrap: true,
    };
  },

  props: {
    status: {
      type: String,
      default: 'default',
    },
    separator: {
      type: String,
      default: '〜',
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd',
    },
    start: {
      type: Date,
      default: now,
    },
    end: {
      type: Date,
      default: now,
    },
    language: {
      type: String,
      default: HbComponentsDateRange.language
    }
  },

  template: `
    <div class="hb-date-range row">
        <div class="col-1 text-right">
            <i :class="statusClass">{{statusLabel}}</i>
        </div>
        <div class="col-5">
            <datepicker :language="lang" :format="format" :bootstrap-styling="bootstrap" v-model="start" @input="testDate"></datepicker>
        </div>
        <div class="col-1 text-center">
            <span class="hb-date-range-separator">{{separator}}</span>
        </div>
        <div class="col-5">
            <datepicker :language="lang" :format="format" :bootstrap-styling="bootstrap" v-model="end" @input="testDate"></datepicker>
        </div>
    </div>
  `,

  components: {
    Datepicker
  },

  computed: {

    lang(){
      return languages[this.language];
    },

    statusLabel(){
      return this.getLabel( this.status );
    },

    statusClass(){
      return this.getClass( this.status );
    },

  },

  methods: {

    getLabel( status ) {
      return {
        error: 'error',
        success: 'done_all',
        default: 'error_outline',
      }[status];
    },

    getClass( status ) {
      const classes = ['material-icons'];
      switch ( status ) {
        case 'error':
          classes.push( 'text-danger' );
          break;
        case 'success':
          classes.push( 'text-success' );
          break;
        default:
          classes.push( 'text-muted' );
          break;
      }
      return classes;
    },

    testDate(){
      if ( this.start && this.end ) {
        if(this.start <= this.end){
          this.status = 'success';
        }else{
          this.status = 'error';
        }
      } else {
        this.status = 'default';
      }
      if ('success' === this.status) {
        this.$emit('date-changed', this.start, this.end);
      }
    },
  },

} );
