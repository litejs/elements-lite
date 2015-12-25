


/*
 * @version    0.8.2
 * @date       2015-12-16
 * @stability  1 - Experimental
 * @author     Lauri Rooden <lauri@rooden.ee>
 * @license    MIT License
 * @homepage   https://www.litejs.com/elements-lite/
 */



!function(window, document, protoStr) {
	var currentLang, styleNode
	// JScript engine in IE<9 does not recognize vertical tabulation character
	, ie678 = !+"\v1"
	, ie67 = ie678 && (document.documentMode|0) < 8
	, hasOwn = Object[protoStr].hasOwnProperty
	, wrapProto = []
	, head = document.getElementsByTagName("head")[0]
	, body = document.body
	, createElement = document.createElement
	, txtAttr = "textContent" in body ? "textContent" : "innerText"
	, elCache = El.cache = {}
	, scopeSeq = 0
	, scopeData = El.data = { window: window, _: i18n }
	, proto = (window.HTMLElement || window.Element || El)[protoStr]
	, templateRe = /^([ \t]*)(@?)((?:("|')(?:\\?.)*?\4|[-\w\:.#\[\]=])*)[ \t]*(.*?)$/gm
	, renderRe = /[;\s]*(\w+)(?:\s*\:((?:(["'\/])(?:\\?.)*?\3|[^;])*))?/g
	, bindings = El.bindings = {
		"class": function(name, fn) {
			toggleClass.call(this, name, arguments.length < 2 || fn)
		},
		css: function(key, val) {
			this.style[key.camelCase()] = val || ""
		},
		data: function(key, val) {
			this.attr("data-" + key, val)
		},
		html: function(html) {
			this.innerHTML = html
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
				, rules = ["_&&_.nodeType==1"]
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
				(fn = "~", "class") :
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

		return silence || !args ? el :
		(typeof args == "object" ? attr : append).call(el, args)
	}
	window.El = El

	function append(child, before) {
		var fragment
		, el = this
		, i = 0
		, tmp = typeof child
		if (child) {
			if (tmp == "string" || tmp == "number") child = document.createTextNode(child)
			else if ( !("nodeType" in child) && "length" in child ) {
				// document.createDocumentFragment is unsupported in IE5.5
				// fragment = "createDocumentFragment" in document ? document.createDocumentFragment() : El("div")
				for (
					tmp = child.length
					, fragment = document.createDocumentFragment();
					i < tmp; ) append.call(fragment, child[i++])
				child = fragment
			}

			if (child.nodeType) {
				tmp = el.insertBefore ? el : el[el.length - 1]
				tmp.insertBefore(child,
					(before === true ? tmp.firstChild :
					typeof before == "number" ? tmp.childNodes[
						before < 0 ? tmp.childNodes.length - before - 2 : before
					] : before) || null
				)
			}
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
		, current = el.className

		if (current) {
			name = hasClass.call(el, name) ? current : current + " " + name
		}

		if (current != name) el.className = name
		return el
	}
	proto.addClass = addClass

	function rmClass(name) {
		var el = this

		if (hasClass.call(el, name)) {
			el.className = (" " + el.className + " ").replace(" " + name + " ", " ").trim()
		}

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
		var id
		, el = this
		if (el.emit) el.emit("kill")
		if (el.parentNode) el.parentNode.removeChild(el)
		if (Event.removeAll) Event.removeAll(el)
		if (el.empty) el.empty()
		if (id = el.attr && el.attr("data-scope")) {
			delete elScope[id]
		}
		if (el.valObject) el.valObject = null
		return el
	}
	proto.kill = kill

	proto.on = function(ev, fn) {
		// element.setCapture(retargetToElement)
		Event.add(this, ev, fn)
		return this
	}

	proto.non = function(ev, fn) {
		Event.remove(this, ev, fn)
		return this
	}
	proto.emit = function() {
		Event.Emitter.emit.apply(this, arguments)
	}

	proto.attr = attr
	function attr(key, val) {
		var current
		, el = this

		if (key && key.constructor == Object) {
			for (val in key) {
				attr.call(el, val, key[val])
			}
			return el
		}

		current = el.getAttribute(key)

		if (arguments.length == 1) {
			return current
		}
		// Note: IE5-7 doesn't set styles and removes events when you try to set them.
		//
		// in IE6, a label with a for attribute linked to a select list
		// will cause a re-selection of the first option instead of just giving focus.
		// http://webbugtrack.blogspot.com/2007/09/bug-116-for-attribute-woes-in-ie6.html

		// there are bug in IE<9 where changed 'name' param not accepted on form submit
		// IE8 and below support document.createElement('<P>')
		//
		// http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
		// http://msdn.microsoft.com/en-us/library/ms536614(VS.85).aspx

		//** modernBrowser
		if (ie67 && (key == "id" || key == "name" || key == "checked")) {
			el.mergeAttributes(createElement('<INPUT '+key+'="' + val + '">'), false)
		} else
		//*/
		if (key == "class") {
			addClass.call(el, val)
		} else if (val || val === 0) {
			if (current != val) {
				el.setAttribute(key, val)
			}
		} else if (current) {
			el.removeAttribute(key)
		}
	}

	function elScope(node, parent, _scope) {
		if (_scope = elScope[attr.call(node, "data-scope")]) {
			return _scope
		}
		if (!parent || parent === true) {
			_scope = closest.call(node, "[data-scope]")
			_scope = _scope && elScope[attr.call(_scope, "data-scope")] || scopeData
		}
		if (parent) {
			attr.call(node, "data-scope", ++scopeSeq)
			_scope = elScope[scopeSeq] = Object.create(parent = (_scope || parent))
			_scope._super = parent
		}
		return _scope
	}
	El.scope = elScope

	function render(scope, skipSelf) {
		var bind, newBind, fn
		, node = this

		if (node.nodeType != 1) {
			return node
		}

		// TODO:2015-05-25:lauri:Use elScope
		scope = elScope[attr.call(node, "data-scope")]
		|| scope
		|| (bind = closest.call(node, "[data-scope]")) && elScope[attr.call(bind, "data-scope")]
		|| scopeData

		if (bind = !skipSelf && attr.call(node, "data-bind")) {
			newBind = bind
			// i18n(bind, lang).format(scope)
			// document.documentElement.lang
			// document.getElementsByTagName('html')[0].getAttribute('lang')

			fn = "data b r->data&&(" + bind.replace(renderRe, function(_, $1, $2) {
				return bindings[$1] ?
				(hasOwn.call(bindings[$1], "once") && (newBind = newBind.replace(_, "")),
					"(r=b['" + $1 + "'].call(this," + (bindings[$1].raw ? "data,'" + $2 + "'" : $2) + ")||r),") :
				"this.attr('" + $1 + "'," + $2 + "),"
			}) + "r)"
			if (bind != newBind) attr.call(node, "data-bind", newBind)

			try {
				if (Fn(fn, node, scope)(scope, bindings)) {
					return node
				}
			} catch (e) {
				//** debug
				e.message += " in binding: " + bind
				console.error(e)
				if (window.onerror) window.onerror(e.message, e.fileName, e.lineNumber)
				//*/
				return node
			}
		}

		for (bind = node.firstChild; bind; bind = newBind) {
			newBind = bind.nextSibling
			render.call(bind, scope)
		}
		//** modernBrowser
		if (ie678 && node.nodeName == "SELECT") {
			node.parentNode.insertBefore(node, node)
		}
		//*/
		return node
	}

	proto.render = render

	// In Safari 2.x, innerText functions properly only
	// if an element is neither hidden (via style.display == "none")
	// nor orphaned from the document.
	// Otherwise, innerText results in an empty string.
	//
	// textContent is suported from IE9
	// Opera 9-10 have Node.text so we use Node.txt

	proto.txt = bindings.txt = function(newText) {
		return arguments.length && this[txtAttr] != newText ? (
			//** modernBrowser
			// Fix for IE5-7
			//(ie67 && this.tagName == "OPTION" && (this.label = newText)),
			//*/
			this[txtAttr] = newText
		) : this[txtAttr]
	}

	proto.val = bindings.val = function(val) {
		var el = this
		, type = el.type
		, opts = el.options

		if (arguments.length) {
			return el.value = val
		}

		if (opts) {
			if (type == "select-multiple") {
				for (val = [], type = 0; el = opts[type++]; ) {
					if (el.selected && !el.disabled) {
						val.push(el.valObject || el.value)
					}
				}
				return val
			}
			el = opts[el.selectedIndex] || el
		}

		return (type == "checkbox" || type == "radio") && !el.checked ? null :
		el.valObject || el.value
	}

	// Element.matches is supported from Chrome 34, Firefox 34
	if (!proto.matches) proto.matches = function(sel) {
		return !!selectorFn(sel)(this)
	}

	// Element.closest is supported from Chrome 41, Firefox 35
	if (!proto.closest) proto.closest = closest

	function closest(sel) {
		for (var el = this; el; el = el.parentNode) if (el.matches && el.matches(sel)) return el
		return null
	}

	//** modernBrowser
	// Note: IE8 don't support :disabled
	proto.find = !ie678 && proto.querySelector || function(sel) {
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
		/**
		 *  1. Extended array size will not updated
		 *     when array elements set directly in Android 2.2.
		 */
		for (var pos = this.length /* 1 */ = nodes.length; pos--; ) {
			this[pos] = nodes[pos]
		}
	}
	El.wrap = ElWrap

	ElWrap[protoStr] = Object.keys(proto).reduce(function(memo, key) {
		memo[key] = wrap
		function wrap() {
			for (var val, i = 0, len = this.length; i < len; ) {
				val = proto[key].apply(this[i++], arguments)
				if (wrap.first && val) return val
			}
			return wrap.first ? null : this
		}
		return memo
	}, wrapProto)

	wrapProto.find.first = 1

	wrapProto.cloneNode = function(deep) {
		return new ElWrap(this.map(function(el) {
			return el.cloneNode(deep)
		}))
	}

	//** modernBrowser
	// IE 6-7
	if (proto == El[protoStr]) {
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

	El.css = function(str) {
		if (!styleNode) {
			// Safari and IE6-8 requires dynamically created
			// <style> elements to be inserted into the <head>
			styleNode = El("style").to(head)
		}
		if (styleNode.styleSheet) styleNode.styleSheet.cssText += str
		else styleNode.appendChild(document.createTextNode(str))
	}

	//** templates

	function tpl(str) {
		var root = document.createDocumentFragment()
		, parent = root
		, stack = [-1]

		function work(all, indent, plugin, name, q, text) {
			for (var i = indent.length; i <= stack[0]; ) {
				stack.shift()
				parent = (parent.plugin) ? parent.plugin.done() : parent.parentNode || parent[0].parentNode
			}

			if (parent.txtMode) {
				parent.txt += all + "\n"
			} else if (plugin) {
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
							name = (parent.tagName == "INPUT" ? "val" : "txt")
							+ ":_('" + text.replace(/'/g, "\\'") + "').format(data)"
						}
						q = attr.call(parent, "data-bind")
						attr.call(parent, "data-bind", (q ? q + ";" : "") + name)
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
	}

	template[protoStr] = {
		_done: function() {
			var t = this
			, el = t.el.childNodes.length > 1 ? new ElWrap(t.el.childNodes) : t.el.firstChild
			t.el.plugin = t.el = t.parent = null
			return el
		},
		done: function() {
			var t = this
			, parent = t.parent
			elCache[t.name] = t._done()
			return parent
		}
	}

	function js(parent) {
		var t = this
		t.txtMode = t.parent = parent
		t.txt = ""
		t.plugin = t.el = t
	}

	js[protoStr].done = Fn("Function(this.txt)(),this.parent")

	El.plugins = {
		"js": js,
		"template": template
	}

	El.create = El.tpl = tpl

	El.include = function(id, data, parent) {
		var src = El.get(id)
		new template(null, id).el.append( tpl(src.innerHTML) ).plugin.done()
		src.kill()
	}
	//*/


	//** i18n
	function i18n(text, lang) {
		lang = i18n[i18nGet(lang) || currentLang]
		return lang[text] ||
		lang[text = text.slice(text.indexOf(":") + 1) || text] ||
		text
	}
	El.i18n = i18n

	function i18nGet(lang) {
		return lang && (
			i18n[lang = ("" + lang).toLowerCase()] ||
			i18n[lang = lang.split("-")[0]]
		) && lang
	}

	function i18nUse(lang) {
		lang = i18nGet(lang)
		if (lang && currentLang != lang) {
			i18n[currentLang = i18n.current = lang] = i18n[currentLang] || {}
		}
		return currentLang
	}

	function i18nAdd(lang, texts) {
		if (i18n.list.indexOf(lang) == -1) i18n.list.push(lang)
		Object.merge(i18n[lang] || (i18n[lang] = {}), texts)
		if (!currentLang) i18nUse(lang)
	}

	i18n.list = []
	i18n.get = i18nGet
	i18n.use = i18nUse
	i18n.add = i18nAdd
	i18n.def = function(map) {
		Object.each(map, function(name, tag) {
			i18nAdd(tag, map)
		})
	}
	String[protoStr].lang = function(lang) {
		return i18n(this, lang)
	}
	// navigator.userLanguage for IE, navigator.language for others
	// var lang = navigator.language || navigator.userLanguage;
	// i18nUse("en")
	//*/

}(window, document, "prototype")


