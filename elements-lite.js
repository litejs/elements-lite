


/*
* @version  0.1.3
* @author   Lauri Rooden - https://github.com/litejs/elements-lite
* @license  MIT License  - http://lauri.rooden.ee/mit-license.txt
*/



!function(win, doc, P) {
	var elCache = {}
	, fnCache = {}
	, proto = (win.HTMLElement || win.Element || El)[P]
	, el_re = /([.#:[])([-\w]+)(?:=([-\w]+)])?/g



	function El(name, args) {
		var el, pre = {}
		name = name.replace(el_re, function(_, o, s, val) {
			pre[
				o == "." ? (o = "class", (pre[o] && (s = pre[o]+" "+s)), o) :
				o == "#" ? "id" :
				s ] = val || s
			return ""
		}) || "div"

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
				var len = e.length, i = 0, f = doc.createDocumentFragment()
				while (i<len) t.append.call(f, e[i++])
				e = f
			}

			if (e.nodeType) t.insertBefore(e, (before === true ? t.firstChild : typeof before == "number" ? t.childNodes[before] : before) || null)
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
		e.append(this, before)
		return this
	}

	proto.hasClass = function(name) {
		return (" "+this.className+" ").indexOf(" "+name+" ") > -1
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
				if (k == "class" || k == "className") t.addClass(v)
				else if (typeof v == "string") {
					/*
					* Note: IE5-7 doesn't set styles and removes events when you try to set them.
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
	* Expose slow find for testing
	*/

	proto._find = function(sel) {
		var el
		, i = 0
		, rules = ["_"]
		, tag = sel.replace(el_re, function(_, o, s, v) {
				rules.push(
					o == "." ? "(' '+_.className+' ').indexOf(' "+s+" ')>-1" :
					o == "#" ? "_.id=='"+s+"'" :
					"_.getAttribute(['"+s+"'])"+(v?"=='"+v+"'":"")
				)
				return ""
			}) || "*"
		, els = this.getElementsByTagName(tag)
		, fn = rules.join("&&").fn()
		, src = rules.join("&&")

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
			return document.querySelector(sel)
		} : proto._find


	function extend(e, p, k) {
		if (e) {
			p = El[P]
			for (k in p) e[k] = p[k]
		}
		return e
	}



	if (proto === El[P]) {
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

	El[P] = proto


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
	win.El = El

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


