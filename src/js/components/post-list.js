/*!
 * Post List component for React
 *
 * @deps wp-api-fetch, hb-components-list-table
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
const { apiFetch } = wp;
const { ListTable } = hb.components;

/**
 * Post List Component
 * @param {Object} props - Component props
 */
export const PostList = ( props ) => {
	const {
		title = '',
		postType = 'post',
		moreButton = '',
		moreLabel = 'READ MORE',
		newDays = '0',
		max = '3',
		author = '0',
		onPostListUpdated,
	} = props;

	const [ loading, setLoading ] = useState( true );
	const [ posts, setPosts ] = useState( [] );

	// Parse number from string prop
	const parseNumber = ( value ) => {
		if ( typeof value === 'number' ) {
			return value;
		}
		const parsed = parseInt( value, 10 );
		return isNaN( parsed ) ? 0 : parsed;
	};

	// Check if date is new
	const isNew = ( date, timezone = 'Z' ) => {
		const days = parseNumber( newDays );
		if ( days < 1 ) {
			return false;
		}

		const limit = new Date();
		limit.setDate( limit.getDate() - days );

		const compareDate = new Date( date + timezone );
		return compareDate > limit;
	};

	// Format date
	const formatDate = ( dateString ) => {
		return new Date( dateString ).toLocaleDateString( undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		} );
	};

	// Get REST base from post type (handle common built-in types)
	const getRestBase = ( type ) => {
		const mapping = {
			post: 'posts',
			page: 'pages',
		};
		return mapping[ type ] || type;
	};

	// Fetch posts
	const fetchPosts = useCallback( async () => {
		setLoading( true );

		try {
			const query = {
				per_page: parseNumber( max ),
			};

			const authorId = parseNumber( author );
			if ( authorId > 0 ) {
				query[ 'author[]' ] = authorId;
			}

			const queryString = new URLSearchParams( query ).toString();
			const restBase = getRestBase( postType );
			const path = `wp/v2/${ restBase }?${ queryString }`;

			const response = await apiFetch( { path } );
			setPosts( response );
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.error( 'Failed to fetch posts:', error );
			setPosts( [] );
		} finally {
			setLoading( false );
			if ( onPostListUpdated ) {
				onPostListUpdated();
			}
		}
	}, [ postType, max, author, onPostListUpdated ] );

	// Fetch posts on mount and when dependencies change
	useEffect( () => {
		fetchPosts();
	}, [ postType, max, author, fetchPosts ] );

	// Custom item renderer for posts
	const renderPostItem = ( item ) => (
		<a href={ item.link } className="hb-post-list-link">
			<span className="hb-post-list-title">{ item.title?.rendered || item.title }</span>
			<span className="hb-post-list-date">{ formatDate( item.date ) }</span>
			{ isNew( item.date_gmt, 'Z' ) && (
				<span className="hb-post-list-new material-icons">fiber_new</span>
			) }
		</a>
	);

	return (
		<div className="hb-post-list">
			{ title && <p className="hb-post-list-title">{ title }</p> }

			<ListTable
				loading={ loading }
				items={ posts }
				totalPage={ 0 } // No pagination for post list
				renderItem={ renderPostItem }
				listWrapperClass="hb-post-list-items"
				listClass="hb-post-list-item"
			/>

			{ moreButton && (
				<div className="d-grid">
					<a href={ moreButton } className="btn btn-secondary">
						{ moreLabel }
					</a>
				</div>
			) }
		</div>
	);
};

