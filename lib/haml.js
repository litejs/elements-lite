


/*
* @version  0.2.3
* @date     2014-06-03
* @author   Lauri Rooden <lauri@rooden.ee>
* @license  MIT License
*/



!function(root) {
	var hamlRe = /^([ \t]*)(\:?)((?:(["'\/])(?:\\.|.)*?\4|[-\w\:.#\[\]=])+)[ \t]*(.*)$/gm

	function haml(str) {
		var root = document.createDocumentFragment()
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
					parent.append(El.text( name == "text" ? text : all ))
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

		El.cache(t.name, t.el.removeChild(t.el.firstChild), El.prototype.render)

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


}(window.El || this)


