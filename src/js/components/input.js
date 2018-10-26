/*!
 * Description
 *
 * wpdeps=vue-js
 */

/*global Vue: false*/
/*global HbComponentsInput: false*/

( function( $ ) {

  'use strict';

  Vue.component( 'hb-input', {
    template: `
      <div class="hb-input-field">
        <div class="form-row">
            <div class="form-group col-sm-10">
                
                <label class="hb-input-field-label" :for="id">
                    {{title}}
                    <a v-if="description" class="hb-input-field-tooltip tooltipped"
                       data-position="top" :title="description">
                      <i class="material-icons">help</i>
                    </a>
                </label>
                
                <input v-if="!isTextArea && editing" :id="id" :type="type" v-model="current" class="validate form-control" />
                
                <textarea v-if="isTextArea && editing" :id="id" v-model="current" :rows="rows" class="validate form-control"></textarea>
                
                <div class="hb-input-field-value" v-if="original && !editing">
                    <div v-for="line in originalLines">{{line}}</div>
                </div>
                
                <p class="hb-input-field-no-value" v-if="!original && !editing">{{noValue}}</p>
                <p class="hb-input-field-helper"></p>
            </div>
            
            <div class="form-group col-sm-2 text-right">
              <div class="switch">
                <input class="switch-input sr-only" :id="forId" type="checkbox" v-model="editing" @click="checkboxHandler">
                <label class="switch-label" :for="forId">
                  <span v-if="editing" class="switch-on">{{editingLabel}}</span>
                  <span v-else="editing" class="switch-off">{{editLabel}}</span>
                </label>
              </div>
            </div>
        </div>
      </div>
    `,
    props: {
      id: {
        type: String,
        required: true
      },
      original: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        default: ''
      },
      rows: {
        type: String,
        default: '3'
      },
      type: {
        type: String,
        default: 'text',
        validator: function( value ) {
          return -1 < [
            'text', 'password', 'email', 'number', 'url',
            'textarea', 'tel'
          ].indexOf( value );
        }
      }
    },
    computed: {
      forId: function() {
        return this.id + '::for';
      },
      editingLabel: function() {
        return HbComponentsInput.editing;
      },
      isTextArea: function() {
        return 'textarea' === this.type;
      },
      originalLines: function() {
        return this.original.split( '\n' );
      }
    },
    data: function() {
      return {
        editing: false,
        current: '',
        editingLabel: HbComponentsInput.editing,
        editLabel: HbComponentsInput.edit,
        noValue: HbComponentsInput.noValue
      };
    },

    mounted: function() {
      $( `label[for="${this.id}"] .tooltipped` ).tooltip({delay: 50});
    },

    methods: {
      checkboxHandler: function() {
        if ( ! this.editing ) {

          // Enter edit mode
          this.current = this.original;
        } else if ( this.current !== this.original ) {
          this.$emit( 'data-changed', this.current, this.id );
        }
      }
    }
  });

}( jQuery ) );
