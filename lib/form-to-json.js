

JSON.serializeForm = function(form, options) {
	var el, step, key, value
	, res = {}
	, i = 0

	for (; el = form.elements[i++]; step = false) if ((key = el.name || el.id) && !el.disabled) {
		key.replace(/\[([^\]]*)\]/g, nameStep)

		value = el.type === "checkbox" ?
			(el.checked ? el.valueObject || el.value || "on" : "off") :
			el.type === "radio" ?
			(el.checked ? el.valueObject || el.value : res[el.name] || "") :
			el.type === "select-multiple" ?
			readOption(el, []) :
			el.valueObject || el.value

		;(step || res)[ Array.isArray(step) ? step.length : key ] = typeof value === "string" ?
			value.trim() : value
	}

	return res

	function nameStep(_, $1, $2) {
		if (!step) {
			step = res
			key = key.slice(0, $2)
		}
		step = step[key] || (step[key] = $1 ? {} : [])
		key = $1
	}

	function readOption(el, arr) {
		for (var node, i = 0; node = el.childNodes[i++]; ) {
			if (node.tagName === "OPTGROUP") readOption(node, arr)
			else if (node.tagName === "OPTION" && node.selected) arr.push(node.valueObject || node.value)
		}
		return arr
	}

	// Disabled controls do not receive focus, are skipped in tabbing navigation, cannot be successfully posted.
	// Read-only elements receive focus but cannot be modified by the user, are included in tabbing navigation, are successfully posted.
}


