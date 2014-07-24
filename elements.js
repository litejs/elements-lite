


/*
 * @version    0.3.0
 * @date       2014-07-24
 * @stability  1 - Experimental
 * @author     Lauri Rooden <lauri@rooden.ee>
 * @license    MIT License
 */



// TODO: find ways for automated testing
// http://www.browserscope.org/user/tests/howto


!function(root, doc, protoStr) {
	var elCache = {}
	, fnCache = {}
	, proto = (root.HTMLElement || root.Element || El)[protoStr]
	, elRe = /([.#:[])([-\w]+)(?:=((["'\/])(?:\\.|.)*?\4|[-\w]+)])?]?/g
	, renderRe = /[;\s]*(\w+)(?:\s*\:((?:(["'\/])(?:\\.|.)*?\3|[-,\s\w])*))?/g

	/*
	 * Examples:
	 *   - El("input#123.nice[type=checkbox]:checked:disabled[data-lang=en]")
	 */

	function El(name, args) {
		var el
		, pre = {}
		name = name.replace(elRe, function(_, op, key, val, quotation) {
			pre[
				op == "." ? (op = "class", (pre[op] && (key = pre[op]+" "+key)), op) :
				op == "#" ? "id" :
				key
			] = (quotation ? val.slice(1, -1): val) || key
			return ""
		}) || "div"

		// NOTE: IE-s cloneNode consolidates the two text nodes together as one
		// http://brooknovak.wordpress.com/2009/08/23/ies-clonenode-doesnt-actually-clone/
		el = (elCache[name] || (elCache[name] = doc.createElement(name))).cloneNode(true).set(pre)

		return fnCache[name] && fnCache[name].call(el, args) || el.set(args)
	}


	// TODO: Extend El api
	// add El.siblings( [selector ] )
	// add El.children( [selector ] )
	// add El.invoke
	// https://github.com/WebReflection/dom4#dom4

	//
	// How elements.js extends the DOM
	// -------------------------------
	//
	// All DOM extensions on the element are available by default.
	//
	// In browsers that does not support adding methods to prototype of native objects
	// such as HTMLElement or Element, document.createElement will be overrided
	// to extend created elements. El.get() and element.find will extend
	// returned elements.

	// ### element.append( content, [ before ] ) -> element
	//
	// - **content** `element || Array || String || Number`
	// - **before** `optional`
	//     - true - Insert content to the beginning of element
	//     - element - Insert content before specified element
	//     - Number - Insert content before nth child

	function append(child, before) {
	       var el = this
	       if (child) {
			if (typeof child == "string" || typeof child == "number") child = El.text(child)
			else if ( !("nodeType" in child) && "length" in child ) {
				// document.createDocumentFragment is unsupported in IE5.5
				// fragment = "createDocumentFragment" in doc ? doc.createDocumentFragment() : El("div")
				for (
					var len = child.length
					, i = 0
					, fragment = doc.createDocumentFragment();
					i < len; ) append.call(fragment, child[i++]);
				child = fragment
			}

			if (child.nodeType) el.insertBefore(child,
				(before === true ? el.firstChild :
				typeof before == "number" ? el.childNodes[
					before < 0 ? el.childNodes.length - before - 2 : before
				] : before) || null
			)
			if (child.appendHook) child.appendHook()
			//"childHook" in el && el.childHook()
		}
		return el
	}
	proto.append = append

	proto.after = function(silbing, before) {
		// call append so it works with DocumentFragment
		append.call(silbing.parentNode, this, before ? silbing : silbing.nextSibling)
		return this
	}

	proto.to = function(parent, before) {
		append.call(parent, this, before)
		return this
	}

	function hasClass(name) {
		// http://jsperf.com/regexp-indexof-perf/32
		// return (" "+this.className+" ").indexOf(" "+name+" ") > -1
		return RegExp("\\b" + name + "\\b").test(this.className)
	}
	proto.hasClass = hasClass

	function addClass(name) {
		var el = this
		el.className += !el.className ? name : hasClass.call(el, name) ? "" : " " + name
		return el
	}
	proto.addClass = addClass

	function rmClass(name) {
		var el = this
		el.className = (" "+el.className+" ").replace(" "+name+" "," ").trim()
		return el
	}
	proto.rmClass = rmClass

	proto.toggleClass = function(name, force) {
		if (arguments.length == 1) force = !hasClass.call(this, name)
		;( force ? addClass : rmClass ).call(this, name)
		return force
	}

	proto.empty = function() {
		for (var node, el = this; node = el.firstChild; ) kill.call(node)
		return el
	}

	function kill() {
		var el = this
		if (el.parentNode) el.parentNode.removeChild(el)
		if (Event.removeAll) Event.removeAll(el)
		if (el.killHook) el.killHook()
		if (el.empty) el.empty()
		return el
	}
	proto.kill = kill

	proto.on = function(ev, fn) {
		Event.add(this, ev, fn)
		return this
	}

	proto.non = function(ev, fn) {
		Event.remove(this, ev, fn)
		return this
	}

	proto.set = function(args) {
		var val
		, el = this
		, key = typeof args

		if (!args) return el
		if (key == "string" || key == "number" || args.nodeType || "length" in args) append.call(el, args)
		else for (key in args) {
			val = args[key]
			// El uses class
			if (key == "class") addClass.call(el, val)
			else if (!val) el.removeAttribute(key)
			else if (typeof val == "string") {
				// Note: IE5-7 doesn't set styles and removes events when you try to set them.
				//
				// in IE6, a label with a for attribute linked to a select list
				// will cause a re-selection of the first option instead of just giving focus.
				// http://webbugtrack.blogspot.com/2007/09/bug-116-for-attribute-woes-in-ie6.html
				el.setAttribute(key, val)

				// there are bug in IE<9 where changed 'name' param not accepted on form submit
				// The JScript engine used in IE doesn't recognize vertical tabulation character
				// oldIE = "\v" == "v"
				//
				// IE8 and below also support document.createElement('<P>')
				//
				// http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
				// http://msdn.microsoft.com/en-us/library/ms536614(VS.85).aspx

				if ((key == "id" || key == "name") && "\v" == "v") {
					el.mergeAttributes(doc.createElement('<INPUT '+key+'="' + val + '"/>'), false)
				}
			} else el[key] = val
		}
		return el
	}

	function render(data, skipSelf) {
		var bind, fn, lang
		, node = this

		if (bind = !skipSelf && node.getAttribute("data-bind")) {
			lang = node.getAttribute("lang") || lang
			// i18n(bind, lang).format(data)
			// document.documentElement.lang
			// document.getElementsByTagName('html')[0].getAttribute('lang')

			fn = "n d p->d&&(" + bind.replace(renderRe, "(p['$1']?p['$1'](n,d,$2):(n['$1']=$2.format(d))),") + "true)"

			fn.fn("d")(node, data, El.bindings)
			return node
		}

		for (node = node.firstChild; node; node = node.nextSibling) {
			if (node.nodeType == 1) render.call(node, data)
		}
		return this
	}

	proto.render = render

	// In Safari 2.x, innerText functions properly only
	// if an element is neither hidden (via style.display == "none")
	// nor orphaned from the document.
	// Otherwise, innerText results in an empty string.
	//
	// textContent is suported from IE9
	//
	// Opera 9-10 have Node.text, Node.textContent

	proto.txt = function(newText) {
		var el = this
		, attr = "textContent" in el ? "textContent" : "innerText"
		return arguments.length ? (el[attr] = newText) : el[attr]
	}

	// NOTE: fast selectors for IE
	// http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed

	function findEl(node, sel, first) {
		var el
		, i = 0
		, out = []
		, rules = ["_"]
		, tag = sel.replace(elRe, function(_, o, s, v) {
			rules.push(
				o == "." ? "(' '+_.className+' ').indexOf(' "+s+" ')>-1" :
				o == "#" ? "_.id=='"+s+"'" :
				"_.getAttribute('"+s+"')"+(v?"=='"+v+"'":"")
			)
			return ""
		}) || "*"
		, els = node.getElementsByTagName(tag)
		, fn = Fn(rules.join("&&"))

		for (; el = els[i++]; ) if (fn(el)) {
			if (first) return el
			out.push(el)
		}
		return first ? null : out
	}

	// Note: IE8 don't support :disabled
	// TODO: test with IE, should it be proto.querySelector or body.querySelector
	proto.find = proto.querySelector || function(sel) {
		return findEl(this, sel, true)
	}

	proto.findAll = proto.querySelectorAll ?
		function(sel) {
			return new ElAll(this.querySelectorAll(sel))
		} :
		function(sel) {
			return new ElAll(findEl(this, sel))
		}

	function ElAll(nodes) {
		this._nodes = nodes
	}

	ElAll.prototype = Object.keys(proto).reduce(function(memo, key) {
		memo[key] = function() {
			var elAll = this
			, nodes = elAll._nodes
			, i = 0
			, len = nodes.length
			for (; i < len; ) {
				proto[key].apply(nodes[i++], arguments)
			}
			return elAll
		}
		return memo
	}, {})


	function extend(node, key) {
		if (node) for (key in proto) node[key] = proto[key]
		return node
	}


	// IE 6-7
	if (proto === El[protoStr]) {
		var create = doc.createElement
		doc.createElement = function(name) {return extend(create(name))}

		// NOTE: document.body will not get extended with later added extensions
		extend(doc.body)

		// Remove background image flickers on hover in IE6
		//
		// You could also use CSS
		// html { filter: expression(document.execCommand("BackgroundImageCache", false, true)); }
		/*@cc_on try{document.execCommand('BackgroundImageCache',false,true)}catch(e){}@*/
	}
	root.El = El

	El[protoStr] = proto

	El.get = function(id) {
		if (typeof id == "string") id = doc.getElementById(id)
		return id && id.to ? id : extend(id)
	}

	function elCacheFn(name, el, custom) {
		elCache[name] = typeof el == "string" ? El(el) : el
		if (custom) {
			fnCache[name] = custom
		}
	}

	elCacheFn._el = elCache
	elCacheFn._fn = fnCache
	El.cache = elCacheFn

	El.text = function(str) {
		return doc.createTextNode(str)
	}

	// Use node initial content as template
	function getTemplate(node) {
		var child
		, template = node._template
		if (!template) {
			node._template = template = []
			for (; child = node.firstChild;) {
				template.push(child);
				node.removeChild(child)
			}
		}
		return template
	}

	El.bindings = {
		"txt": function(node, data, text) {
			node.txt(text.format(data))
		},
		"class": function(node, data, name, fn) {
			node.toggleClass(name, fn.fn("_")(data))
		},
		"html": function(node, data, html) {
			node.innerHTML = html.format(data)
		},
		"with": function(node, data, scope) {
			render.call(node, scope, true)
		},
		"if": function(node, data, fn) {
			var template = getTemplate(node)
			node.empty().append( fn.fn("_")(data) && template )
		},
		"each": function(node, data, arr) {
			var template = getTemplate(node)
			if (arr) node.empty().append(arr.map(function(obj) {
				return template.map(function(el) {
					return render.call(el.cloneNode(true), obj)
				})
			}))
		}
	}

}(window, document, "prototype")


