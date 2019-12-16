/*!
 * List of posts.
 *
 * wpdeps=vue-js,hb-components-loading,hashboard, hb-filters-moment
 */

/*global moment: false*/
/*global Vue: false*/

( function( $ ) {

  'use strict';


  Vue.component( 'hb-post-list', {
    template: `
      <div class="hb-post-list">
        <p class="hb-post-list-title" v-if="title">{{title}}</p>
        <ul class="hb-post-list-list" v-if="posts">
            <li v-for="post in posts" class="hb-post-list-item">
                <a :href="post.link" class="hb-post-list-link">
                    <span class="hb-post-list-title">{{post.title.rendered}}</span>
                    <span class="hb-post-list-date">{{post.date | moment('ll')}}</span>
                    <span v-if="isNew(post.date_gmt, 'Z')" class="hb-post-list-new material-icons">fiber_new</span>
                </a>
            </li>
        </ul>
        <a :href="moreButton" class="btn btn-block btn-secondary">{{moreLabel}}</a>
        <hb-loading :loading="loading"></hb-loading>
      </div>
    `,
    data: function() {
      return {
        loading: true,
        posts: []
      };
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      postType: {
        type: String,
        default: 'post'
      },
      moreButton: {
        type: String,
        default: ''
      },
      moreLabel: {
        type: String,
        default: 'READ MORE'
      },
      new: {
        type: String,
        default: '0'
      },
      max: {
        type: String,
        default: '3'
      },
      author: {
        type: String,
        default: '0'
      }
    },
    mounted: function() {
      this.fetch();
      console.log( this.isNew( '2017-08-16T19:00:00', '' ) );
    },

    computed: {
    },

    methods: {

      /**
       * Check if date is new.
       *
       * @param {String} date
       * @param {String} timezone
       * @returns {boolean}
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
        if ( 'Number' === this[key]) {
          return this[key];
        } else {
          return parseInt( this[key], 10 );
        }
      },
      fetch: function() {
        let self = this;
        this.loading = true;
        let query = {
          'per_page': this.number( 'max' )
        };
        let author = this.number( 'author' );
        if ( author ) {
          query['author[]'] = author;
        }

        $.hbRest( 'GET', 'wp/v2/' + this.postType, query ).done( ( res )=>{
          self.posts = res;
        }).fail( $.hbRestError() ).always( ()=>{
          self.$emit( 'post-list-updated' );
          self.loading = false;
        });
      }
    }
  });


}( jQuery ) );
