/*
    MIT License
*/
!function(d){function a(){var a=c.offsetWidth,b=601>a?"s-mob":1025>a?"s-tab":"s-full";b!=e&&(c.addClass(b).rmClass(e),e=b);b=a>c.offsetHeight?"s-land":"s-port";b!=f&&(c.addClass(b).rmClass(f),f=b);g()}var e,f,c=document.body,g=function(){d.M&&M.emit("resize")}.rate(200,!0);a();Event.add(d,"resize",a);Event.add(c,"orientationchange",a);Event.add(d,"load",a)}(this);
