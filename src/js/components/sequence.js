/*!
 * Sequence for Vue.JS
 *
 * wpdeps=vue-js,materialize
 */

/*global Vue: false*/

(function(){

  'use strict';

  Vue.component( 'hb-sequence-item', {
    template: `
      <li class="hb-sequence-item">
          <a href="#" @click.prevent="selected(index)" :class="btnClass">
            <i v-if="icon" class="material-icons">{{icon}}</i>
            <span v-else>{{index+1}}</span>
          </a><br />
          <span v-if="label" class="hb-sequence-title">{{ label }}</span>
      </li>
    `,
    props: {
      index: {
        type: Number,
        required: true,
      },
      active: {
        type: Boolean,
        default: false,
      },
      label: {
        type: String,
        default: '',
      },
      icon: {
        type: String,
        default: '',
      }
    },
    computed: {
      btnClass: function(){
        return {
          btn: true,
          'btn-floating': true,
          grey: ! this.active,
          'lighten-2': ! this.active,
          pulse: this.active,
        };
      }
    },
    methods: {
        selected: function(number){
          if(!this.active){
            this.$emit('select-index', this.index);
          }
        }
    }
  } );

  Vue.component('hb-sequence', {

    template: `
      <ul class="hb-sequence-wrapper">
        <hb-sequence-item v-for="(step, index) in steps" :index="index" :active="active==index"
         :icon="step.icon" :label="step.label" v-on:select-index="activate"></hb-sequence-item>
      </ul>
    `,

    props: {
      active: {
        type: Number,
        default: 0
      },
      steps: {
        type: Array,
        default: [],
      },
      selectable: {
        type: Boolean,
        default: true,
      }
    },
    methods: {
      activate: function(number){
        this.active = number;
        this.$emit('page-change', number);
      }
    }
  });

})();