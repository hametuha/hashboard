/**
 * Description
 */

/*global Hashboard: false*/
/*global Materialize: false*/

(function ($) {
  'use strict';

  var fileContainer = {};

  $(document).on('click', '.hb-submenu-trigger', function(e){
    e.preventDefault();
    $(this).parents('.hb-menu-item').toggleClass('toggle');
  });

  // File data store.
  $(document).on('change', '.hb-form input[type=file]', function(e){
    var name = $(this).attr('name');
    if(!this.files.length){
      if ( fileContainer[name]){
        fileContainer[name] = null;
      }
      return;
    }
    var fr = new FileReader();
    fr.onload = function(event){
      fileContainer[name] = event.target.result;
    };
    fr.readAsDataURL(this.files[0]);
  });

  // Form handler
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
        case 'file':
          params[$input.attr('name')] = fileContainer[$input.attr('name')];
          break;
        default:
          params[$input.attr('name')] = $input.val();
          break;
      }
    });
    $form.addClass('loading');
    $.hbRest(method, action, params).done(function(response){
      Materialize.toast('<span><i class="material-icons success">done</i>' + response.message + '</span>', 4000);
      $(document).trigger('updated.form.hashboard', [$form, response]);
    }).fail(function(response){
      Materialize.toast('<span><i class="material-icons error">error</i>' + response.responseJSON.message + '</span>', 4000);
    }).always(function(){
      $form.removeClass('loading');
    });
  });

  // Avatar handler.
  $(document).on('updated.form.hashboard', function(event, $form, response){
    switch ( $form.attr('id') ) {
      case 'form-picture':
        // Update profile picture
        $form.find('.avatar').attr('src', response.avatar_url);
        $form.get(0).reset();
        break;
    }
  });


  // Mail change handler
  $(document).on('click', '.hb-mail-resend, .hb-mail-cancel', function(e){
    e.preventDefault();
    var $button = $(this);
    var method = $button.hasClass('hb-mail-resend') ? 'PUT' : 'DELETE';
    var $form  = $button.parents('form');
    $form.addClass('loading');
    $.hbRest( method, $(this).attr('href') ).done(function(response){
      if ( 'DELETE' === method ) {
        $button.parents('.hb-warning').remove();
      }
      Materialize.toast('<span><i class="material-icons success">done</i>' + response.message + '</span>', 4000);
    }).fail(function(response){
      Materialize.toast('<span><i class="material-icons error">error</i>' + response.responseJSON.message + '</span>', 4000);
    }).always(function(){
      $form.removeClass('loading');
    });
  });

  // Initiallize slelect
  $(document).ready(function() {
    $('fieldset select').material_select();
  });

  var handleStatus = function( $form )  {
    var $statusBox = $form.find('.hb-status-display');
    // Check if box exists.
    if ( ! $statusBox.length ) {
      return;
    }
    // Check if source exists
    var endpoint = $statusBox.attr('data-endpoint');
    if ( ! endpoint ) {
      return;
    }
    // O.K. Let's grab it.
    $statusBox.addClass('loading loading-small');
    $.hbRest('GET', endpoint ).done(function(response){
      $statusBox.removeClass('success error');
      if(response.success){
        $statusBox.addClass('success');
      }else{
        $statusBox.addClass('error');
      }
      $statusBox.text(response.message);
    }).fail(function(response){
      $statusBox.addClass('error');
      if ( response.responseJSON.message ) {
        $statusBox.text(response.responseJSON.message);
      }
    }).always(function(){
      $statusBox.removeClass('loading loading-small');
    });
  };

  // When data is updated.
  $(document).on('updated.form.hashboard', function(event, $form, response){
    handleStatus($form);
  });

  // When form is displayed.
  $(document).ready(function(){
    $('.hb-form').each(function(index, form){
      handleStatus( $(form) );
    });
  });

})(jQuery);
