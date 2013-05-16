


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice you 
 * can do whatever you want with this stuff at your own risk. If we meet some 
 * day, and you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden -- https://github.com/lauriro/boot.js
 */


!function(exports, Fn) {

	Array.from = function(a) {
		for (var b=[], c=a.length; c--;) b[c] = a[c]
		return b
	}
	Array.indexFor = function(arr, el, fn) {
		var o
		, i = 0
		, l = arr.length

		if (fn && l > 0 && fn(el, arr[l-1]) < 1) {
			while (i<l) fn(el, arr[o=(i+l)>>1]) < 0 ? l=o : i=o+1
		}

		return l
	}
	var Model = Init.extend(Fn.Events, {
		init: function(data) {
			var t = this
			t.data = data
			t.previous = {}
			t.lists = []
		},
		set: function(args, silent) {
			var t = this, d = t.data, changed = []
			for (var arg in args) if ( args.hasOwnProperty(arg) && d[arg] !== args[arg] ) {
				t.previous[arg] = d[arg]
				d[arg] = args[arg]
				changed.push(arg)
			}
			if (!silent && changed.length) {
				t.emit("change", changed)
			}
			return changed
		},
		get: function(name) {
			return this.data[name]
		}
	}).cache(true, function(a){return a[0]["id"]})

	Model.merge = function(cur, next, path, changed) {
		path = path || ""
		changed = changed || []

		var key, val
		for (key in next) if (next.hasOwnProperty(key) && cur[key] !== next[key]) {
			val = next[key]
			changed.push(path+key)
			if (val === null) delete cur[key]
			else if (typeof val == "object" && Object.keys(val).length && typeof cur[key] == "object") Model.merge(cur[key], val, path+key+".", changed)
			else cur[key] = val
		}
		return changed
	}

	var List = Init.extend(Fn.Items, Fn.Events, {
		init: function(name) {
			var t = this
			t.name = name
			t.items = []
		},
		model: Model,
		add: function(data, pos) {
			var t = this, item = data
			item instanceof t.model || (item = t.model(data), item.set(data, true))
			if (item.lists.indexOf(t) == -1) {
				item.lists.push(t)
				pos = pos !== void 0 ? pos : Array.indexFor(t.items, item, t.sortFn)
				t.items.splice(pos , 0, item)
				t.emit("add", item, pos)
			}
			return t
		},
		remove: function(item) {
			var self = this
			if (item.lists.remove(self) > -1) {
				self.emit("remove", item, self.items.remove(item))
			}
		},
		removeAll: function(){
			var self = this, len = self.items.length
			while (len--) self.remove( self.items[len] )
		},
		toString: function() {
			return "[List: " + this.name +"]"
		}
	}).cache(true)


	function add_quotes(input) {
		if ( /[^0-9]/.test(input) ) input = '"' + input + '"'
		return input
	}

	function Filter(str) {
		var t = this

		var rules = str.replace(/([^&\|\(\)]+)(\)?)(&|\||$)/g,
			function(_, junk, bracket, sep) {
				var sep = bracket + sep + sep

				// Extract id=1*

				if (~junk.indexOf("*")) {
					return '(""+i.' + junk.split(".").join("\\.").split("*").join(".*").replace("=",").search(/") + "/i)>-1" + sep
				}

				// Extract id={1,3-6,9-,one,two}

				var list = junk.match(/^([^\[\{=]+)=?(\[|\{)([^\]\}]+)(\]|\})$/)
				if (list) {
					var comp = "i." + list[1], list = list[3].replace(
						/[^,]+/g
					, function(all,from,to) {
							var range = all.split("-")
							if (range.length == 1) {
								return comp + "==" + add_quotes(all)
							}
							var a = []
							range[0].length && a.push( comp + ">=" + add_quotes(range[0]) )
							range[1].length && a.push( comp + "<=" + add_quotes(range[1]) )
							return "(" + a.join("&&") + ")"
						}
					)
					return "(" + list.split(",").join("||") + ")" + sep
				}

				// Extract id=1
				var pos = junk.indexOf("=")
				if (~pos) {
					return "''+i." + junk.substr(0,pos) + "==''+" + add_quotes( junk.substr(pos+1) ) + sep
				}

				// Extract required fields /collection[id&name]
				if (~junk.indexOf("."))
					return add_quotes(junk)+'.split(".").fold(function(a,b){return a && b in a && a[b]}, i)'
				return add_quotes(junk) + " in i" + sep
			}
		)

		if (rules.length > 0) {
			t.str = rules
			t.test = new Function("i", "return i&&" + rules)
		}
	}
	
	Filter.prototype = {
		test: Fn.True,
		str: "all",
		subset: function(target) {
			// TODO:2011-11-07:lauriro:Find better way to compare filters.
			return target.str == "all" || ~this.str.indexOf(target.str)
		},
		toString: function() {
			return "[Filter: " + this.str +"]"
		}
	}

	List.Filter = Filter.cache(true)

	exports.Model = Model
	exports.List = List

}(this, Fn)


/** Tests
!function(){
	var test = new TestCase("Model");

	var sortedList = List.extend({sortFn: function(a, b){return a.get("id") - b.get("id")}});
	var list = sortedList("test");

	list.add({id:1})
	list.add({id:3})
	list.add({id:2})
	list.add({id:3})

	test.compare(
	  list.pluck("id").join(",")
	, "1,2,3"
	, "List.add");

	test.done();
}()
//*/

