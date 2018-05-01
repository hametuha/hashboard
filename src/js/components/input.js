/*!
 * Description
 *
 * wpdeps=vue-js
 */

/*global Vue: false*/
/*global HbComponentsInput: false*/

(function ($) {

  'use strict';

  Vue.component('hb-input', {
    template: `
      <div class="hb-input-field">
        <div class="row">
            <div class="col s10">
                <label :for="id">
                    {{title}}
                    <a v-if="description" class="hb-input-field-tooltip tooltipped"
                       data-position="top" :data-tooltip="description">
                      <i class="material-icons">help</i>
                    </a>
                </label>
                
                <input v-if="!isTextArea && editing" :id="id" :type="type" v-model="current" class="validate" />
                
                <textarea v-if="isTextArea && editing" :id="id" v-model="current" class="validate materialize-textarea"></textarea>
                
                <div class="hb-input-field-value" v-if="original && !editing">
                    <div v-for="line in originalLines">{{line}}</div>
                </div>
                <p class="hb-input-field-no-value" v-if="!original && !editing">{{noValue}}</p>
                <p class="hb-input-field-helper"></p>
            </div>
            <div class="col s2">
              <div class="switch">
               <label>
                 <input type="checkbox" v-model="editing" @click="checkboxHandler">
                 <span class="lever"></span>
                 <span v-if="editing">{{editingLabel}}</span>
                 <span v-else="editing">{{editLabel}}</span>
               </label>
              </div>
            </div>
        </div>
      </div>
    `,
    props: {
      id: {
        type: String,
        required: true,
      },
      original: {
        type: String,
        default: "",
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default: ""
      },
      type: {
        type: String,
        default: "text",
        validator: function (value) {
          return -1 < [
            'text', 'password', 'email', 'number', 'url',
            'textarea', 'tel',
          ].indexOf(value);
        }
      },
    },
    computed: {
      editingLabel: function() {
        return HbComponentsInput.editing;
      },
      isTextArea: function(){
        return this.type === 'textarea';
      },
      originalLines: function(){
        return this.original.split("\n");
      },
    },
    data: function(){
      return {
        editing: false,
        current: "",
        editingLabel: HbComponentsInput.editing,
        editLabel: HbComponentsInput.edit,
        noValue: HbComponentsInput.noValue,
      };
    },

    mounted: function(){
      $(`label[for="${this.id}"] .tooltipped`).tooltip({delay: 50});
    },

    methods: {

      checkboxHandler: function(){
        if(this.editing){
          // Enter edit mode
          this.current = this.original;
        }else if(this.current !== this.original){
          this.$emit('data-changed', this.current, this.id);
        }
      },

      enterEditing: function() {
        this.editing = true;
        this.current = this.original;
        this.$emit('enter-edit');
      },

      finishEditing: function(){
        this.editing  = false;
        this.original = this.current;
        this.$emit('finish-edit', this.original);
      }
    }
  });


})(jQuery);
