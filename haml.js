


/*
* @version  0.2.0
* @date     2014-05-15
* @author   Lauri Rooden <lauri@rooden.ee>
* @license  MIT License
*/



!function(root, doc) {
	var hamlRe = /^([ \t]*)(\:?)((?:(["'\/])(?:\\.|.)*?\4|[-\w\:.#\[\]=])+)[ \t]*(.*)$/gm

	function to_array(a) {
		for (var b=[], c=a.length; c--;) b[c] = a[c]
		return b
	}
	function This() {
		return this
	}


	function haml(str) {
		var root = doc.createDocumentFragment()
		, parent = root
		, stack = [-1]

		function work(all, indent, plugin, name, q, text) {
			for (var i = indent.length; i <= stack[0]; ) {
				stack.shift()
				parent = (parent.plugin) ? parent.plugin.done() : parent.parentNode
			}

			if (plugin) {
				if (haml.plugins[name]) {
					parent = (new haml.plugins[name](parent, text)).el
					stack.unshift(i)
				}
				else {
					parent.append(El.text( all ))
				}
			} else {
				if (name) {
					parent = El(name).to(parent)
					stack.unshift(i)
				}
				if (text) {
					if (text.charAt(0)==">") (indent +" "+ text.slice(1)).replace(hamlRe, work)
					else if (text.charAt(0)=="=") parent.set({"data-bind": text.slice(1)})
					else parent.append(text.replace(/\\([=>:])/g, "$1"))
				}
			}
		}
		str.replace(hamlRe, work)
		stack = root.childNodes
		return stack.length == 1 ? stack[0] :  to_array(stack)
	}

	function template(parent, name) {
		var t = this
		t.name = name
		t.parent = parent
		t.el = El("div")
		t.el.plugin = t
		return t
	}

	template.prototype = {
		cloneNode: This,
		set: This,
		done: function() {
			var t = this

			El.cache(t.name, t.el.removeChild(t.el.firstChild), render)

			t.el.plugin = null

			return t.parent
		}
	}

	var ifFn = template.extend({
		done: function(){
			var t = this

			El.cache(t.name, t.el.firstChild, render)

			t.el.plugin = null


			return t.parent
		}
	})

	haml.plugins = {
		/*
		* - Declaration
		* mixin list
		*
		* mixin link(href, name)
		*   a(class!=attributes.class, href=href)= name
		*
		* +link('/foo', 'foo')(class="btn")
		*
		* :include
		* :doctype
		* - http://stackoverflow.com/questions/8227612/how-to-create-document-objects-with-javascript
		*/
		"template": template,
		"if": ifFn,
		"for": function(parent, name, text) {
		}
	}

	root.haml = haml
	root.include = function(id, data, parent) {
		var src = El.get(id)
		new template(null, id).el.append( El.haml(src.innerHTML) ).plugin.done()
		src.kill()

	}

	function getLa(node) {
		var la = node.la
		if (!la) {
			node.la = la = []
			for (var child; child = node.firstChild;) {
				la.push(child);
				node.removeChild(child)
			}
		}
		return la
	}

	var attrMap = {
		text: "textContent" in doc ? "textContent" : "innerText",
		html: "innerHTML",
		if: function(node, data, bind) {
			console.log("if", arguments)
			var la = getLa(node)
			var arr = data && data[bind]
			if (arr) node.empty().append( Fn(bind)(data) && arr )
		},
		each: function(node, data, bind) {
			var la = getLa(node)
			var arr = data && data[bind]
			if (arr) node.empty().append(arr.map(function(obj){
				return la.map(function(el){
					return render.call(el.cloneNode(true), obj)
				})
			}))
		}
	}

	function render(data) {
		var attr, bind, lang
		, node = this

		//console.log("render", data, node)

		if (bind = node.getAttribute("data-bind")) {
			lang = node.getAttribute("lang") || navigator.language || navigator.userLanguage;

			if (attr = bind.match(/(\w+)\:/)) {
				bind = bind.slice( attr[0].length )
				attr = attrMap[attr[1]] || attr[1]
			}

			if (typeof attr == "function") {
				attr(node, data, bind)
				return node
			}
			else {
				node[ attr || attrMap.text ] = i18n(bind).format(data)
			}
		}

		for (node = node.firstChild; node; node = node.nextSibling) {
			if (node.nodeType == 1) render.call(node, data)
		}
		return this
	}
	root.prototype.render = render

}(window.El || this, window.document)


