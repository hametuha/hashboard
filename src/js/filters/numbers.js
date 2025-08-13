/*!
 * Utility filters for formatting.
 *
 */

/**
 * Format number.
 *
 * @param {number}  number
 * @param {boolean} withDecimal
 * @return {string} Formatted number string.
 */
export const numberFormat = ( number, withDecimal = true ) => {
	const numberString = ( '' + number ).split( '.' );
	const out = [];
	let integer = '';
	for ( let i = 1; i <= numberString[ 0 ].length; i++ ) {
		integer = numberString[ 0 ].substr( -1 * ( i ), 1 ) + integer;
		if ( 0 === i % 3 && numberString[ 0 ].length > i ) {
			integer = ',' + integer;
		}
	}
	out.push( integer );
	if ( withDecimal ) {
		if ( 1 < numberString.length ) {
			// No comma for decimal.
			out.push( numberString[ 1 ] );
		} else {
			// Add .00 if no decimal part exists
			out.push( '00' );
		}
	}
	return out.join( '.' );
};

/**
 * Format number to money.
 *
 * @param {number}       number
 * @param {string}       currency
 * @param {string}       prefix
 * @param {boolean|null} withDecimal - true/false to force decimal display, null for currency default
 * @return {string} Formatted money string.
 */
export const moneyFormat = ( number, currency = 'usd', prefix = '', withDecimal = null ) => {
	currency = currency.toLowerCase();
	let prefixLetter = '';

	// No decimal currencies.
	const noDecimalCurrencies = [ 'jpy', 'krw', 'vnd', 'idr', 'clp', 'pyg', 'rwf', 'ugx', 'xaf', 'xof', 'xpf' ];

	// If withDecimal is not explicitly set, decide with currency.
	if ( withDecimal === null ) {
		withDecimal = ! noDecimalCurrencies.includes( currency );
	}

	// Prefix with currency.
	switch ( currency ) {
		case 'jpy':
			prefixLetter = '¥';
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
		case 'krw':
			prefixLetter = '₩';
			break;
		case 'vnd':
			prefixLetter = '₫';
			break;
		default:
			if ( prefix ) {
				prefixLetter = prefix;
			}
			break;
	}

	let formattedNumber = numberFormat( number, withDecimal );
	if ( prefixLetter ) {
		formattedNumber = prefixLetter + formattedNumber;
	}
	return formattedNumber;
};
