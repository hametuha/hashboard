/*!
 * Pagination for Vue.JS
 *
 * wpdeps=vue-js,bootstrap
 */

/*global Vue: false*/

( function() {

  'use strict';

  Vue.component( 'hb-pagination-button', {
    template: '<li v-bind:class="className"><a class="page-link" href="#" v-on:click.stop.prevent="clickHandler" v-html="icon" ></a></li>',
    props: {
      number: Number,
      current: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      icon: function() {
        switch ( this.label ) {
          case 'right':
          case 'left':
            return '<i class="material-icons">chevron_' + this.label + '</i>';
          case 'more_horiz':
            return '<i class="material-icons">' + this.label + '</i>';
          default:
            return this.number;
        }
      },
      className: function() {
        return {
          'page-item': true,
          disabled: this.disabled,
          active: this.current
        };
     }
    },
    methods: {
      clickHandler: function() {
        if ( ! this.disabled && ! this.current ) {
          this.$emit( 'paginated', this.number );
        }
      }
    }
  });

  Vue.component( 'hb-pagination', {
    template: '<ul :class="this.className">' +
                '<hb-pagination-button :disabled="!hasPrev" label="left" number="1" v-on:paginated="paginated"></hb-pagination-button>' +
                '<hb-pagination-button v-if="needLeft" disabled=true number="1" label="more_horiz"></hb-pagination-button>' +
                '<hb-pagination-button v-for="n in range" :number="n" :current="n==current" v-on:paginated="paginated"></hb-pagination-button>' +
                '<hb-pagination-button v-if="needRight" disabled=true :number="total" label="more_horiz"></hb-pagination-button>' +
                '<hb-pagination-button :disabled="!hasNext" label="right" :number="total" v-on:paginated="paginated"></hb-pagination-button>' +
              '</ul>',
    props: {
      total: {
        type: Number,
        required: true
      },
      current: {
        type: Number,
        required: true
      },
      max: {
        type: Number,
        default: 5
      },
      align: {
        type: String,
        default: 'center'
      }
    },
    computed: {
      hasPrev: function() {
        return 1 < this.leftPad;
      },
      hasNext: function() {
        return this.rightPad < this.total;
      },
      pad: function() {
        return Math.floor( ( this.max - 1 ) / 2 );
      },
      leftPad: function() {
        return Math.max( this.current - this.pad, 1 );
      },
      rightPad: function() {
        return Math.min( this.current + this.pad, this.total );
      },
      needLeft: function() {
        return 2 < this.leftPad;
      },
      needRight: function() {
        return this.rightPad < ( this.total - 1 );
      },
      range: function() {
        let range = [];
        for ( let i = this.leftPad, l = this.rightPad; i <= l; i++ ) {
          range.push( i );
        }
        return range;
      },
      className: function() {
        return {
          pagination: true,
          'justify-content-center': 'center' === this.align
        };
      }
    },
    methods: {
      paginated: function( number ) {
        alert(number);
        this.$emit( 'page-changed', number );
      }
    }
  });
}() );
