const jquery = require("jquery");

jquery(document).ready(function($) {
    // hamburgers
    var forEach=function(t,o,r){if("[object Object]"===Object.prototype.toString.call(t))for(var c in t)Object.prototype.hasOwnProperty.call(t,c)&&o.call(r,t[c],c,t);else for(var e=0,l=t.length;l>e;e++)o.call(r,t[e],e,t)};
    var hamburgers = document.querySelectorAll(".hamburger");
    if (hamburgers.length > 0) {
    forEach(hamburgers, function(hamburger) { hamburger.addEventListener("click", function() {
        this.classList.toggle("is-active");
    }, false);
    });
}
// hamburgers

//menu
    // var pull = $('#pull');
    // menu = $('#menu-bg');
    // menuHeight  = menu.height();
    // $(pull).on('click', function(e) {
    //     e.preventDefault();
    //     menu.slideToggle(500);
    // });
    // $(window).resize(function(){
    //     var w = $(window).width();
    //     if(w > 320 && menu.is(':hidden')) {
    //     menu.removeAttr('style');
    // }
    // });
});
//menu

