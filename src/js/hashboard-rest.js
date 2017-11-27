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
      var args = {
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
            var query = [];
            for (var prop in data) {
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
        var msg = HashRest.error;
        if (response.responseJSON && response.responseJSON.message) {
          msg = response.responseJSON.message;
        }
        Materialize.toast('<i class="material-icons error">close</i>' + msg, 4000);
      };
    }
  });


})(jQuery);
