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
    hbRest: function (method, url, data) {
      method = method.toUpperCase();
      if ( ! /^https?:\/\//.test(url) ) {
        url = HashRest.root + url;
      }

      let args = {
        method: method,
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-WP-Nonce', HashRest.nonce);
        }
      };
      if (data) {
        switch (method) {
          case 'PUT':
          case 'POST':
          case 'PUSH':
            args.data = data;
            break;
          default:
            let query = [];
            for (let prop in data) {
              if (data.hasOwnProperty(prop)) {
                query.push(prop + '=' + encodeURIComponent(data[prop]));
              }
            }
            if (query.length) {
              url += '?' + query.join('&');
            }
            break;
        }
      }
      args.url = url;
      return $.ajax(args);
    },
    hbRestError: function () {
      return function(response) {
        let msg = HashRest.error;
        if (response.responseJSON && response.responseJSON.message) {
          msg = response.responseJSON.message;
        }
        Materialize.toast('<i class="material-icons error">close</i>' + msg, 4000);
      };
    }
  });
})(jQuery);
