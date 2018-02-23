/*!
 * Loading indicator
 *
 * wpdeps=vue-js
 */

/*global Vue: false*/
/*global HbComponentsLoading: false*/

(function () {

  'use strict';

  Vue.component('hb-loading', {
    template: `
      <transition name="vanish">
        <div class="hb-loading-indicator" v-if="loading" :title="title">
          <img :src="src" width="100" height="100" :alt="title" />
          <span class="hb-loading-indicator-title">{{title}}</span>
        </div>
      </transition>
    `,
    props: {
      loading: false,
      title: {
        type: String,
        default: HbComponentsLoading.title
      }
    },
    computed: {
      src: function(){
        return HbComponentsLoading.img;
      }
    }
  });

})(jQuery);
