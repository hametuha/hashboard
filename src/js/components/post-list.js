/*!
 * List of posts.
 *
 * wpdeps=vue-js,hb-components-loading,hashboard, hb-filters-moment, hb-components-list-table
 */

/*global moment: false*/

const $ = jQuery;

Vue.component( 'hb-post-list', {
	data: function() {
		return {
			loading: true,
			posts: [],
		};
	},

	props: {
		title: {
			type: String,
			default: '',
		},
		postType: {
			type: String,
			default: 'post',
		},
		moreButton: {
			type: String,
			default: '',
		},
		moreLabel: {
			type: String,
			default: 'READ MORE',
		},
		new: {
			type: String,
			default: '0',
		},
		max: {
			type: String,
			default: '3',
		},
		author: {
			type: String,
			default: '0',
		},
	},

	mounted: function() {
		this.fetch();
	},

	computed: {},

	methods: {

		/**
		 * Check if date is new.
		 *
		 * @param {string} date
		 * @param {string} timezone
		 * @return {boolean} If data is new.
		 */
		isNew: function( date, timezone = 'Z' ) {
			const days = parseInt( this.new, 10 );
			if ( isNaN( days ) || 1 > days ) {
				return false;
			}
			const limit = moment().subtract( days, 'days' ).toDate();
			const compare = moment( date + timezone ).toDate();
			return compare > limit;
		},

		number: function( key ) {
			if ( 'Number' === this[ key ] ) {
				return this[ key ];
			}
			return parseInt( this[ key ], 10 );
		},
		fetch: function() {
			const query = {
				per_page: this.number( 'max' ),
			};
			const author = this.number( 'author' );
			if ( author ) {
				query[ 'author[]' ] = author;
			}
			const path = `wp/v2${ this.postType }?` + $.params( query );
			this.loading = true;
			wp.apiFetch( {
				path: path,
			} ).then( ( res ) => {
				this.posts = res;
			} ).catch().finally( () => {
				this.$emit( 'post-list-updated' );
				this.loading = false;
			} );
		},
	},

	template: `
      <div class="hb-post-list">
        <p class="hb-post-list-title" v-if="title">{{title}}</p>
        <hb-list-table :loading="loading" items="posts" :total-page="0">
          <template slot="item" v-slot:item="{ item }">
			<a :href="post.link" class="hb-post-list-link">
				<span class="hb-post-list-title">{{ item.title.rendered }}</span>
				<span class="hb-post-list-date">{{ item.date | moment('ll')}}</span>
				<span v-if="isNew( item.date_gmt, 'Z')" class="hb-post-list-new material-icons">fiber_new</span>
			</a>
		  </template>
        </hb-list-table>
        <a :href="moreButton" class="btn btn-block btn-secondary">{{moreLabel}}</a>
      </div>
    `,

} );
