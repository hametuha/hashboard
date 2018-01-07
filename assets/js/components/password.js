/*!
 * Password Strength meter.
 *
 * wpdeps=password-strength-meter
 */
!function(s){"use strict";s(document).on("keyup","input[name=user_pass], input[name=user_pass2]",function(a){var t=s("#hb-password-strength"),e=t.parents("form").find("button[type=submit]"),n=t.attr("data-blacklists").split(","),r=wp.passwordStrength.meter(s("input[name=user_pass]").val(),n,s("input[name=user_pass2]").val());switch(r){case 5:t.attr("class","weak").find("span").text(pwsL10n.mismatch);break;case 4:t.attr("class","strong").find("span").text(pwsL10n.strong);break;case 3:t.attr("class","good").find("span").text(pwsL10n.good);break;case 2:t.attr("class","bad").find("span").text(pwsL10n.bad);break;default:t.attr("class","weak").find("span").text(pwsL10n["short"])}-1<[3,4].indexOf(r)?e.attr("disabled",!1).removeClass("disabled"):e.attr("disabled",!0).addClass("disabled")})}(jQuery);
//# sourceMappingURL=../map/components/password.js.map
