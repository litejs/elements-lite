


/*
* @version  0.0.1
* @author   Lauri Rooden - https://github.com/litejs/el-lite
* @license  MIT License  - http://lauri.rooden.ee/mit-license.txt
*/



!function(win/* window */, doc, P/* String "prototype" */) {

	//** Page builder

	var elCache = {}
	, fnCache = {}
	, el_re = /([.#:])([-\w]+)/g
	, a = {
		/* TODO: Extend El api
		* add El.siblings( [selector ] )
		* add El.children( [selector ] )
		* add El.invoke
		* https://github.com/WebReflection/dom4#dom4
		*/
		append: function(e, b/*efore*/) {
			var t = this
			if (e) {
				if (typeof e == "string" || typeof e == "number") e = El.text(e)
				else if ( !("nodeType" in e) && "length" in e ) {
					// document.createDocumentFragment is unsupported in IE5.5
					// f = "createDocumentFragment" in doc ? doc.createDocumentFragment() : El("div")
					var len = e.length, i = 0, f = doc.createDocumentFragment()
					while (i<len) t.append.call(f, e[i++])
					e = f
				}

				if (e.nodeType) t.insertBefore(e, b ? (b===true ? t.firstChild : typeof b == "number" ? t.childNodes[b] : b) : null)
				e.append_hook && e.append_hook()
				//"child_hook" in t && t.child_hook()
			}
			return t
		},

		after: function(e, b) {
			e.parentNode.append(this, b ? e : e.nextSibling)
			return this
		},

		to: function(e, b) {
			e.append(this, b)
			return this
		},

		hasClass: function(n) {
			return (" "+this.className+" ").indexOf(" "+n+" ") > -1
		},

		addClass: function(n) {
			var t = this
			t.className += t.className == "" ? n : t.hasClass(n) ? "" : " " + n
			return t
		},

		rmClass: function(n) {
			var t = this
			t.className = (" "+t.className+" ").replace(" "+n+" "," ").trim()
			return t
		},

		toggleClass: function(n, s) {
			if (s === void 0) s = !this.hasClass(n) // arguments.length == 1
			this[ s ? "addClass" : "rmClass" ](n)
			return s
		},

		empty: function() {
			var t = this, n
			while (n = t.firstChild) t.kill.call(n)
			return t
		},

		kill: function() {
			var t = this
			if (t.parentNode) t.parentNode.removeChild(t)
			Event.removeAll(t)
			t.empty && t.empty()
			t.kill_hook && t.kill_hook()
			return t
		},

		on: function(ev, fn) {
			Event.add(this, ev, fn)
			return this
		},

		non: function(ev, fn) {
			Event.remove(this, ev, fn)
			return this
		},

		set: function(args) {
			var t = this, k = typeof args, v
			if (args) {
				if (k == "string" || k == "number" || args.nodeType || "length" in args) t.append(args)
				else for (k in args) 
				/** hasOwnProperty
				if (args.hasOwnProperty(arg)) 
				//*/
				{
					v = args[k]
					/* Starting in Internet Explorer 9 standards mode, Internet Explorer 10 standards mode, 
					* and win8_appname_long apps, you cannot identify the browser as Internet Explorer 
					* by testing for the equivalence of the vertical tab (\v) and the "v". 
					* In earlier versions, the expression "\v" === "v" returns true. 
					* In Internet Explorer 9 standards mode, Internet Explorer 10 standards mode, 
					* and win8_appname_long apps, the expression returns false.
					*/
					if (k == "class" || k == "className") t.addClass(v)
					else if (typeof v == "string") {
						/*
						* IE5-7 doesn't set styles and removes events when you try to set them.
						*/
						t.setAttribute(k, v)

						/*
						* there are bug in ie<9 where changed 'name' param not accepted on form submit
						*/
	/*
	* The JScript engine used in IE doesn't recognize vertical tabulation character
	* http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
	* oldIE = "\v" == "v"
	* oldIE = /msie [\w.]+/i.exec(navigator.userAgent)
	*
	* The documentMode is an IE only property, supported in IE8+.
	* Note: If no !DOCTYPE is specified, IE8 renders the page in IE5 mode!
	*/

						if (k == "name" && "\v" == "v") {
							//IE8 and below also support ('<P>')
							t.mergeAttributes(doc.createElement("<INPUT name='" + k + "'/>"), false)
						}

						// http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
						// http://msdn.microsoft.com/en-us/library/ms536614(VS.85).aspx
					}
					else if (!v) t.removeAttribute(k)
					else t[k] = v
				}
			}
			return t
		},

		find: doc.querySelector ?
			function(sel) {
				// IE8 don't support :disabled
				return this.querySelector(sel)
			} :
			function(sel) {
				var el
				, i = 0
				, rules = ["_"]
				, tag = sel.replace(el_re, function(_, o, s) {
						rules.push( o == "." ? "(' '+_.className+' ').indexOf(' "+s+" ')>-1" : o == "#" ? "_.id=='"+s+"'" : "_."+s )
						return ""
					}) || "*"
				, els = this.getElementsByTagName(tag)
				, fn = rules.join("&&").fn()

				while (el = els[i++]) if (fn(el)) return el.to ? el : extend(el)
			}
	}

	function El(n/*ame */, a/*rgs */) {
		var el, pre = {}
		n = n.replace(el_re, function(_, o, s) {
			pre[ o == "." ? (o = "class", (pre[o] && (s = pre[o]+" "+s)), o) : o == "#" ? "id" : s ] = s
			return ""
		}) || "div"

		el = (elCache[n] || (elCache[n] = doc.createElement(n))).cloneNode(true).set(pre)

		return fnCache[n] && fnCache[n](el, a) || el.set(a)
	}


	function extend(e, p, k) {
		if (e) {
			if (!p) p = El[P]
			for (k in p) e[k] = p[k]
		}
		return e
	}

	doc.head = doc.head || doc.getElementsByTagName("head")[0]

	/**
	 * For IE 6-7
	 * IE8 exposes Element
	 */
	if (!(El[P] = extend( (win.HTMLElement || win.Element || {})[P] , a))) {
		var c = doc.createElement
		
		El[P] = a

		extend(doc.head)
		extend(doc.body)
	
		doc.createElement = function(n) {return extend(c(n))}

		// remove background image flickers on hover in IE6
		/*@cc_on try{document.execCommand('BackgroundImageCache',false,true)}catch(e){} @*/
		// You could also use CSS
		// html { filter: expression(document.execCommand("BackgroundImageCache", false, true)); }
	}

	El.get = function(el) {
		if (typeof el == "string") el = doc.getElementById(el)
		return el && el.to ? el : extend(el)
	}

	El.cache = function(n, el, custom) {
		elCache[n] = typeof el == "string" ? El(el) : el
		if (custom) {
			fnCache[n] = custom
		}
	}
	El.cache.el = elCache
	El.cache.fn = fnCache
	El.text = function(str) {
		return doc.createTextNode(str)
	}
	win.El = El
	//*/



}(this, document, "prototype")





/** Tests for El
!function(){
	var test_el = new TestCase("El");

	var el = El("div")
	  , select = El("select#id2.cl2:disabled")

	var h1 = El("h1");
	var h2 = El("h2");
	var h3 = El("h3");
	var h4 = El("h4");

	el.append(h2);
	test_el.compare(el.innerHTML.toLowerCase(), "<h2></h2>", "El.append");
	h2.append(select)
	test_el.compare(
	  el.find("#id2"), select
	, el.find(".cl2"), select
	//, el.find("select:disabled"), select
	, el.find("#id2.cl2"), select
	//, el.find("#id2.cl2:disabled"), select
	//, el.find("select#id2.cl2:disabled"), select
	, el.find("select#id2.cl2"), select
	, el.find("select#id2"), select
	, el.find("select"), select
	, el.find("h2"), h2
	//, !!el.find("select:enabled"), false
	, !!el.find("select.cl3"), false
	, "El.find()");
	select.kill();

	el.append(h4, true);
	test_el.compare(el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,""), "<h4></h4><h2></h2>", "El.append");
	h4.kill();
	test_el.compare(el.innerHTML.toLowerCase(), "<h2></h2>", "El.kill");
	h1.after(h2, true);
	test_el.compare(el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,""), "<h1></h1><h2></h2>", "El.after");
	h3.after(h2);
	test_el.compare(el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,""), "<h1></h1><h2></h2><h3></h3>", "El.after");
	el.empty();
	test_el.compare(el.innerHTML.toLowerCase(), "", "El.empty");
	el.append([h3,h4])
	var str = el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,"");
	test_el.compare(
		str == "<h3></h3><h4></h4>" || str == "<div><h3></h3><h4></h4></div>", true, "El.append array");

	el.addClass("test1");
	test_el.compare(el.className, "test1", "El.addClass");

	el.addClass("test2");
	test_el.compare(el.className, "test1 test2");

	el.addClass("test3");
	test_el.compare(el.className, "test1 test2 test3");

	el.addClass("test4");
	test_el.compare(el.className, "test1 test2 test3 test4");

	el.rmClass("test2");
	test_el.compare(el.className, "test1 test3 test4", "El.rmClass");

	el.rmClass("test1");
	test_el.compare(el.className, "test3 test4");

	el.rmClass("test4");
	test_el.compare(el.className, "test3");

	el.rmClass("c4");
	test_el.compare(el.className, "test3");

	var s;

	s = el.toggleClass("test4");
	test_el.compare(el.className, "test3 test4", s, true, "El.toggleClass");

	s = el.toggleClass("test4", true);
	test_el.compare(el.className, "test3 test4", s, true);

	s = el.toggleClass("test4");
	test_el.compare(el.className, "test3", s, false);

	s = el.toggleClass("test4", false);
	test_el.compare(el.className, "test3", s, false);
	test_el.compare(el.hasClass("test3"), true, el.hasClass("test4"), false, "El.hasClass");

	el.css("left","1px");
	test_el.compare(el.css("left"), "1px", "El.css");

	el.css({"top":"2px","left":"3px"});
	test_el.compare(el.css("top"), "2px", el.css("left"), "3px", "El.css");


	test_el.done();
}()
//*/


