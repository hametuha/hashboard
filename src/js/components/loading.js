/*!
 * Loading indicator component
 *
 */

/* global HbComponentsLoading */

import { useEffect, useRef } from '@wordpress/element';
import { Animate } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Loading indicator component
 *
 * @param {Object} props Component props
 * @return {JSX.Element} Component
 */
export const LoadingIndicator = ( props ) => {
	const {
		loading = false,
		title = __( 'Loading…', 'hashboard' ),
	} = props;

	const containerRef = useRef();

	// Set data-loading-wrapper attribute on parent element
	useEffect( () => {
		const container = containerRef.current;
		const parent = container?.parentElement;
		
		if ( parent ) {
			if ( loading ) {
				parent.setAttribute( 'data-loading-wrapper', 'true' );
			} else {
				parent.removeAttribute( 'data-loading-wrapper' );
			}
		}

		return () => {
			// Cleanup on unmount
			if ( parent ) {
				parent.removeAttribute( 'data-loading-wrapper' );
			}
		};
	}, [ loading ] );

	if ( ! loading ) {
		return <div ref={ containerRef } style={ { display: 'none' } } />;
	}

	return (
		<Animate type="fade-in">
			{ ( { className } ) => (
				<div
					ref={ containerRef }
					className={ `hb-loading-indicator ${ className }` }
					title={ title }
				>
					<img
						src={ HbComponentsLoading.img || '../../img/ripple.gif' }
						width="100"
						height="100"
						alt={ title }
					/>
					<span className="hb-loading-indicator-title">
						{ title }
					</span>
				</div>
			) }
		</Animate>
	);
};

export default LoadingIndicator;
