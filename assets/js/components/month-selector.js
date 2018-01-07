/*!
 * Month selector
 *
 * wpdeps=vue-js,materialize
 */
!function(e){"use strict";Vue.component("hb-month-selector",{template:'<div class="hb-month-selector row"><div class="col s2"><p>{{label}}</p></div><div class="col s4"><select class="browser-default" v-model="curYear"><option v-for="year in years" :value="year.value">{{year.label}}</option></select></div><div class="col s4"><select class="browser-default" v-model="curMonth"><option v-for="(label, value) in month" :value="value+1" :key="value">{{label}}</option></select></div><div class="col s2"><button type="button" class="waves-effect waves-grey btn-flat" v-on:click="updateYearMonth">{{updateLabel}}</button></div></div>',props:{label:{type:String,required:!0},maxYear:{type:Number,"default":function(){return(new Date).getFullYear()}},minYear:{type:Number,"default":function(){return(new Date).getFullYear()-10}},curMonth:{type:Number,"default":function(){return(new Date).getMonth()+1}},curYear:{type:Number,"default":function(){return(new Date).getFullYear()}}},computed:{month:function(){return HbComponentsMonthSelector.month},years:function(){for(var e=[],t=this.maxYear;t>=this.minYear;)e.push({value:t,label:t+HbComponentsMonthSelector.yearSuffix}),t--;return e},updateLabel:function(){return HbComponentsMonthSelector.update}},mounted:function(){},methods:{updateYearMonth:function(){this.$emit("date-updated",this.curYear,("0"+this.curMonth).slice(-2))}}})}(jQuery);
//# sourceMappingURL=../map/components/month-selector.js.map
