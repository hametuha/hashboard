/*global HashRest: false*/
/*global Materialize: false*/

(function ($) {

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
    hbRest: function(method, url, data){
      method = method.toUpperCase();
      var args = {
        method    : method,
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-WP-Nonce', HashRest.nonce);
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
            var query = [];
            for(var prop in data){
              if(data.hasOwnProperty(prop)){
                query.push( prop + '=' + encodeURIComponent(data[prop]));
              }
            }
            if(query.length){
              url += '?' + query.join('&');
            }
            break;
        }
      }
      args.url = url;
      return $.ajax(args);
    }
  });

})(jQuery);
