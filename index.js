


/**
 * @version    0.3.8
 * @date       2014-09-19
 * @stability  1 - Experimental
 * @author     Lauri Rooden <lauri@rooden.ee>
 * @license    MIT License
 */



!function(window, document, protoStr) {
	var currentLang
	, elCache = {}
	, fnCache = {}
	, createElement = document.createElement
	, proto = (window.HTMLElement || window.Element || El)[protoStr]
	, elRe = /([.#:[])([-\w]+)(?:=((["'\/])(?:\\?.)*?\4|[-\w]+)])?]?/g
	, tplRe = /^([ \t]*)(\:?)((?:(["'\/])(?:\\?.)*?\4|[-\w\:.#\[\]=])+)[ \t]*(.*)$/gm
	, renderRe = /[;\s]*(\w+)(?:\s*\:((?:(["'\/])(?:\\?.)*?\3|[-,\s\w])*))?/g
	, bindings = El.bindings = {
		"txt": function(node, data, text) {
			node.txt(text.format(data))
		},
		"class": function(node, data, name, fn) {
			node.toggleClass(name, fn.fn("_")(data))
		},
		"html": function(node, data, html) {
			node.innerHTML = html.format(data)
		},
		"each": function(node, data, arr) {
			var childs = getChilds(node)
			if (arr) node.empty().append(arr.map(function(obj) {
				return childs.map(function(el) {
					return render.call(el.cloneNode(true), obj)
				})
			}))
			return node
		}
	}


	/**
	 * Turns CSS selector like syntax to DOM Node
	 * @example
	 * El("input#123.nice[type=checkbox]:checked:disabled[data-lang=en]")
	 * @returns {Node}
	 */

	function El(name, args, silence) {
		var el
		, pre = {}
		name = name.replace(elRe, function(_, op, key, val, quotation) {
			pre[
				op == "." ? (op = "class", (pre[op] && (key = pre[op] + " " + key)), op) :
				op == "#" ? "id" :
				key
			] = (quotation ? val.slice(1, -1): val) || key
			return ""
		}) || "div"

		// NOTE: IE-s cloneNode consolidates the two text nodes together as one
		// http://brooknovak.wordpress.com/2009/08/23/ies-clonenode-doesnt-actually-clone/
		el = (elCache[name] || (elCache[name] = document.createElement(name))).cloneNode(true).set(pre)

		return silence ?
		(fnCache[name] && el.setAttribute("data-call", name), el) :
		fnCache[name] && fnCache[name].call(el, args) || el.set(args)
	}
	window.El = El

	function append(child, before) {
	       var el = this
	       if (child) {
			if (typeof child == "string" || typeof child == "number") child = El.text(child)
			else if ( !("nodeType" in child) && "length" in child ) {
				// document.createDocumentFragment is unsupported in IE5.5
				// fragment = "createDocumentFragment" in document ? document.createDocumentFragment() : El("div")
				for (
					var len = child.length
					, i = 0
					, fragment = document.createDocumentFragment();
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
		return (" " + this.className + " ").indexOf(" " + name + " ") > -1
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
		el.className = (" "+el.className+" ").replace(" "+name+" ", " ").trim()
		return el
	}
	proto.rmClass = rmClass

	proto.toggleClass = function(name, force) {
		if (arguments.length == 1) force = !hasClass.call(this, name)
		return ( force ? addClass : rmClass ).call(this, name), force
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
					el.mergeAttributes(createElement('<INPUT '+key+'="' + val + '"/>'), false)
				}
			} else el[key] = val
		}
		return el
	}

	// Save node initial content for later use
	function getChilds(node) {
		var child
		, childs = node._childs
		if (!childs) {
			node._childs = childs = []
			for (; child = node.firstChild;) {
				childs.push(child);
				node.removeChild(child)
			}
		}
		return childs
	}

	function render(data, skipSelf) {
		var bind, fn, lang
		, node = this

		if (bind = !skipSelf && node.getAttribute("data-call")) {
			node.removeAttribute("data-call")
			fnCache[bind].call(node)
		}
		if (bind = !skipSelf && node.getAttribute("data-bind")) {
			lang = node.getAttribute("lang") || lang
			// HACK: allow .el ={name} short syntax
			if (bind.charAt(0) == "{") bind='txt:"' + bind.replace(/"/g, '\\"') + '"'
			// i18n(bind, lang).format(data)
			// document.documentElement.lang
			// document.getElementsByTagName('html')[0].getAttribute('lang')

			fn = "n d p r->d&&(" + bind.replace(renderRe, "(p['$1']?(r=p['$1'](n,d,$2)||r):(n['$1']=$2.format(d))),") + "r)"

			if (fn.fn()(node, data, bindings)) return node
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
	// Opera 9-10 have Node.text so we use Node.txt

	proto.txt = function(newText) {
		var el = this
		, attr = "textContent" in el ? "textContent" : "innerText"
		return arguments.length ? (el[attr] = newText) : el[attr]
	}

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
	proto.find = "\v" !== "v" && proto.querySelector || function(sel) {
		return findEl(this, sel, true)
	}

	proto.findAll = proto.querySelectorAll ?
		function(sel) {
			return new ElWrap(this.querySelectorAll(sel))
		} :
		function(sel) {
			return new ElWrap(findEl(this, sel))
		}

	function ElWrap(nodes) {
		this._nodes = nodes
	}
	El.wrap = ElWrap

	ElWrap.prototype = Object.keys(proto).reduce(function(memo, key) {
		memo[key] = function() {
			var nodes = this._nodes
			, i = 0
			, len = nodes.length
			for (; i < len; ) {
				proto[key].apply(nodes[i++], arguments)
			}
			return this
		}
		return memo
	}, {})

	function extend(node, key) {
		if (node) for (key in proto) node[key] = proto[key]
		return node
	}

	// IE 6-7
	if (proto === El[protoStr]) {
		document.createElement = function(name) {return extend(createElement(name))}

		// NOTE: document.body will not get extended with later added extensions
		extend(document.body)

		// Remove background image flickers on hover in IE6
		//
		// You could also use CSS
		// html { filter: expression(document.execCommand("BackgroundImageCache", false, true)); }
		/*@cc_on try{document.execCommand('BackgroundImageCache',false,true)}catch(e){}@*/
	}

	El[protoStr] = proto

	El.get = function(id) {
		if (typeof id == "string") id = document.getElementById(id)
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
		return document.createTextNode(str)
	}

	//** templates

	function tpl(str) {
		var root = document.createDocumentFragment()
		, parent = root
		, stack = [-1]

		function work(all, indent, plugin, name, q, text) {
			for (var i = indent.length; i <= stack[0]; ) {
				stack.shift()
				parent = (parent.plugin) ? parent.plugin.done() : parent.parentNode
			}

			if (plugin) {
				if (tpl.plugins[name]) {
					parent = (new tpl.plugins[name](parent, text)).el
					stack.unshift(i)
				} else {
					parent.append(El.text( name == "text" ? text : all ))
				}
			} else {
				if (name) {
					parent = El(name, 0, 1).to(parent)
					stack.unshift(i)
				}
				if (text) {
					q = text.charAt(0)
					if (q == ">") {
						(indent +" "+ text.slice(1)).replace(tplRe, work)
					} else if (q == "=") {
						parent.set({"data-bind": text.slice(1)})
					} else {
						parent.append(text.replace(/\\([=>:])/g, "$1"))
					}
				}
			}
		}
		str.replace(tplRe, work)
		root = root.childNodes
		if (root.length == 1) return root[0]

		for (stack = [], parent = root.length; parent--;) stack[parent] = root[parent]
		return stack
	}

	function template(parent, name) {
		var t = this
		t.name = name
		t.parent = parent
		t.el = El("div")
		t.el.plugin = t
		return t
	}

	template.prototype.done = function() {
		var t = this
		El.cache(t.name, t.el.removeChild(t.el.firstChild), render)
		t.el.plugin = null
		return t.parent
	}

	tpl.plugins = {
		"template": template
	}

	El.create = El.tpl = function(str) {
		return tpl(str).render()
	}
	El.include = function(id, data, parent) {
		var src = El.get(id)
		new template(null, id).el.append( El.tpl(src.innerHTML) ).plugin.done()
		src.kill()
	}
	//*/


	//** i18n
	function i18n(text, lang) {
		return i18n[ lang ? getLang(lang) : currentLang ][text] || text
	}
	El.i18n = i18n

	function getLang(lang) {
		if (!lang) return currentLang
		lang = (lang || "").toLowerCase()
		return i18n[lang] ? lang : ((lang = lang.split("-")[0]), i18n[lang]) ? lang : currentLang
	}

	function setLang(lang) {
		lang = getLang(lang)
		if (currentLang != (currentLang = lang)) {
			i18n[lang] = i18n[lang] || {}
		}
		// Use setAttribute
		document.documentElement.lang = lang
		return lang
	}

	function addLang(lang, texts) {
		Object.merge(i18n[lang] || (i18n[lang] = {}), texts)
	}

	i18n.get = getLang
	i18n.use = setLang
	i18n.add = addLang
	i18n.def = function(map) {
		Object.each(map, function(name, tag) {
			addLang(tag, map)
		})
	}
	// setLang("en")
	//*/

}(window, document, "prototype")


