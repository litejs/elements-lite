


/*
* @version  0.1.16
* @date     2014-03-21
* @author   Lauri Rooden <lauri@rooden.ee>
* @license  MIT License
*/


/* TODO: find ways for automated testing
* http://www.browserscope.org/user/tests/howto
*/


!function(root, doc, protoStr) {
	var elCache = {}
	, fnCache = {}
	, proto = (root.HTMLElement || root.Element || El)[protoStr]
	, elRe = /([.#:[])([-\w]+)(?:=((["'\/])(?:\\.|.)*?\4|[-\w]+)])?]?/g


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

		/*
		* NOTE: IE’s cloneNode operation consolidates the two text nodes together as one
		* http://brooknovak.wordpress.com/2009/08/23/ies-clonenode-doesnt-actually-clone/
		*/

		el = (elCache[name] || (elCache[name] = doc.createElement(name))).cloneNode(true).set(pre)

		return fnCache[name] && fnCache[name](el, args) || el.set(args)
	}



	/* TODO: Extend El api
	* add El.siblings( [selector ] )
	* add El.children( [selector ] )
	* add El.invoke
	* https://github.com/WebReflection/dom4#dom4
	*/

	/*
	* How elements.js extends the DOM
	* -------------------------------
	*
	* All DOM extensions on the element are available by default.
	*
	* In browsers that does not support adding methods to prototype of native objects
	* such as HTMLElement or Element, document.createElement will be overrided
	* to extend created elements. El.get() and element.find will extend
	* returned elements.
	*/



	/*
	* ### element.append( content, [ before ] ) -> element
	*
	* - **content** `element || Array || String || Number`
	* - **before** `optional`
	*     - true - Insert content to the beginning of element
	*     - element - Insert content before specified element
	*     - Number - Insert content before nth child
	*/

	proto.append = function(e, before) {
		var t = this
		if (e) {
			if (typeof e == "string" || typeof e == "number") e = El.text(e)
			else if ( !("nodeType" in e) && "length" in e ) {
				/*
				* document.createDocumentFragment is unsupported in IE5.5
				* f = "createDocumentFragment" in doc ? doc.createDocumentFragment() : El("div")
				*/

				for (
					var len = e.length
					, i = 0
					, f = doc.createDocumentFragment();
					i < len
					; ) t.append.call(f, e[i++]);
				e = f
			}

			if (e.nodeType) t.insertBefore(e,
				(before === true ? t.firstChild :
				typeof before == "number" ? t.childNodes[
					before < 0 ? t.childNodes.length - before - 2 : before
				] : before) || null
			)
			e.append_hook && e.append_hook()
			//"child_hook" in t && t.child_hook()
		}
		return t
	}

	proto.after = function(e, before) {
		e.parentNode.append(this, before ? e : e.nextSibling)
		return this
	}

	proto.to = function(e, before) {
		/*
		* call append from proto so it works with DocumentFragment
		*/
		proto.append.call(e, this, before)
		return this
	}

	proto.hasClass = function(name) {
		/*
		* http://jsperf.com/regexp-indexof-perf/32
		* return (" "+this.className+" ").indexOf(" "+name+" ") > -1
		*/
		return RegExp("\\b" + name + "\\b").test(this.className)
	}

	proto.addClass = function(name) {
		var t = this
		t.className += t.className == "" ? name : t.hasClass(name) ? "" : " " + name
		return t
	}

	proto.rmClass = function(name) {
		var t = this
		t.className = (" "+t.className+" ").replace(" "+name+" "," ").trim()
		return t
	}

	proto.toggleClass = function(name, s) {
		if (arguments.length == 1) s = !this.hasClass(name)
		this[ s ? "addClass" : "rmClass" ](name)
		return s
	}

	proto.empty = function() {
		var t = this, n
		while (n = t.firstChild) t.kill.call(n)
		return t
	}

	proto.kill = function() {
		var t = this
		t.parentNode && t.parentNode.removeChild(t)
		Event.removeAll && Event.removeAll(t)
		t.kill_hook && t.kill_hook()
		t.empty && t.empty()
		return t
	}

	proto.on = function(ev, fn) {
		Event.add(this, ev, fn)
		return this
	}

	proto.non = function(ev, fn) {
		Event.remove(this, ev, fn)
		return this
	}

	proto.set = function(args) {
		var t = this, k = typeof args, v
		if (args) {
			if (k == "string" || k == "number" || args.nodeType || "length" in args) t.append(args)
			else for (k in args)
			/** hasOwnProperty
			if (args.hasOwnProperty(arg))
			//*/
			{
				v = args[k]
				// El uses class
				if (k == "class") t.addClass(v)
				else if (typeof v == "string") {
					/*
					* Note: IE5-7 doesn't set styles and removes events when you try to set them.
					*
					* in IE6, a label with a for attribute linked to a select list
					* will cause a re-selection of the first option instead of just giving focus.
					* http://webbugtrack.blogspot.com/2007/09/bug-116-for-attribute-woes-in-ie6.html
					*/
					t.setAttribute(k, v)

					/*
					* there are bug in IE<9 where changed 'name' param not accepted on form submit
					* The JScript engine used in IE doesn't recognize vertical tabulation character
					* oldIE = "\v" == "v"
					* 
					* IE8 and below also support document.createElement('<P>')
					*
					* http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
					* http://msdn.microsoft.com/en-us/library/ms536614(VS.85).aspx
					*/

					if (k == "name" && "\v" == "v") {
						t.mergeAttributes(doc.createElement("<INPUT name='" + k + "'/>"), false)
					}

				}
				else if (!v) t.removeAttribute(k)
				else t[k] = v
			}
		}
		return t
	}


	/*
	* In Safari 2.x, innerText functions properly only 
	* if an element is neither hidden (via style.display == "none") 
	* nor orphaned from the document. 
	* Otherwise, innerText results in an empty string.
	*
	* textContent is suported from IE9
	*/

	proto.text = function(newText) {
		var t = this
		, attr = "textContent" in t ? "textContent" : "innerText"
		return arguments.length ? (t[attr] = newText) : t[attr]
	}

	/*
	* Expose slow find for testing
	*
	* TODO: look another way
	* http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
	*/

	proto._find = function(sel) {
		var el
		, i = 0
		, rules = ["_"]
		, tag = sel.replace(elRe, function(_, o, s, v) {
				rules.push(
					o == "." ? "(' '+_.className+' ').indexOf(' "+s+" ')>-1" :
					o == "#" ? "_.id=='"+s+"'" :
					"_.getAttribute('"+s+"')"+(v?"=='"+v+"'":"")
				)
				return ""
			}) || "*"
		, els = this.getElementsByTagName(tag)
		, fn = Function("_", "return " + rules.join("&&"))

		while (el = els[i++]) {
			if (fn(el)) {
				return el.to ? el : extend(el)
			}
		}
	}

	proto.find = doc.querySelector ?
		function(sel) {
			/*
			* Note: IE8 don't support :disabled
			*/
			return this.querySelector(sel)
		} : proto._find


	function extend(e, p, k) {
		if (e) {
			p = El[protoStr]
			for (k in p) e[k] = p[k]
		}
		return e
	}



	if (proto === El[protoStr]) {
		/*
		* IE 6-7
		*/

		var create = doc.createElement
		doc.createElement = function(name) {return extend(create(name))}

		extend(doc.body)

		/*
		* Remove background image flickers on hover in IE6
		*
		* You could also use CSS
		* html { filter: expression(document.execCommand("BackgroundImageCache", false, true)); }
		*/
		/*@cc_on try{document.execCommand('BackgroundImageCache',false,true)}catch(e){}@*/
	}

	El[protoStr] = proto


	El.get = function(id) {
		if (typeof id == "string") id = doc.getElementById(id)
		return id && id.to ? id : extend(id)
	}

	El.cache = function(name, el, custom) {
		elCache[name] = typeof el == "string" ? El(el) : el
		if (custom) {
			fnCache[name] = custom
		}
	}
	El.cache.el = elCache
	El.cache.fn = fnCache
	El.text = function(str) {
		return doc.createTextNode(str)
	}
	root.El = El

}(window, document, "prototype")



