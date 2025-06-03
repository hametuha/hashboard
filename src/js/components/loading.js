/*!
 * Loading indicator
 *
 * @deps vue-js
 */

/*global HbComponentsLoading: false*/

Vue.component( 'hb-loading', {
	template: `
        <transition name="vanish">
            <div class="hb-loading-indicator" v-if="loading" :title="title">
                <img :src="src" width="100" height="100" :alt="title"/>
                <span class="hb-loading-indicator-title">{{title}}</span>
            </div>
        </transition>
	`,
	props: {
		loading: false,
		title: {
			type: String,
			default: HbComponentsLoading.title,
		},
	},
	mounted: function() {
		this.$parent.$el.setAttribute( 'data-loading-wrapper', 'true' );
	},
	computed: {
		src: function() {
			return HbComponentsLoading.img;
		},
	},
} );
