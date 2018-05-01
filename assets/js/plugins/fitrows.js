"use strict";/*!
 * wpdeps=jquery
 */
!function(t){t.fn.fitRows=function(){if(this.length){var t=parseInt(window.getComputedStyle(this.get(0)).getPropertyValue("line-height").replace(/[^0-9.]/,""),10),e=this.get(0).scrollHeight,i=(this.attr("data-min-rows")||1,Math.max(Math.floor(e/t),1));this.attr("rows",i)}},t(document).on("keyup","textarea.resizable",function(){t(this).fitRows()}),t(document).ready(function(){t("textarea.resizable").fitRows()})}(jQuery);
//# sourceMappingURL=../map/plugins/fitrows.js.map
