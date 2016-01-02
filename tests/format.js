


/*
 * @version    0.1.4
 * @date       2014-09-20
 * @stability  2 - Unstable
 * @author     Lauri Rooden <lauri@rooden.ee>
 * @license    MIT License
 */



!function(prototype) {
	var undef
	, A = Array[prototype]
	, N = Number[prototype]
	, S = String[prototype]
	, formatRe = /{(?!\\)((?:(["'/])(?:\\?.)*?\2|[^}])*)}/g
	, filterRe = /\|\s*(\w+)(?:\s*\:((?:(["'\/])(?:\\?.)*?\3|[^|])*))?/g
	, digitRe = /^\s*\d+/
	, numbersRe = /-?\d+\.?\d*/g
	, unescapeRe = /{\\/g

	S.format = function() {
		var args = A.slice.call(arguments)
		args.unshift(0)
		return this.replace(formatRe, function(_, arg) {
			args[0] = arg.replace(digitRe, "this[$&]").replace(filterRe, ".$1($2)")
			return Fn.apply(null, args)()
		}).replace(unescapeRe, "{")
	}

	N.format = function(data) {
		return "" + this
	}

	S.safe = function() {
		return this
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
	}

	S.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1)
	}

	S.camelCase = function() {
		return this.replace(/[ _-]+([a-z])/g, function(_, a) {
			return a.toUpperCase()
		})
	}

	S.lower = S.toLowerCase
	S.upper = S.toUpperCase

	N.step = function(a, add) {
		var x = ("" + a).split(".")
		, steps = this / a
		, n = ~~(steps + (add == undef ? .5 : add === 1 && steps == (steps|0) ? 0 : +add)) * a
		return "" + (1 in x ? n.toFixed(x[1].length) : n)
	}

	S.step = function(a, add) {
		return this.replace(numbersRe, function(num) {
			return (+num).step(a, add)
		})
	}

	N.scale = function() {
		return words(this, [1000,1000,1000], ["","k","M","G"], {"default": "{0}{1}"})
	}

	S.scale = function() {
		return this.replace(numbersRe, function(num) {
			return (+num).scale()
		})
	}

	S.pick = N.pick = function() {
		var val = this + "="
		for (var s, a = arguments, i = 0, len = a.length; i < len;) {
			s = a[i++]
			if (s.indexOf(val) == 0) {
				s = s.slice(val.length)
				i = len
			}
		}
		return s.replace("#", this)
	}

	S.plural = N.plural = function() {
		// Plural-Forms: nplurals=2; plural=n != 1;
		// http://www.gnu.org/software/gettext/manual/html_mono/gettext.html#Plural-forms
		return arguments[ +Fn("n->" + (String.plural || "n!=1"))( parseFloat(this) ) ].replace("#", this)
	}

	A.pluck = function(name) {
		for (var arr = this, i = arr.length, out = []; i--; ) {
			out[i] = arr[i][name]
		}
		return out
	}

	function words(input, steps, units, strings, overflow) {
		var n = +input
		, i = 0
		, s = strings || {"default": "{0} {1}{2}"}

		while(n>=steps[i])n/=steps[i++]
		if (i == steps.length && overflow) return overflow(this)
		i=units[i]
		return (s[n<2?i:i+"s"]||s["default"]).format({0:n, 1:i, 2:n<2?"":"s"})
	}
	Number.words = words
}("prototype")


