"use strict";/*!
 * Sequence for Vue.JS
 *
 * wpdeps=vue-js,bootstrap
 */
!function(){Vue.component("hb-sequence-item",{template:'\n      <li class="hb-sequence-item">\n          <a href="#" @click.prevent="selected(index)" :class="btnClass">\n            <i v-if="icon" class="material-icons">{{icon}}</i>\n            <span v-else>{{index+1}}</span>\n          </a><br />\n          <span v-if="label" class="hb-sequence-title">{{ label }}</span>\n      </li>\n    ',props:{index:{type:Number,required:!0},active:{type:Boolean,"default":!1},label:{type:String,"default":""},icon:{type:String,"default":""}},computed:{btnClass:function(){return{btn:!0,"btn-floating":!0,grey:!this.active,"lighten-2":!this.active,pulse:this.active}}},methods:{selected:function(e){this.active||this.$emit("select-index",this.index)}}}),Vue.component("hb-sequence",{template:'\n      <ul class="hb-sequence-wrapper">\n        <hb-sequence-item v-for="(step, index) in steps" :index="index" :active="active==index"\n         :icon="step.icon" :label="step.label" v-on:select-index="activate"></hb-sequence-item>\n      </ul>\n    ',props:{active:{type:Number,"default":0},steps:{type:Array,"default":[]},selectable:{type:Boolean,"default":!0}},methods:{activate:function(e){this.active=e,this.$emit("page-change",e)}}})}();
//# sourceMappingURL=../map/components/sequence.js.map
