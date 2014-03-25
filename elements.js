


/*
* @version    0.1.18
* @date       2014-03-25
* @stability  1 - Experimental
* @author     Lauri Rooden <lauri@rooden.ee>
* @license    MIT License
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

	proto.append = function(child, before) {
		var t = this
		if (child) {
			if (typeof child == "string" || typeof child == "number") child = El.text(child)
			else if ( !("nodeType" in child) && "length" in child ) {
				/*
				* document.createDocumentFragment is unsupported in IE5.5
				* fragment = "createDocumentFragment" in doc ? doc.createDocumentFragment() : El("div")
				*/

				for (
					var len = child.length
					, i = 0
					, fragment = doc.createDocumentFragment();
					i < len
					; ) t.append.call(fragment, child[i++]);
				child = fragment
			}

			if (child.nodeType) t.insertBefore(child,
				(before === true ? t.firstChild :
				typeof before == "number" ? t.childNodes[
					before < 0 ? t.childNodes.length - before - 2 : before
				] : before) || null
			)
			child.append_hook && child.append_hook()
			//"child_hook" in t && t.child_hook()
		}
		return t
	}

	proto.after = function(silbing, before) {
		/*
		* call append from proto so it works with DocumentFragment
		*/
		proto.append.call(silbing.parentNode, this, before ? silbing : silbing.nextSibling)
		return this
	}

	proto.to = function(parent, before) {
		proto.append.call(parent, this, before)
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

	proto.toggleClass = function(name, force) {
		if (arguments.length == 1) force = !this.hasClass(name)
		this[ force ? "addClass" : "rmClass" ](name)
		return force
	}

	proto.empty = function() {
		var t = this, node
		while (node = t.firstChild) t.kill.call(node)
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

	proto.set = function(args, val) {
		var t = this
		, key = typeof args

		if (args) {
			if (key == "string" || key == "number" || args.nodeType || "length" in args) t.append(args)
			else for (key in args)
			/** hasOwnProperty
			if (args.hasOwnProperty(arg))
			//*/
			{
				val = args[key]
				// El uses class
				if (key == "class") t.addClass(val)
				else if (typeof val == "string") {
					/*
					* Note: IE5-7 doesn't set styles and removes events when you try to set them.
					*
					* in IE6, a label with a for attribute linked to a select list
					* will cause a re-selection of the first option instead of just giving focus.
					* http://webbugtrack.blogspot.com/2007/09/bug-116-for-attribute-woes-in-ie6.html
					*/
					t.setAttribute(key, val)

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

					if (key == "name" && "\v" == "v") {
						t.mergeAttributes(doc.createElement("<INPUT name='" + key + "'/>"), false)
					}

				}
				else if (!val) t.removeAttribute(key)
				else t[key] = val
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
	*
	* Opera 9-10 have Node.text, Node.textContent
	*/

	proto.txt = function(newText) {
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


	function extend(node, key) {
		if (node) for (key in proto) node[key] = proto[key]
		return node
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



