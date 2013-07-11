
function Nop(){}

function lazy(obj, name, str) {
  obj[name] || (obj[name] = function() {
    return (obj[name] = new Function("a,b,c,d", str)).apply(this, arguments)
  })
}

// XMLHttpRequest was unsupported in IE 5-6
// MSXML version 3.0 was the last version of MSXML to support version-independent ProgIDs.
lazy(this, "XMLHttpRequest", "return new ActiveXObject('MSXML2.XMLHTTP')");


// eval in a global context for non-IE & non-Chrome (removed form v8 on 2011-05-23: Version 3.3.9)
// THANKS: Juriy Zaytsev - Global eval [http://perfectionkills.com/global-eval-what-are-the-options/]
if (!this.execScript && Function("d,Date","return(1,eval)('(Date)')===d")(Date,1)) this.execScript = eval

lazy(this, "execScript", "d=document;b=d.body;c=d.createElement('script');c.text=a;b.insertBefore(c,b.firstChild)");


function xhr(method, url, cb, sync) {
	var r = xhr.q.shift() || new XMLHttpRequest()
	r.open(method, url, !sync)
	if (!sync) r.onreadystatechange = function() {
		if (r.readyState == 4) {
			cb && cb( r.responseText, r)
			r.onreadystatechange = cb = Nop
			xhr.q.push(r)
		}
	}
	return r
};
xhr.q = []

function load(files, cb) {
	if (typeof files == "string") files = [files];
	for (var len = files.length, res = [];len--;) !function(i) {
		xhr("GET", files[i], function(str) {
			res[i] = str;
			if (!--len) {
				execScript( res.join("/**/;") );
				cb && cb();
				res = null;
			}
		}).send();
	}(len);
}

/*
* Function.prototype.bind is most missing fn
* http://kangax.github.io/es5-compat-table/
*/
Function.prototype.bind || _load.unshift("up.js")
load(_load)

