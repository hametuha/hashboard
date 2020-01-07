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
		listClass: {
			type: String,
			default: 'list-item hb-post-list-item',
		},
		wrapperClass: {
			type: String,
			default: '',
		},
		listWrapperClass: {
			type: String,
			default: 'list-group hb-post-list',
		},
	},
	computed: {
		wrapperClassName: function() {
			const classNames = [ 'hb-list-table position-relative' ];
			classNames.push( this.wrapperClass );
			return classNames.filter( ( className ) => !! className ).join( ' ' );
		},
	},
	methods: {
		handlePagination: function( number ) {
			this.$emit( 'page-changed', number );
		},
	},
	template: `
		<div :class="wrapperClassName">
            <slot name="header"></slot>
			<ul v-if="items.length" :class="listWrapperClass">
				<li v-for="item in items" :key="item.id" :class="listClass">
					<slot name="item" :item="item">
                        <a :href="item.link" class="hb-post-list-link">
                            <span class="hb-post-list-title">{{ item.title.rendered }}</span>
                            <span class="hb-post-list-date">{{ item.date | moment( 'll' ) }}</span>
                        </a>
					</slot>
				</li>
			</ul>
			<slot v-if="!items.length" name="empty"></slot>
			<hb-pagination v-if="! loading && totalPage > 1" :current="curPage" :total="totalPage" @page-changed="handlePagination"></hb-pagination>
			<hb-loading :loading="loading"></hb-loading>
		</div>
	`,
} );
