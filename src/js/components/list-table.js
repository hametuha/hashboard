/*!
 * List table with pagination and search.
 *
 * wpdeps=vue-js,hb-components-loading,hashboard, hb-components-pagination, hb-filters-moment
 */

Vue.component( 'hb-list-table', {

	props: {
		loading: {
			type: Boolean,
			default: false,
		},
		items: {
			type: Array,
			default: [],
		},
		curPage: {
			type: Number,
			default: 1,
		},
		totalPage: {
			type: Number,
			default: 1,
		},
	},
	methods: {
		handlePagination: function( number ) {
			this.$emit( 'page-changed', number );
		},
	},
	template: `
		<div class="hb-list-table position-relative">
            <slot name="header"></slot>
			<ul v-if="items.length" class="list-group hb-post-list">
				<li v-for="item in items" :key="item.id" class="list-item hb-post-list-item">
					<slot name="item" :item="item">
                        <a :href="item.link" class="hb-post-list-link">
                            <span class="hb-post-list-title">{{ item.title.rendered }}</span>
                            <span class="hb-post-list-date">{{ item.date | moment( 'll' ) }}</span>
                        </a>
					</slot>
				</li>
			</ul>
			<hb-pagination :current="curPage" :total="totalPage" @page-changed="handlePagination"></hb-pagination>
			<hb-loading :loading="loading"></hb-loading>
		</div>
	`,
} );
