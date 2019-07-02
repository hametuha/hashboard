/*global HashRest: false*/
/*global Hashboard: false*/

( function( $ ) {

  'use strict';

  $.extend({

    /**
     * Short hand for rest API
     *
     * @scope {jQuery}
     * @param {String} method
     * @param {String} url
     * @param {Object} data
     * @param {Boolean} processData
     */
    hbRest: function( method, url, data ) {
      method = method.toUpperCase();
      if ( ! /^https?:\/\//.test( url ) ) {
        url = HashRest.root + url;
      }

      let args = {
        method: method,
        beforeSend: function( xhr ) {
          xhr.setRequestHeader( 'X-WP-Nonce', HashRest.nonce );
        }
      };
      if ( data ) {
        switch ( method ) {
          case 'PUT':
          case 'POST':
          case 'PUSH':
            args.data = data;
            break;
          default:
            let query = [];
            for ( let prop in data ) {
              if ( data.hasOwnProperty( prop ) ) {
                query.push( prop + '=' + encodeURIComponent( data[prop]) );
              }
            }
            if ( query.length ) {
              url += '?' + query.join( '&' );
            }
            break;
        }
      }
      args.url = url;
      return $.ajax( args );
    },

    /**
     * Returns error handler.
     *
     * @returns {Function}
     */
    hbRestError: function() {
      return function( response ) {
        const msg = $.hbValues( response, 'responseJSON.message', HashRest.error );
        $.hbErrorMessage( msg );
      };
    },

    /**
     * Display error message.
     *
     * @param {String} msg
     */
    hbErrorMessage: function( msg ) {
      $.hbMessage( msg, 'error', 'close' );
    },

    /**
     * Display success message.
     *
     * @param {String} msg
     * @param {String} icon  Default, info.
     * @param {String} color Default, error.
     * @param {Number} duration Milliseconds to disappear. Default 4000.
     */
    hbMessage: function( msg, color, icon, duration ) {
      if ( ! color ) {
        color = 'info';
      }
      if ( ! icon ) {
        switch ( color ) {
          case 'success':
            icon = 'check_circle';
            break;
          case 'error':
            icon = 'close';
            break;
          default:
            icon = 'info';
            break;
        }
      }
      if ( ! duration ) {
        duration = 4000;
      }
      Hashboard.toast( '<i class="material-icons ' + color + '">' + icon + '</i>' + msg, duration );
    },

    /**
     * Get object property in any depth.
     *
     * @param {Object} obj            Object.
     * @param {String} key            Property name of object.
     * @param {*}      undefinedValue Default value.
     * @returns {*}
     */
    hbValues: function( obj, key, undefinedValue ) {
      const k = key.split( '.' );
      let v = obj;
      for ( let i = 0; i < k.length; i++ ) {
        if ( ! ( k [ i ] in v ) ) {
          return undefinedValue;
        }
        v = v[ k[ i ]] ;
      }
      return v;
    }
  });
}( jQuery ) );
