!function(k,f,l){function e(a,b){var d,c={};a=a.replace(p,function(a,b,d,e,f){c["."==b?(b="class",c[b]&&(d=c[b]+" "+d),b):"#"==b?"id":d]=(f?e.slice(1,-1):e)||d;return""})||"div";d=(g[a]||(g[a]=f.createElement(a))).cloneNode(!0).set(c);return h[a]&&h[a].call(d,b)||d.set(b)}function q(a,b,d){var c=0,e=[],f=["_"];b=b.replace(p,function(a,b,d,c){f.push("."==b?"(' '+_.className+' ').indexOf(' "+d+" ')>-1":"#"==b?"_.id=='"+d+"'":"_.getAttribute('"+d+"')"+(c?"=='"+c+"'":""));return""})||"*";b=a.getElementsByTagName(b);
for(var g=Function("_","return "+f.join("&&"));a=b[c++];)if(g(a)){if(d)return a;e.push(a)}return d?null:e}function m(a){this._nodes=a}function n(a,b){if(a)for(b in c)a[b]=c[b];return a}var g={},h={},c=(k.HTMLElement||k.Element||e)[l],p=/([.#:[])([-\w]+)(?:=((["'\/])(?:\\.|.)*?\4|[-\w]+)])?]?/g;c.append=function(a,b){if(a){if("string"==typeof a||"number"==typeof a)a=e.text(a);else if(!("nodeType"in a)&&"length"in a){for(var d=a.length,g=0,h=f.createDocumentFragment();g<d;)c.append.call(h,a[g++]);a=
h}a.nodeType&&this.insertBefore(a,(!0===b?this.firstChild:"number"==typeof b?this.childNodes[0>b?this.childNodes.length-b-2:b]:b)||null);a.append_hook&&a.append_hook()}return this};c.after=function(a,b){c.append.call(a.parentNode,this,b?a:a.nextSibling);return this};c.to=function(a,b){c.append.call(a,this,b);return this};c.hasClass=function(a){return RegExp("\\b"+a+"\\b").test(this.className)};c.addClass=function(a){this.className+=this.className?this.hasClass(a)?"":" "+a:a;return this};c.rmClass=
function(a){this.className=(" "+this.className+" ").replace(" "+a+" "," ").trim();return this};c.toggleClass=function(a,b){1==arguments.length&&(b=!this.hasClass(a));this[b?"addClass":"rmClass"](a);return b};c.empty=function(){for(var a;a=this.firstChild;)this.kill.call(a);return this};c.kill=function(){this.parentNode&&this.parentNode.removeChild(this);Event.removeAll&&Event.removeAll(this);this.kill_hook&&this.kill_hook();this.empty&&this.empty();return this};c.on=function(a,b){Event.add(this,a,
b);return this};c.non=function(a,b){Event.remove(this,a,b);return this};c.set=function(a){var b,d=typeof a;if(!a)return this;if("string"==d||"number"==d||a.nodeType||"length"in a)this.append(a);else for(d in a)b=a[d],"class"==d?this.addClass(b):b?"string"==typeof b?(this.setAttribute(d,b),"id"!=d&&"name"!=d||"\v"!="v"||this.mergeAttributes(f.createElement("<INPUT "+d+'="'+b+'"/>'),!1)):this[d]=b:this.removeAttribute(d);return this};c.txt=function(a){var b="textContent"in this?"textContent":"innerText";
return arguments.length?this[b]=a:this[b]};c.find=f.querySelector?function(a){return this.querySelector(a)}:function(a){return q(this,a,!0)};c.findAll=f.querySelectorAll?function(a){return new m(this.querySelectorAll(a))}:function(a){return new m(q(this,a))};m.prototype=Object.keys(c).reduce(function(a,b){a[b]=function(){for(var a=this._nodes,e=0,f=a.length;e<f;)c[b].apply(a[e++],arguments);return this};return a},{});if(c===e[l]){var r=f.createElement;f.createElement=function(a){return n(r(a))};n(f.body)}e[l]=
c;e.get=function(a){"string"==typeof a&&(a=f.getElementById(a));return a&&a.to?a:n(a)};e.cache=function(a,b,c){g[a]="string"==typeof b?e(b):b;c&&(h[a]=c)};e.cache.el=g;e.cache.fn=h;e.text=function(a){return f.createTextNode(a)};k.El=e}(window,document,"prototype");