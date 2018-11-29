/*!
 * wpdeps=vue-js,moment
 */

/* global Vue: false*/
/* global HbFiltersMoment: false*/
/* global moment: false */

export const momentize = ( value, format = 'lll', locale = false ) => {
  if ( ! locale ) {
    locale = HbFiltersMoment.locale;
  }
  moment.locale( locale );
  return moment( value ).format( format );
};

if ( window.Vue ) {
  Vue.filter( 'moment', momentize );
}
