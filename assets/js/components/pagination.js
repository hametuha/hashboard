"use strict";/*!
 * Pagination for Vue.JS
 *
 * wpdeps=vue-js,bootstrap
 */
!function(){Vue.component("hb-pagination-button",{template:'<li v-bind:class="className"><a class="page-link" href="#" v-on:click.stop.prevent="clickHandler" v-html="icon" ></a></li>',props:{number:Number,current:{type:Boolean,"default":!1},label:{type:String,"default":""},disabled:{type:Boolean,"default":!1}},computed:{icon:function(){switch(this.label){case"right":case"left":return'<i class="material-icons">chevron_'+this.label+"</i>";case"more_horiz":return'<i class="material-icons">'+this.label+"</i>";default:return this.number}},className:function(){return{"page-item":!0,disabled:this.disabled,active:this.current}}},methods:{clickHandler:function(){this.disabled||this.current||this.$emit("paginated",this.number)}}}),Vue.component("hb-pagination",{template:'<ul :class="this.className"><hb-pagination-button :disabled="!hasPrev" label="left" number="1" v-on:paginated="paginated"></hb-pagination-button><hb-pagination-button v-if="needLeft" disabled=true number="1" label="more_horiz"></hb-pagination-button><hb-pagination-button v-for="n in range" :number="n" :current="n==current" v-on:paginated="paginated"></hb-pagination-button><hb-pagination-button v-if="needRight" disabled=true :number="total" label="more_horiz"></hb-pagination-button><hb-pagination-button :disabled="!hasNext" label="right" :number="total" v-on:paginated="paginated"></hb-pagination-button></ul>',props:{total:{type:Number,required:!0},current:{type:Number,required:!0},max:{type:Number,"default":5},align:{type:String,"default":"center"}},computed:{hasPrev:function(){return this.leftPad>1},hasNext:function(){return this.rightPad<this.total},pad:function(){return Math.floor((this.max-1)/2)},leftPad:function(){return Math.max(this.current-this.pad,1)},rightPad:function(){return Math.min(this.current+this.pad,this.total)},needLeft:function(){return this.leftPad>2},needRight:function(){return this.rightPad<this.total-1},range:function t(){for(var t=[],e=this.leftPad,n=this.rightPad;e<=n;e++)t.push(e);return t},className:function(){return{pagination:!0,"justify-content-center":"center"===this.align}}},methods:{paginated:function(t){this.$emit("pageChanged",t)}}})}();
//# sourceMappingURL=../map/components/pagination.js.map