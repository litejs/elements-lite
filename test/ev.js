!function(e,j){function k(a,b,c,d){var g=a._e||(a._e={});g[b]||(g[b]={});return g[b][c._fn_id||(c._fn_id=++m)]="mousewheel"==b?function(b){b||(b=e.event);var d=b.wheelDelta?b.wheelDelta/h:-b.detail/h;if(0!=d){if(1>d&&-1<d){var f=(0>d?-1:1)/d,d=d*f;h/=f}c.call(a,b,d)}}:d}function l(a,b,c){a=a._e||{};if(a[b]&&c._fn_id&&a[b][c._fn_id]){var d=a[b][c._fn_id];delete a[b][c._fn_id];return d}return c}var d=e.Event||(e.Event={}),m=0,h=120;e.addEventListener?(d.add=function(a,b,c){c=k(a,b,c,c);"mousewheel"==
b&&a.addEventListener("DOMMouseScroll",c,!1);a.addEventListener(b,c,!1);return d},d.remove=function(a,b,c){c=l(a,b,c);"mousewheel"==b&&a.removeEventListener("DOMMouseScroll",c,!1);a.removeEventListener(b,c,!1);return d}):(d.add=function(a,b,c){a.attachEvent("on"+b,k(a,b,c,function(){c.call(a,e.event)}));return d},d.remove=function(a,b,c){a.detachEvent("on"+b,l(a,b,c));return d});d.stop=function(a){a.stopPropagation&&a.stopPropagation();a.preventDefault&&a.preventDefault();a.cancelBubble=a.cancel=
!0;return a.returnValue=!1};d.removeAll=function(a,b){var c=a._e||{},f;for(f in c)if(!b||b==f){var g=c[f],e;for(e in g)d.remove(a,f,g[e]);delete c[f]}};d.pointerX=function(a){a.changedTouches&&(a=a.changedTouches[0]);return a.pageX||a.clientX+j.body.scrollLeft||0};d.pointerY=function(a){a.changedTouches&&(a=a.changedTouches[0]);return a.pageY||a.clientY+j.body.scrollTop||0};d.pointer=function(a){var b=d.pointerX(a);a=d.pointerY(a);return{x:b,y:a,left:b,top:a}}}(this,document);
