


/*
* @version  0.2.3
* @date     2014-06-03
* @author   Lauri Rooden <lauri@rooden.ee>
* @license  MIT License
*/



!function(root, doc) {
	var hamlRe = /^([ \t]*)(\:?)((?:(["'\/])(?:\\.|.)*?\4|[-\w\:.#\[\]=])+)[ \t]*(.*)$/gm

	function to_array(a) {
		for (var b=[], c=a.length; c--;) b[c] = a[c]
		return b
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
				} else {
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

	template.prototype.done = function() {
		var t = this

		El.cache(t.name, t.el.removeChild(t.el.firstChild), render)

		t.el.plugin = null

		return t.parent
	}

	var ifFn = template.extend({
		done: function(){
			var t = this

			El.cache(t.name, t.el.firstChild, render)

			t.el.plugin = null


			return t.parent
		}
	})

	function toggleClass(node, data, bind) {
		var index = bind.indexOf(":")
		, name = bind.slice(0, index)
		, fn = bind.slice(index + 1)
		node.toggleClass(name, new Function("_", "with(_||{}){return ("+fn+")}")(data))
		console.log("toggleClass", name, fn, arguments)

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
		var template = node._template
		if (!template) {
			node._template = template = []
			for (var child; child = node.firstChild;) {
				template.push(child);
				node.removeChild(child)
			}
			console.log(node, "TEMP", template)
		}
		return template
	}

	var attrMap = {
		"txt": function(node, data, text) {
			node.txt(text.format(data))
		},
		"class": function(node, data, name, fn) {
			node.toggleClass(name, fn.fn("_")(data))
		},
		"html": function(node, data, html) {
			node.innerHTML = html.format(data)
		},
		"if": function(node, data, arr) {
			var template = getTemplate(node)
			if (arr) node.empty().append( Fn(bind)(data) && arr )
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

	function render(data) {
		var attr, bind, lang
		, node = this

		//console.log("render", data, node)

		if (bind = node.getAttribute("data-bind")) {
			lang = node.getAttribute("lang") || lang

			var re = /[;\s]*(\w+)(?:\s*\:((?:(["'\/])(?:\\.|.)*?\3|[-,\s\w])*))?/g
			, fn = "node data plugins->data&&(" + bind.replace(re, "(plugins['$1']?plugins['$1'](node,data,$2):(node['$1']=$2)),") + "true)"

			fn.fn("data")(node, data, attrMap)
			return node
		}

		for (node = node.firstChild; node; node = node.nextSibling) {
			if (node.nodeType == 1) render.call(node, data)
		}
		return this
	}
	root.prototype.render = render

}(window.El || this, window.document)


