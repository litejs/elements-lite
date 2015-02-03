


/**
 * @version    0.5.1
 * @date       2015-02-03
 * @stability  1 - Experimental
 * @author     Lauri Rooden <lauri@rooden.ee>
 * @license    MIT License
 */



!function(window, document, protoStr) {
	var currentLang
	, body = document.body
	, createElement = document.createElement
	, txtAttr = "textContent" in body ? "textContent" : "innerText"
	, elCache = {}
	, fnCache = {}
	, proto = (window.HTMLElement || window.Element || El)[protoStr]
	, selectorCache = {}
	, selectorRe = /([.#:[])([-\w]+)(?:([~^$*|]?)=((["'\/])(?:\\?.)*?\5|[-\w]+)])?]?/g
	, lastSelectorRe = /(\s*[>+]?\s*)((["'\/])(?:\\?.)*?\2|[^\s+>])+$/
	, pseudoClasses = {
		"empty": "!_.hasChildNodes()",
		"first-child": "_.parentNode&&_.parentNode.firstChild==_",
		"last-child" : "_.parentNode&&_.parentNode.lastChild==_",
		"link": "_.nodeName=='A'&&_.getAttribute('href')"
	}
	, templateRe = /^([ \t]*)(@?)((?:(["'\/])(?:\\?.)*?\4|[-\w\:.#\[\]=])+)[ \t]*(.*)$/gm
	, renderRe = /[;\s]*(\w+)(?:\s*\:((?:(["'\/])(?:\\?.)*?\3|[-,\s\w])*))?/g
	, bindings = El.bindings = {
		"class": function(node, data, name, fn) {
			toggleClass.call(node, name, fn.fn("_")(data))
		},
		"html": function(node, data, html) {
			node.innerHTML = html.format(data)
		},
		"txt": function(node, data, text) {
			node.txt(text.format(data))
		},
		"val": function(node, data, text) {
			node.val(text.format(data))
		}
	}


	/**
	 * Turns CSS selector like syntax to DOM Node
	 * @returns {Node}
	 *
	 * @example
	 * El("input#12.nice[type=checkbox]:checked:disabled[data-lang=en].class")
	 * <input id="12" class="nice class" type="checkbox" checked="checked" disabled="disabled" data-lang="en">
	 */

	function El(name, args, silence) {
		var el
		, pre = {}
		name = name.replace(selectorRe, function(_, op, key, fn, val, quotation) {
			pre[
				op == "." ?
				((pre[op = "class"] && (key = pre[op] + " " + key)), op) :
				op == "#" ?
				"id" :
				key
			] = quotation ? val.slice(1, -1) : val || key
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
		var fragment
		, el = this
		, i = 0
		, tmp = typeof child
		if (child) {
			if (tmp == "string" || tmp == "number") child = El.text(child)
			else if ( !("nodeType" in child) && "length" in child ) {
				// document.createDocumentFragment is unsupported in IE5.5
				// fragment = "createDocumentFragment" in document ? document.createDocumentFragment() : El("div")
				for (
					tmp = child.length
					, fragment = document.createDocumentFragment();
					i < tmp; ) append.call(fragment, child[i++])
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

	function toggleClass(name, force) {
		if (arguments.length == 1) force = !hasClass.call(this, name)
		return ( force ? addClass : rmClass ).call(this, name), force
	}
	proto.toggleClass = toggleClass

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

	proto.attr = attr
	function attr(key, val) {
		var el = this
		if (arguments.length == 1) {
			if (key && key.constructor === Object) {
				Object.each(key, function(val, key) {
					attr.call(el, key, val)
				})
				return
			}
			return el.getAttribute(key)
		}
		// Note: IE5-7 doesn't set styles and removes events when you try to set them.
		//
		// in IE6, a label with a for attribute linked to a select list
		// will cause a re-selection of the first option instead of just giving focus.
		// http://webbugtrack.blogspot.com/2007/09/bug-116-for-attribute-woes-in-ie6.html

		// there are bug in IE<9 where changed 'name' param not accepted on form submit
		// The JScript engine used in IE doesn't recognize vertical tabulation character
		// oldIE = "\v" == "v"
		//
		// IE8 and below also support document.createElement('<P>')
		//
		// http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
		// http://msdn.microsoft.com/en-us/library/ms536614(VS.85).aspx

		//** modernBrowser
		if ((key == "id" || key == "name" || key == "type") && "\v" == "v") {
			el.mergeAttributes(createElement('<INPUT '+key+'="' + val + '">'), false)
		} else {
			el.setAttribute(key, val)
		}
		/*/
		el.setAttribute(key, val)
		//*/
	}

	proto.set = set
	function set(args, key, val) {
		var el = this
		if (args) {
			if (typeof args == "object") for (key in args) {
				val = args[key]
				// El uses class
				if (key == "class") addClass.call(el, val)
				else if (typeof val == "string") {
					attr.call(el, key, val)
				}
				else if (!val) el.removeAttribute(key)
			}
			else append.call(el, args)
		}
		return el
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

			if (Fn(fn)(node, data, bindings)) return node
		}

		for (node = node.firstChild; node; node = node.nextSibling) {
			if (node.nodeType == 1) {
				render.call(node, data)
			}
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
		return arguments.length ? (this[txtAttr] = newText) : this[txtAttr]
	}

	proto.val = function(val) {
		var el = this
		, type = el.type
		, opts = el.options

		if (arguments.length) {
			return el.value = val
		}

		if (type == "select-multiple") {
			for (val = [], type = 0; el = opts[type++];) {
				if (el.selected && !el.disabled && !el.parentNode.disabled) val.push(el.value)
			}
			return val
		}

		return (type == "checkbox" || type == "radio") && !el.checked ? "" :
			el.value ||
			options && options[el.selectedIndex].value ||
			"on"
	}

	function findEl(node, sel, first) {
		var el
		, i = 0
		, out = []
		, els = node.getElementsByTagName("*")
		, fn = selectorFn(sel)

		for (; (el = els[i++]); ) if (fn(el)) {
			if (first) return el
			out.push(el)
		}
		return first ? null : out
	}

	function selectorFn(str) {
		// jshint evil:true
		return selectorCache[str] ||
		(selectorCache[str] = Function("_,a", "return " +
			str.split(/\s*,\s*/).map(function(sel) {
				var relation, from
				, rules = ["_"]
				, parentSel = sel.replace(lastSelectorRe, function(_, _rel, a, b, start) {
					from = start + _rel.length
					relation = _rel.trim()
					return ""
				})
				, tag = sel.slice(from).replace(selectorRe, function(_, op, key, fn, val, quotation, len) {
					if (quotation) val = val.slice(1, -1)
					if (val) {
						len = val.length
						val = val.replace(/'/g, "\\'")
					}
					rules.push(
						op == "." ? "(' '+_.className+' ').indexOf(' " + key + " ')>-1" :
						op == "#" ? "_.id=='" + key + "'" :
						op == ":" && pseudoClasses[key] ||
						"(a=_.getAttribute('" + key + "'))" + (!fn && val ? "=='" + val + "'" : "")
					)
					if (fn) rules.push(
						fn == "^" ? "a.slice(0," + len + ")=='" + val + "'" :
						fn == "|" ? "a.split('-')[0]=='" + val + "'" :
						fn == "$" ? "a.slice(-" + len + ")=='" + val + "'" :
						fn == "~" ? "(' '+a+' ').indexOf(' " + val + " ')>-1" :
						"a.indexOf('" + val + "')>-1" // fn == "*"
					)
					return ""
				})

				if (tag && tag != "*") rules.splice(1, 0, "_.nodeName=='" + tag.toUpperCase() + "'")
				if (parentSel) rules.push(
					relation == "+" ? "(a=_.previousSibling)" : "(a=_.parentNode)",
					( relation ? "a.matches&&a.matches('" : "a.closest&&a.closest('" ) + parentSel + "')"
				)
				return rules.join("&&")
			}).join("||")
		))
	}

	proto.matches = proto.matches || function(sel) {
		return !!selectorFn(sel)(this)
	}

	proto.closest = proto.closest || function(sel) {
		for (var el = this; el; el = el.parentNode) if (el.matches && el.matches(sel)) return el
		return null
	}

	//** modernBrowser
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
	/*/
	proto.find = proto.querySelector
	proto.findAll = function(sel) {
		return new ElWrap(this.querySelectorAll(sel))
	}
	//*/


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

	//** modernBrowser
	function extend(node, key) {
		if (node) for (key in proto) node[key] = proto[key]
		return node
	}

	// IE 6-7
	if (proto === El[protoStr]) {
		document.createElement = function(name) {
			return extend(createElement(name))
		}

		// NOTE: document.body will not get extended with later added extensions
		extend(body)
	}
	//*/

	El[protoStr] = proto

	El.get = function(id) {
		if (typeof id == "string") id = document.getElementById(id)
		//** modernBrowser
		return id && id.to ? id : extend(id)
		/*/
		return id
		//*/
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
						(indent +" "+ text.slice(1)).replace(templateRe, work)
					} else if (q == "=") {
						parent.set({"data-bind": text.slice(1)})
					} else {
						parent.append(text.replace(/\\([=>:])/g, "$1"))
					}
				}
			}
		}
		str.replace(templateRe, work)
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
	// navigator.userLanguage for IE, navigator.language for others
	// var lang = navigator.language || navigator.userLanguage;
	// setLang("en")
	//*/

}(window, document, "prototype")


