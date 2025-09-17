/*!
 * List table with pagination and search for React
 *
 * @deps hb-components-pagination, hb-components-loading
 */

import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
const { pagination: Pagination, loadingIndicator: LoadingIndicator } = hb.components;

/**
 * List Table Component
 * @param {Object} props - Component props
 */
export const ListTable = ( props ) => {
	const {
		loading = false,
		items = [],
		curPage = 1,
		totalPage = 1,
		listClass = 'list-group-item hb-post-list-item',
		wrapperClass = '',
		listWrapperClass = 'list-group hb-post-list',
		onPageChanged,
		// Render props for customization
		renderHeader,
		renderItem,
		renderEmpty,
		// Dependencies for child components
		Loading = LoadingIndicator,
		PaginationComponent = Pagination,
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
				<PaginationComponent
					current={ curPage }
					total={ totalPage }
					onPageChanged={ handlePagination }
				/>
			) }

			<Loading loading={ loading } />
		</div>
	);
};

