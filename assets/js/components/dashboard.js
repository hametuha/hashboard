"use strict";/*!
 * Dashboard widgets
 * wpdeps=masonry,jquery
 */
window.Hashboard||(window.Hashboard={}),Hashboard.masonry=function(){jQuery(".hb-masonry").masonry("layout")},jQuery(document).ready(function(o){var n=o(".hb-masonry").masonry({columnWidth:".hb-masonry-sizer",itemSelector:".hb-masonry-block",percentPosition:!0});n.imagesLoaded().progress(function(){n.masonry("layout")}),n.on("block-change",function(){n.masonry("layout")})}),function(){new Vue({el:"#hb-dashboard-masonry",mounted:function(){},data:{masonry:null},methods:{updated:function(){var o=this;setTimeout(function(){o.$grid.masonry("layout")},10)}},computed:{$grid:function(){return this.masonry||(this.masonry=jQuery(".hb-masonry")),this.masonry}}})}();
//# sourceMappingURL=../map/components/dashboard.js.map
