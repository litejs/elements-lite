!function(m,f,n){function e(a,b){var d,g={};a=a.replace(u,function(a,b,d,c,e){g["."==b?(b="className",g[b]&&(d=g[b]+" "+d),b):"#"==b?"id":d]=(e?c.slice(1,-1):c)||d;return""})||"div";d=(k[a]||(k[a]=f.createElement(a))).cloneNode(!0).set(g);return l[a]&&l[a].call(d,b)||d.set(b)}function h(a,b){if(a){if("string"==typeof a||"number"==typeof a)a=e.text(a);else if(!("nodeType"in a)&&"length"in a){for(var d=a.length,g=0,c=f.createDocumentFragment();g<d;)h.call(c,a[g++]);a=c}a.nodeType&&this.insertBefore(a,
(!0===b?this.firstChild:"number"==typeof b?this.childNodes[0>b?this.childNodes.length-b-2:b]:b)||null);a.appendHook&&a.appendHook()}return this}function p(a){return RegExp("\\b"+a+"\\b").test(this.className)}function v(a){this.className+=this.className?p.call(this,a)?"":" "+a:a;return this}function w(a){this.className=(" "+this.className+" ").replace(" "+a+" "," ").trim();return this}function x(){this.parentNode&&this.parentNode.removeChild(this);Event.removeAll&&Event.removeAll(this);this.killHook&&
this.killHook();this.empty&&this.empty();return this}function z(a){var b,d=a._childs;if(!d)for(a._childs=d=[];b=a.firstChild;)d.push(b),a.removeChild(b);return d}function q(a,b){var d,c=this;if(d=!b&&c.getAttribute("data-bind"))if(c.getAttribute("lang"),d="n d p r->d&&("+d.replace(A,"(p['$1']?(r=p['$1'](n,d,$2)||r):(n['$1']=$2.format(d))),")+"r)",d.fn("d")(c,a,B))return c;for(c=c.firstChild;c;c=c.nextSibling)1==c.nodeType&&q.call(c,a);return this}function y(a,b,d){var c=0,e=[],f=["_"];b=b.replace(u,
function(a,b,d,c){f.push("."==b?"(' '+_.className+' ').indexOf(' "+d+" ')>-1":"#"==b?"_.id=='"+d+"'":"_.getAttribute('"+d+"')"+(c?"=='"+c+"'":""));return""})||"*";b=a.getElementsByTagName(b);for(var h=Fn(f.join("&&"));a=b[c++];)if(h(a)){if(d)return a;e.push(a)}return d?null:e}function r(a){this._nodes=a}function s(a,b){if(a)for(b in c)a[b]=c[b];return a}function t(a,b,d){k[a]="string"==typeof b?e(b):b;d&&(l[a]=d)}var k={},l={},c=(m.HTMLElement||m.Element||e)[n],u=/([.#:[])([-\w]+)(?:=((["'\/])(?:\\.|.)*?\4|[-\w]+)])?]?/g,
A=/[;\s]*(\w+)(?:\s*\:((?:(["'\/])(?:\\.|.)*?\3|[-,\s\w])*))?/g,B=e.bindings={txt:function(a,b,d){a.txt(d.format(b))},"class":function(a,b,d,c){a.toggleClass(d,c.fn("_")(b))},html:function(a,b,d){a.innerHTML=d.format(b)},each:function(a,b,d){var c=z(a);d&&a.empty().append(d.map(function(a){return c.map(function(b){return q.call(b.cloneNode(!0),a)})}));return a}};c.append=h;c.after=function(a,b){h.call(a.parentNode,this,b?a:a.nextSibling);return this};c.to=function(a,b){h.call(a,this,b);return this};
c.hasClass=p;c.addClass=v;c.rmClass=w;c.toggleClass=function(a,b){1==arguments.length&&(b=!p.call(this,a));return(b?v:w).call(this,a),b};c.empty=function(){for(var a;a=this.firstChild;)x.call(a);return this};c.kill=x;c.on=function(a,b){Event.add(this,a,b);return this};c.non=function(a,b){Event.remove(this,a,b);return this};c.set=function(a){var b,d=typeof a;if(!a)return this;if("string"==d||"number"==d||a.nodeType||"length"in a)h.call(this,a);else for(d in a)(b=a[d])?"string"==typeof b?(this.setAttribute(d,
b),"id"!=d&&"name"!=d||"\v"!="v"||this.mergeAttributes(f.createElement("<INPUT "+d+'="'+b+'"/>'),!1)):this[d]=b:this.removeAttribute(d);return this};c.render=q;c.txt=function(a){var b="textContent"in this?"textContent":"innerText";return arguments.length?this[b]=a:this[b]};c.find=c.querySelector||function(a){return y(this,a,!0)};c.findAll=c.querySelectorAll?function(a){return new r(this.querySelectorAll(a))}:function(a){return new r(y(this,a))};r.prototype=Object.keys(c).reduce(function(a,b){a[b]=
function(){for(var a=this._nodes,e=0,f=a.length;e<f;)c[b].apply(a[e++],arguments);return this};return a},{});if(c===e[n]){var C=f.createElement;f.createElement=function(a){return s(C(a))};s(f.body)}m.El=e;e[n]=c;e.get=function(a){"string"==typeof a&&(a=f.getElementById(a));return a&&a.to?a:s(a)};t._el=k;t._fn=l;e.cache=t;e.text=function(a){return f.createTextNode(a)}}(window,document,"prototype");