/*!
 * wpdeps=vue-js
 */

/* global Vue: false*/

export const numberFormat = ( number, withDecimal = true ) => {
  number = ( '' + number ).split( '.' );
  const out = [];
  let integer = '';
  for ( let i = 1; i <= number[0].length; i++ ) {
    integer = number[0].substr( -1 * ( i ), 1 ) + integer;
    if ( 0 === i % 3 && number[0].length > i ) {
      integer = ',' + integer;
    }
  }
  out.push( integer );
  if ( 1 < number.length && withDecimal ) {

    // No comma for decimal.
    out.push( number[1]);
  }
  return out.join( '.' );
};


export const moneyFormat = ( number, currency = 'usd', prefix = '' ) => {
  currency = currency.toLowerCase();
  let withDecimal  = true;
  let prefixLetter = '';
  switch ( currency ) {
    case 'jpy':
      prefixLetter = '¥';
      withDecimal  = false;
      break;
    case 'usd':
      prefixLetter = '$';
      break;
    case 'gbp':
      prefixLetter = '£';
      break;
    case 'eur':
      prefixLetter = '€';
      break;
    default:
      if ( prefix ) {
        prefixLetter = prefix;
      }
      break;
  }
  number = numberFormat( number, withDecimal );
  if ( prefixLetter && false !== prefix ) {
    number = prefixLetter + number;
  }
  return number;
};

// Register filters.
if ( window.Vue ) {
  Vue.filter( 'numberFormat', numberFormat );
  Vue.filter( 'moneyFormat', moneyFormat );
}

