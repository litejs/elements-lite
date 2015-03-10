


/*
 * @version    0.5.2
 * @date       2015-02-26
 * @stability  1 - Experimental
 * @author     Lauri Rooden <lauri@rooden.ee>
 * @license    MIT License
 * @homepage   https://www.litejs.com/elements-lite/
 */



!function(window, document, protoStr) {
	var currentLang
	, hasOwn = Object.prototype.hasOwnProperty
	, body = document.body
	, createElement = document.createElement
	, txtAttr = "textContent" in body ? "textContent" : "innerText"
	, elCache = {}
	, fnCache = {}
	, proto = (window.HTMLElement || window.Element || El)[protoStr]
	, templateRe = /^([ \t]*)(@?)((?:("|')(?:\\?.)*?\4|[-\w\:.#\[\]=])*)[ \t]*(.*)$/gm
	, renderRe = /[;\s]*(\w+)(?:\s*\:((?:(["'\/])(?:\\?.)*?\3|[^;])*))?/g
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
	, selectorRe = /([.#:[])([-\w]+)(?:\((.+?)\)|([~^$*|]?)=(("|')(?:\\?.)*?\6|[-\w]+))?]?/g
	, selectorLastRe = /([\s>+]*)(?:("|')(?:\\?.)*?\2|\(.+?\)|[^\s+>])+$/
	, selectorSplitRe = /\s*,\s*(?=(?:[^'"()]|"(?:\\?.)*?"|'(?:\\?.)*?'|\(.+?\))+$)/
	, selectorCache = {}
	, selectorMap = {
		"first-child": "(a=_.parentNode)&&a.firstChild==_",
		"last-child" : "(a=_.parentNode)&&a.lastChild==_",
		".": "~_.className.split(/\\s+/).indexOf(a)",
		"#": "_.id==a",
		"^": "a.indexOf(v)==0",
		"|": "a.split('-')[0]==v",
		"$": "a.slice(-v.length)==v",
		"~": "~a.split(/\\s+/).indexOf(v)",
		"*": "~a.indexOf(v)"
	}

	function findEl(node, sel, first) {
		var el
		, i = 0
		, out = []
		, next = node.firstChild
		, fn = selectorFn(sel)

		for (; (el = next); ) {
			if (fn(el)) {
				if (first) return el
				out.push(el)
			}
			next = el.firstChild || el.nextSibling
			while (!next && ((el = el.parentNode) !== node)) next = el.nextSibling
		}
		return first ? null : out
	}

	function selectorFn(str) {
		// jshint evil:true
		return selectorCache[str] ||
		(selectorCache[str] = Function("_,v,a,b", "return " +
			str.split(selectorSplitRe).map(function(sel) {
				var relation, from
				, rules = ["_&&_.nodeType===1"]
				, parentSel = sel.replace(selectorLastRe, function(_, _rel, a, start) {
					from = start + _rel.length
					relation = _rel.trim()
					return ""
				})
				, tag = sel.slice(from).replace(selectorRe, function(_, op, key, subSel, fn, val, quotation) {
					rules.push(
						"((v='" +
						(subSel || (quotation ? val.slice(1, -1) : val) || "").replace(/'/g, "\\'") +
						"'),(a='" + key + "'),1)"
						,
						selectorMap[op == ":" ? key : op] ||
						"(a=_.getAttribute(a))" +
						(fn ? "&&" + selectorMap[fn] : val ? "==v" : "")
					)
					return ""
				})

				if (tag && tag != "*") rules[0] += "&&_.nodeName=='" + tag.toUpperCase() + "'"
				if (parentSel) rules.push(
					relation == "+" ? "(a=_.previousSibling)" : "(a=_.parentNode)",
					( relation ? "a.matches&&a.matches('" : "a.closest&&a.closest('" ) + parentSel + "')"
				)
				return rules.join("&&")
			}).join("||")
		))
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
		name = name.replace(selectorRe, function(_, op, key, _sub, fn, val, quotation) {
			val = quotation ? val.slice(1, -1) : val || key
			pre[op =
				op == "." ?
				(fn = "~", "className") :
				op == "#" ?
				"id" :
				key
			] = fn && pre[op] ?
				fn == "^" ? val + pre[op] :
				pre[op] + (fn == "~" ? " " : "") + val :
				val
			return ""
		}) || "div"

		// NOTE: IE-s cloneNode consolidates the two text nodes together as one
		// http://brooknovak.wordpress.com/2009/08/23/ies-clonenode-doesnt-actually-clone/
		el = (elCache[name] || (elCache[name] = document.createElement(name))).cloneNode(true).attr(pre)

		return silence ?
		(fnCache[name] && el.attr("data-call", name), el) :
		(fnCache[name] || (typeof args == "object" ? attr : append)).call(el, args)
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
		return this.className.split(/\s+/).indexOf(name) > -1
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
				return el
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
		} else
		//*/
		if (val) {
			el.setAttribute(key, val)
		} else {
			el.removeAttribute(key)
		}
	}

	var dataCache = {}
	, dataCacheSeq = 0

	function render(data, skipSelf) {
		var bind, newBind, fn, lang
		, node = this

		if (!data) {
			//for (;!data && node; node = node.parentNode) if (bind = node.nodeType == 1 && attr.call(node, "data-id")) {
			//	data = dataCache[bind]
			//}
			//node = this
		}

		if (bind = node.attr("data-data")) {
			node.removeAttribute("data-call")
			fnCache[bind].call(node)
		}
		if (bind = !skipSelf && node.attr("data-el-data")) {
			node.attr("data-el-data")
			fnCache[bind].call(node)
		}
		if (bind = !skipSelf && node.attr("data-bind")) {
			lang = node.attr("lang") || lang
			newBind = bind
			// i18n(bind, lang).format(data)
			// document.documentElement.lang
			// document.getElementsByTagName('html')[0].getAttribute('lang')

			fn = "n d b r->d&&(" + bind.replace(renderRe, function(_, $1, $2) {
				if (hasOwn.call(bindings[$1]||render, "once")) {
					newBind = newBind.split(_).join("")
				}
				return bindings[$1] ?
				//"(r=b." + $1 + "(n,d," + $2 + ")||r)," :
				"(r=b." + $1 + "(n,d," + (bindings[$1].raw ? "'" + $2 + "'" : $2) + ")||r)," :
				"n.attr('" + $1 + "'," + $2 + ".format(d)),"
			}) + "r)"
			if (bind != newBind) node.attr("data-bind", newBind)

			//console.log("FN", fn)

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

	if (!proto.matches) proto.matches = function(sel) {
		return !!selectorFn(sel)(this)
	}

	if (!proto.closest) proto.closest = function(sel) {
		for (var el = this; el; el = el.parentNode) if (el.matches && el.matches(sel)) return el
		return null
	}

	//** modernBrowser
	// Note: IE8 don't support :disabled
	// !+"\v1"
	// More shortest way to test for IE in javascript:
	// ie = !-[1, ]
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
	// IE 6-7
	if (proto === El[protoStr]) {
		document.createElement = function(name) {
			return Object.merge(createElement(name), proto)
		}

		// NOTE: document.body will not get extended with later added extensions
		Object.merge(body, proto)
	}
	//*/

	El[protoStr] = proto

	El.get = function(id) {
		if (typeof id == "string") id = document.getElementById(id)
		//** modernBrowser
		return id && id.to ? id : Object.merge(id, proto)
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
				if (El.plugins[name]) {
					parent = (new El.plugins[name](parent, text)).el
					stack.unshift(i)
				} else {
					parent.append(all)
				}
			} else {
				if (name) {
					parent = El(name, 0, 1).to(parent)
					// TODO:2015-02-27:lauri:should we find a child to where put a content?
					stack.unshift(i)
				}
				if (text) {
					q = text.charAt(0)
					name = text.slice(1)
					if (q == ">") {
						(indent + " " + name).replace(templateRe, work)
					} else if (q == "|" || q == "\\") {
						parent.append(name) // + "\n")
					} else if (q != "/") {
						if (q != "&") {
							name = "txt:i18n('" + text.replace(/'/g, "\\'") + "').format(d)"
						}
						parent.attr("data-bind", name)
					}
				}
			}
		}
		str.replace(templateRe, work)
		root = root.childNodes
		return root.length == 1 ? root[0] : root
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

	El.plugins = {
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
		lang = i18n[getLang(lang)]
		return lang[text] ||
		lang[text = text.slice(text.indexOf(":") + 1) || text] ||
		text
	}
	El.i18n = i18n

	function getLang(lang) {
		return lang && (
			i18n[lang = lang.toLowerCase()] ||
			i18n[lang = lang.split("-")[0]]
		) ? lang : currentLang
	}

	function setLang(lang) {
		if (currentLang != (currentLang = getLang(lang))) {
			i18n[currentLang] = i18n[currentLang] || {}
		}
		// Use setAttribute
		document.documentElement.lang = currentLang
		return currentLang
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


