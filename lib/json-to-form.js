
!function(){
	function This() { return this }

	Number.prototype.safe = This

	function fix_type(obj, key, attr) {
		var val = obj[key]

		if (attr && typeof val !== attr.type) {
			if (attr.type == "number") obj[key] = parseFloat( (obj[key]+"").replace(",", ".") )
			if (attr.type == "integer") obj[key] |= 0

			if (attr.type == "array" ) {
				if (typeof val == "string") {
					if (val.charAt(0) == "[") {
						try {
							obj[key] = JSON.parse(val)
						}catch(e){}
					} else {
						obj[key] = val ? val.split(/[, ]+/).map(function(_n, _i, _arr){ fix_type(_arr, _i, attr.items); return _arr[_i] }) : []
					}
				}
			}

			if (attr.type == "boolean" ) {
				obj[key] = val == "on"
			}

			if (attr.type == 'date-time') {
				obj[key] = val.date()
			}

			if (attr.type == "object" ) {

			}
		}
	}


	El.cache("json-form", El("form.json-form"), function(args) {
		var el = this
		, def = args.def || {}
		, model = args.model || { get: function(){return ""} }

		el.getJSON = function() {
			var data = JSON.serializeForm(el)
			, prop = def.properties

			Object.each(data, function(val, key){
				fix_type(data, key, prop[key])
			})
			return data
		}

		el.action = "javascript:"

		var fieldset = El("fieldset", El("legend", args.title || def.title)).to(el)



		//El(".title", args.title||"" ).to(el)

		Object.each(def.properties, function(prop, key){
			var tag
			var row = El("form-field")

			El("form-field-" + (prop["enum"] ? "enum" : prop.type == "boolean" ? "bool" : "else" ))
			.to(row, row.lastChild)

			row.render( Object.merge({name: key}, prop) )

			row.to(fieldset)

			var field = row.find(".field").set({name: key})

			if (prop.readonly) field.disabled = "disabled"

				if (prop.ypath) {
					Ypath(prop.ypath).each(function(item){
						El("option", {value: item.get("id") } ).to(field).innerHTML = item.get("id") +". "+ item.get("name")
					})

				}

				var val = model.get(key) || prop["default"]


    row.setValue = function(val) {


      if (prop["enum"]) {
        var child
        , sel = row.find("select")
        , childs = sel && sel.children
        , len = childs && childs.length

        while (child = childs[--len]) {
          child.selected = child.value == val
        }

      }
      else if (prop.type == "boolean") {
        row.find("input").checked = !!val
      }
      else {
        row.find("input").value = val
      }
    
    }

		val !== void 0 && row.setValue(val)



		//if (!prop.readonly) El("input").to(el)
	
	})

  var keys = Object.keys(def.properties)

  function update(changed) {
    var key, index, len = changed.length
    while (key = changed[--len]) {
      index = keys.indexOf(key)
      if (index > -1) {
        fieldset.children[index+1].setValue( model.get(key) )
      
      }
    }
  
  }

	El("input", {"type":"submit","value":"Ok"}).to(el)


	el.bindTo = function(model) {
		function update() {
		
		}
	
	}
	
	return el
})

}()
