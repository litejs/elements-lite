


JSON.serializeForm = function(form, format) {
	var el, undef
	, res = {}
	, id_temp = {}
	, read_value
	, list = form.elements
	, i = 0;

	function read_options(el) {
		for (var i = 0, list = el.childNodes, opt; opt = list[i++]; ) {
			if (opt.tagName === "OPTGROUP") read_options(opt);
			else if (opt.tagName === "OPTION" && opt.selected) read_value.push(opt.valueObject||opt.value);
		}
	}

	while (el = list[i++]) if (el.name) {
		read_value = undef;
		if (el.type === "checkbox") {
			read_value = el.checked ? el.valueObject || el.value || "on" : "off"
		} else if (el.type === "radio") {
			if (el.checked) read_value=el.valueObject||el.value;
			else if (el.name in res === false) read_value="";
		}else if (el.type === "select-multiple") {
			read_value = [];
			read_options(el);
		}else{
			read_value = el.valueObject||el.value;
		}
		if (read_value !== undef) {

			var step = false, key;
			var x = el.name.replace(/\[([^\]]*)\]/g, function($0,$1,$2) {
				if (step) {
					//if(!step[key])step[key]=($1)?{}:[];
					if(!step[key])step[key]=($1&&$1!="0")? {} : [] ;
					step = step[key];
				}else{
					var n = el.name.substr(0,$2);
					//if(!res[n])res[n]=($1)?{}:[];
					if (!res[n]) res[n]=($1&&$1!='0')?{}:[];
					step = res[n];
				}
				key=$1;
				return "";
			});
			if (typeof(read_value)==='string') {
				read_value = read_value.trim();
				//read_value = read_value.convert('commaToDot');
				//if (el.value_converter) {
				//	read_value = read_value.convert(el.value_converter);
				//}
				read_value = read_value.toString();
			}

			if (step) {
				"push" in step && step.push(read_value) || (step[key] = read_value);
			} else {
				res[el.name]=read_value;
			}
		}
	}

	switch (format) {
		case "key_value_pairs":
			var out=[];
			foreach(res,function(v,n){
				var item={name:n,value:v};
				if(id_temp[n]&&id_temp[n].substr(0,3)!='__u')item.id=id_temp[n];
				out.push(item);
			});
			return out;
		default:
			return res;
	}
}


