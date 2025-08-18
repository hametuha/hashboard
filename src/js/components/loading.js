/*!
 * Loading indicator component
 *
 */

import { useEffect, useRef } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
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
		size = 40, // デフォルトサイズ (px)
		showTitle = true,
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

	// Spinner のスタイル設定
	const spinnerStyle = {
		height: `${ size }px`,
		width: `${ size }px`,
	};

	return (
		<div
			ref={ containerRef }
			className="hb-loading-indicator"
			title={ title }
		>
			<Spinner style={ spinnerStyle } />
			{ showTitle && (
				<span className="hb-loading-indicator-title">
					{ title }
				</span>
			) }
		</div>
	);
};

export default LoadingIndicator;
