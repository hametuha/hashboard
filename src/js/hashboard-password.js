/**
 * Description
 */

/*global wp:true */
/*global pwsL10n:false */

(function ($) {
  'use strict';

  $(document).on('keyup', 'input[name=user_pass], input[name=user_pass2]', function(e){
    var $container = $('#hb-password-strength');
    var $submit    = $container.parents('form').find('button[type=submit]');
    var blackList = $container.attr('data-blacklists').split(',');
    var weakness = wp.passwordStrength.meter( $('input[name=user_pass]').val(), blackList, $('input[name=user_pass2]').val() );
    switch ( weakness ) {
      case 5:
        $container.attr('class', 'weak').find('span').text(pwsL10n.mismatch);
        break;
      case 4:
        $container.attr('class', 'strong').find('span').text(pwsL10n.strong);
        break;
      case 3:
        $container.attr('class', 'good').find('span').text(pwsL10n.good);
        break;
      case 2:
        $container.attr('class', 'bad').find('span').text(pwsL10n.bad);
        break;
      default:
        $container.attr('class', 'weak').find('span').text(pwsL10n.short);
        break;
    }
    if(-1 < [3, 4].indexOf(weakness)){
      $submit.attr('disabled', false).removeClass('disabled');
    }else{
      $submit.attr('disabled', true).addClass('disabled');
    }
  });

})(jQuery);
