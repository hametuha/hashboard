/*!
 * List table with pagination and search for React
 *
 */

import { useMemo } from '@wordpress/element';

/**
 * List Table Component
 * @param {Object} props - Component props
 */
const ListTable = ( props ) => {
	const {
		loading = false,
		items = [],
		curPage = 1,
		totalPage = 1,
		listClass = 'list-item hb-post-list-item',
		wrapperClass = '',
		listWrapperClass = 'list-group hb-post-list',
		onPageChanged,
		// Render props for customization
		renderHeader,
		renderItem,
		renderEmpty,
		// Dependencies for child components
		LoadingComponent,
		PaginationComponent,
	} = props;

	// Compute wrapper class names
	const wrapperClassName = useMemo( () => {
		const classNames = [ 'hb-list-table position-relative' ];
		if ( wrapperClass ) {
			classNames.push( wrapperClass );
		}
		return classNames.join( ' ' );
	}, [ wrapperClass ] );

	// Default render functions
	const defaultRenderItem = ( item ) => (
		<a href={ item.link } className="hb-post-list-link">
			<span className="hb-post-list-title">{ item.title?.rendered || item.title }</span>
			<span className="hb-post-list-date">{ item.date }</span>
		</a>
	);

	const defaultRenderEmpty = () => (
		<p className="text-muted text-center">No items found</p>
	);

	// Handle pagination
	const handlePagination = ( number ) => {
		if ( onPageChanged ) {
			onPageChanged( number );
		}
	};

	// Use provided components or existing components
	const Loading = LoadingComponent || ( window.hb?.components?.loading || DefaultLoading );
	const Pagination = PaginationComponent || ( window.hb?.components?.pagination || DefaultPagination );

	return (
		<div className={ wrapperClassName }>
			{ renderHeader && renderHeader() }

			{ ( items.length > 0 ) ? (
				<ul className={ listWrapperClass }>
					{ items.map( ( item ) => (
						<li key={ item.id } className={ listClass }>
							{ renderItem ? renderItem( item ) : defaultRenderItem( item ) }
						</li>
					) ) }
				</ul>
			) : (
				renderEmpty ? renderEmpty() : defaultRenderEmpty()
			) }

			{ ! loading && totalPage > 1 && (
				<Pagination
					current={ curPage }
					total={ totalPage }
					onPageChanged={ handlePagination }
				/>
			) }

			<Loading loading={ loading } />
		</div>
	);
};

// Default Loading Component
const DefaultLoading = ( { loading } ) => {
	if ( ! loading ) {
		return null;
	}

	return (
		<div className="hb-loading-overlay">
			<div className="spinner-border" role="status">
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	);
};

// Default Pagination Component (placeholder - should use the actual HbPagination)
const DefaultPagination = ( { current, total, onPageChanged } ) => {
	// This is a placeholder - in real implementation,
	// we would use the actual HbPagination component
	return (
		<div className="pagination-wrapper">
			<button
				onClick={ () => onPageChanged( current - 1 ) }
				disabled={ current <= 1 }
			>
				Previous
			</button>
			<span>Page { current } of { total }</span>
			<button
				onClick={ () => onPageChanged( current + 1 ) }
				disabled={ current >= total }
			>
				Next
			</button>
		</div>
	);
};

// Export component
export default ListTable;
