!function(l,e,m){function d(a,b){var c,d={};a=a.replace(n,function(a,b,c,h,e){d["."==b?(b="class",d[b]&&(c=d[b]+" "+c),b):"#"==b?"id":c]=(e?h.slice(1,-1):h)||c;return""})||"div";c=(f[a]||(f[a]=e.createElement(a))).cloneNode(!0).set(d);return g[a]&&g[a].call(c,b)||c.set(b)}function k(a,b){if(a)for(b in c)a[b]=c[b];return a}var f={},g={},c=(l.HTMLElement||l.Element||d)[m],n=/([.#:[])([-\w]+)(?:=((["'\/])(?:\\.|.)*?\4|[-\w]+)])?]?/g;c.append=function(a,b){if(a){if("string"==typeof a||"number"==typeof a)a=
d.text(a);else if(!("nodeType"in a)&&"length"in a){for(var h=a.length,f=0,g=e.createDocumentFragment();f<h;)c.append.call(g,a[f++]);a=g}a.nodeType&&this.insertBefore(a,(!0===b?this.firstChild:"number"==typeof b?this.childNodes[0>b?this.childNodes.length-b-2:b]:b)||null);a.append_hook&&a.append_hook()}return this};c.after=function(a,b){c.append.call(a.parentNode,this,b?a:a.nextSibling);return this};c.to=function(a,b){c.append.call(a,this,b);return this};c.hasClass=function(a){return RegExp("\\b"+a+
"\\b").test(this.className)};c.addClass=function(a){this.className+=""==this.className?a:this.hasClass(a)?"":" "+a;return this};c.rmClass=function(a){this.className=(" "+this.className+" ").replace(" "+a+" "," ").trim();return this};c.toggleClass=function(a,b){1==arguments.length&&(b=!this.hasClass(a));this[b?"addClass":"rmClass"](a);return b};c.empty=function(){for(var a;a=this.firstChild;)this.kill.call(a);return this};c.kill=function(){this.parentNode&&this.parentNode.removeChild(this);Event.removeAll&&
Event.removeAll(this);this.kill_hook&&this.kill_hook();this.empty&&this.empty();return this};c.on=function(a,b){Event.add(this,a,b);return this};c.non=function(a,b){Event.remove(this,a,b);return this};c.set=function(a,b){var c=typeof a;if(a)if("string"==c||"number"==c||a.nodeType||"length"in a)this.append(a);else for(c in a)b=a[c],"class"==c?this.addClass(b):"string"==typeof b?(this.setAttribute(c,b),"name"==c&&"\v"=="v"&&this.mergeAttributes(e.createElement("<INPUT name='"+c+"'/>"),!1)):b?this[c]=
b:this.removeAttribute(c);return this};c.txt=function(a){var b="textContent"in this?"textContent":"innerText";return arguments.length?this[b]=a:this[b]};c._find=function(a){var b=0,c=["_"];a=a.replace(n,function(a,b,d,e){c.push("."==b?"(' '+_.className+' ').indexOf(' "+d+" ')>-1":"#"==b?"_.id=='"+d+"'":"_.getAttribute('"+d+"')"+(e?"=='"+e+"'":""));return""})||"*";for(var d=this.getElementsByTagName(a),e=Function("_","return "+c.join("&&"));a=d[b++];)if(e(a))return a.to?a:k(a)};c.find=e.querySelector?
function(a){return this.querySelector(a)}:c._find;if(c===d[m]){var p=e.createElement;e.createElement=function(a){return k(p(a))};k(e.body)}d[m]=c;d.get=function(a){"string"==typeof a&&(a=e.getElementById(a));return a&&a.to?a:k(a)};d.cache=function(a,b,c){f[a]="string"==typeof b?d(b):b;c&&(g[a]=c)};d.cache.el=f;d.cache.fn=g;d.text=function(a){return e.createTextNode(a)};l.El=d}(window,document,"prototype");