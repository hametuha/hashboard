/*!
 * Pagination for React (WordPress)
 *
 */

import { useMemo } from '@wordpress/element';

/**
 * Pagination Button Component
 *
 * @param {Object} props - Component properties
 * @return {JSX.Element} Rendered pagination button
 */
const PaginationButton = ( props ) => {
	const {
		number,
		current = false,
		label = '',
		disabled = false,
		onPaginated,
	} = props;

	// Compute icon
	const icon = useMemo( () => {
		switch ( label ) {
			case 'right':
			case 'left':
				return <i className="material-icons">{ `chevron_${ label }` }</i>;
			case 'more_horiz':
				return <i className="material-icons">{ label }</i>;
			default:
				return number;
		}
	}, [ label, number ] );

	// Compute className
	const className = useMemo( () => {
		const classes = [ 'page-item' ];
		if ( disabled ) {
			classes.push( 'disabled' );
		}
		if ( current ) {
			classes.push( 'active' );
		}
		return classes.join( ' ' );
	}, [ disabled, current ] );

	// Click handler
	const clickHandler = ( e ) => {
		e.preventDefault();
		e.stopPropagation();
		if ( ! disabled && ! current && onPaginated ) {
			onPaginated( number );
		}
	};

	return (
		<li className={ className }>
			<a
				className="page-link"
				href="#"
				onClick={ clickHandler }
			>
				{ icon }
			</a>
		</li>
	);
};

/**
 * Pagination Component
 *
 * @param {Object} props - Component properties
 * @return {JSX.Element} Rendered pagination component
 */
const Pagination = ( props ) => {
	const {
		total,
		current,
		max = 5,
		align = 'center',
		onPageChanged,
	} = props;

	// Computed values
	const pad = Math.floor( ( max - 1 ) / 2 );
	const leftPad = Math.max( current - pad, 1 );
	const rightPad = Math.min( current + pad, total );
	const hasPrev = 1 < leftPad;
	const hasNext = rightPad < total;
	const needLeft = 2 < leftPad;
	const needRight = rightPad < ( total - 1 );

	// Generate range
	const range = useMemo( () => {
		const rangeArray = [];
		for ( let i = leftPad; i <= rightPad; i++ ) {
			rangeArray.push( i );
		}
		return rangeArray;
	}, [ leftPad, rightPad ] );

	// Compute className
	const className = useMemo( () => {
		const classes = [ 'pagination' ];
		if ( align === 'center' ) {
			classes.push( 'justify-content-center' );
		}
		return classes.join( ' ' );
	}, [ align ] );

	// Handle pagination
	const handlePaginated = ( number ) => {
		if ( onPageChanged ) {
			onPageChanged( number );
		}
	};

	return (
		<ul className={ className }>
			{ /* Previous button */ }
			<PaginationButton
				disabled={ ! hasPrev }
				label="left"
				number={ 1 }
				onPaginated={ handlePaginated }
			/>

			{ /* Left ellipsis */ }
			{ needLeft && (
				<PaginationButton
					disabled={ true }
					number={ 1 }
					label="more_horiz"
				/>
			) }

			{ /* Page numbers */ }
			{ range.map( ( n ) => (
				<PaginationButton
					key={ n }
					number={ n }
					current={ n === current }
					onPaginated={ handlePaginated }
				/>
			) ) }

			{ /* Right ellipsis */ }
			{ needRight && (
				<PaginationButton
					disabled={ true }
					number={ total }
					label="more_horiz"
				/>
			) }

			{ /* Next button */ }
			<PaginationButton
				disabled={ ! hasNext }
				label="right"
				number={ total }
				onPaginated={ handlePaginated }
			/>
		</ul>
	);
};

export default Pagination;
