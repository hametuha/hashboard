"use strict";/*!
 * Loading indicator
 *
 * wpdeps=vue-js
 */
!function(){Vue.component("hb-loading",{template:'\n      <transition name="vanish">\n        <div class="hb-loading-indicator" v-if="loading" :title="title">\n          <img :src="src" width="100" height="100" :alt="title" />\n          <span class="hb-loading-indicator-title">{{title}}</span>\n        </div>\n      </transition>\n    ',props:{loading:!1,title:{type:String,"default":HbComponentsLoading.title}},computed:{src:function(){return HbComponentsLoading.img}}})}(jQuery);
//# sourceMappingURL=../map/components/loading.js.map
