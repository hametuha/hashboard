/**
 * Description
 */

/*global Hashboard: false*/
/*global Materialize: false*/

(function ($) {
  'use strict';

  $(document).on('click', '.hb-submenu-trigger', function(e){
    e.preventDefault();
    $(this).parents('.hb-menu-item').toggleClass('toggle');
  });

  $(document).on('submit', '.hb-form', function(e){
    e.preventDefault();
    var $form  = $(this);
    var method = $form.attr('method').toUpperCase();
    var action = $form.attr('action');
    var params = {};
    $form.find('input,select,textarea').each(function(index, input){
      var $input = $(input);
      if(!$input.attr('name')){
        return true;
      }
      switch($(input).attr('type')){
        case 'checkbox':
        case 'radio':
          if($input.attr('checked')){
            params[$input.attr('name')] = $input.val();
          }
          break;
        default:
          params[$input.attr('name')] = $input.val();
          break;
      }
    });
    $form.addClass('loading');
    $.hbRest(method, action, params).done(function(response){
      Materialize.toast('<span><i class="material-icons success">done</i>' + response.message + '</span>', 4000);
    }).fail(function(response){
      Materialize.toast('<span><i class="material-icons error">error</i>' + response.responseJSON.message + '</span>', 4000);
    }).always(function(){
      $form.removeClass('loading');
    });
  });
})(jQuery);
