


/*
* @version  0.2.3
* @date     2014-06-03
* @author   Lauri Rooden <lauri@rooden.ee>
* @license  MIT License
*/



!function(root, doc) {
	var hamlRe = /^([ \t]*)(\:?)((?:(["'\/])(?:\\.|.)*?\4|[-\w\:.#\[\]=])+)[ \t]*(.*)$/gm
	, renderRe = /[;\s]*(\w+)(?:\s*\:((?:(["'\/])(?:\\.|.)*?\3|[-,\s\w])*))?/g

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
				} else {
					parent.append(El.text( all ))
				}
			} else {
				if (name) {
					parent = El(name).to(parent)
					stack.unshift(i)
				}
				if (text) {
					if (text.charAt(0) == ">") {
						(indent +" "+ text.slice(1)).replace(hamlRe, work)
					} else if (text.charAt(0) == "=") {
						parent.set({"data-bind": text.slice(1)})
					} else {
						parent.append(text.replace(/\\([=>:])/g, "$1"))
					}
				}
			}
		}
		str.replace(hamlRe, work)
		stack = root.childNodes
		if (stack.length == 1) return stack[0]

		for (var arr = [], i = stack.length; i--;) arr[i] = stack[i]
		return arr
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
		"template": template
	}

	root.haml = haml
	root.include = function(id, data, parent) {
		var src = El.get(id)
		new template(null, id).el.append( El.haml(src.innerHTML) ).plugin.done()
		src.kill()
	}

	// Use node initial content as template
	function getTemplate(node) {
		var child, template = node._template
		if (!template) {
			node._template = template = []
			for (; child = node.firstChild;) {
				template.push(child);
				node.removeChild(child)
			}
		}
		return template
	}

	haml.bindings = {
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

	function render(data, skipSelf) {
		var bind, fn, lang
		, node = this

		if (bind = !skipSelf && node.getAttribute("data-bind")) {
			lang = node.getAttribute("lang") || lang
			// i18n(bind, lang).format(data)

			fn = "node data plugins->data&&(" + bind.replace(renderRe, "(plugins['$1']?plugins['$1'](node,data,$2):(node['$1']=$2.format(data))),") + "true)"

			fn.fn("data")(node, data, haml.bindings)
			return node
		}

		for (node = node.firstChild; node; node = node.nextSibling) {
			if (node.nodeType == 1) render.call(node, data)
		}
		return this
	}
	root.prototype.render = render

}(window.El || this, window.document)


