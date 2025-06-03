/*!
 * @deps vue-js,moment
 */

/* global HbFiltersMoment: false*/
/* global moment: false */

export const momentize = ( value, format = 'LLL', locale = false ) => {
	if ( ! locale ) {
		locale = HbFiltersMoment.locale;
	}
	moment.locale( locale );
	return moment( value ).format( format );
};

if ( window.Vue ) {
	Vue.filter( 'moment', momentize );
}
