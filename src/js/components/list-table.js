/*!
 * List table with pagination and search for React
 *
 */

import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

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
		<p className="hb-no-data hb-no-data-table">{ __( 'No items found', 'hashboard' ) }</p>
	);

	// Handle pagination
	const handlePagination = ( number ) => {
		if ( onPageChanged ) {
			onPageChanged( number );
		}
	};

	// Use provided components or existing hb components
	// Note: hb.components are available at runtime, not during module evaluation
	const getLoadingComponent = () => {
		if ( LoadingComponent ) {
			return LoadingComponent;
		}
		if ( window.hb?.components?.loading ) {
			return window.hb.components.loading;
		}
		return DefaultLoading;
	};

	const getPaginationComponent = () => {
		if ( PaginationComponent ) {
			return PaginationComponent;
		}
		if ( window.hb?.components?.pagination ) {
			return window.hb.components.pagination;
		}
		return DefaultPagination;
	};

	const Loading = getLoadingComponent();
	const Pagination = getPaginationComponent();

	return (
		<div className={ wrapperClassName }>
			{ renderHeader && renderHeader() }

			{ items.length > 0 && (
				<ul className={ listWrapperClass }>
					{ items.map( ( item ) => (
						<li key={ item.id } className={ listClass }>
							{ renderItem ? renderItem( item ) : defaultRenderItem( item ) }
						</li>
					) ) }
				</ul>
			) }

			{ items.length === 0 && (
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

// Fallback Loading Component (only used if hb.components.loading is not available)
const DefaultLoading = ( { loading } ) => {
	if ( ! loading ) {
		return null;
	}

	// Try to use WordPress Spinner if available
	if ( window.wp?.components?.Spinner ) {
		const { Spinner } = window.wp.components;
		return (
			<div className="hb-loading-overlay">
				<Spinner />
			</div>
		);
	}

	// Fallback to basic spinner
	return (
		<div className="hb-loading-overlay">
			<div className="spinner-border" role="status">
				<span className="sr-only">{ __( 'Loading...', 'hashboard' ) }</span>
			</div>
		</div>
	);
};

// Fallback Pagination Component (only used if hb.components.pagination is not available)
const DefaultPagination = ( { current, total, onPageChanged } ) => {
	return (
		<div className="pagination-wrapper hb-pagination">
			<button
				className="btn btn-sm btn-secondary"
				onClick={ () => onPageChanged( current - 1 ) }
				disabled={ current <= 1 }
			>
				{ __( 'Previous', 'hashboard' ) }
			</button>
			<span className="mx-3">
				{ __( 'Page', 'hashboard' ) } { current } { __( 'of', 'hashboard' ) } { total }
			</span>
			<button
				className="btn btn-sm btn-secondary"
				onClick={ () => onPageChanged( current + 1 ) }
				disabled={ current >= total }
			>
				{ __( 'Next', 'hashboard' ) }
			</button>
		</div>
	);
};

// Export component
export default ListTable;
