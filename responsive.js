


/*
* @version  0.1.13
* @author   Lauri Rooden - https://github.com/litejs/elements-lite
* @license  MIT License  - http://lauri.rooden.ee/mit-license.txt
*/


!function(w) {
  var lastSize, lastOrient
	, b = document.body
	, emit = function(){ w.M && M.emit("resize") }.rate(200, true)

  function setClasses() {
    var width = b.offsetWidth
		, next = width < 601 ? "s-mob" : ( width < 1025 ? "s-tab" : "s-full")

    if ( next != lastSize ) {
      b.addClass( next ).rmClass( lastSize )
			lastSize = next
    }

    next = width > b.offsetHeight ? "s-land" : "s-port"

    if ( next != lastOrient) {
      b.addClass( next ).rmClass( lastOrient )
			lastOrient = next
    }
		emit()
  }
	setClasses()

	Event.add(w, "resize", setClasses)
	Event.add(b, "orientationchange", setClasses)
	Event.add(w, "load", setClasses)
}(this)

