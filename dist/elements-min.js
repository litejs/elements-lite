!function(m,f,n){function e(a,b){var c,g={};a=a.replace(v,function(a,b,c,d,e){g["."==b?(b="class",g[b]&&(c=g[b]+" "+c),b):"#"==b?"id":c]=(e?d.slice(1,-1):d)||c;return""})||"div";c=(k[a]||(k[a]=f.createElement(a))).cloneNode(!0).set(g);return l[a]&&l[a].call(c,b)||c.set(b)}function h(a,b){if(a){if("string"==typeof a||"number"==typeof a)a=e.text(a);else if(!("nodeType"in a)&&"length"in a){for(var c=a.length,g=0,d=f.createDocumentFragment();g<c;)h.call(d,a[g++]);a=d}a.nodeType&&this.insertBefore(a,(!0===
b?this.firstChild:"number"==typeof b?this.childNodes[0>b?this.childNodes.length-b-2:b]:b)||null);a.appendHook&&a.appendHook()}return this}function p(a){return RegExp("\\b"+a+"\\b").test(this.className)}function q(a){this.className+=this.className?p.call(this,a)?"":" "+a:a;return this}function w(a){this.className=(" "+this.className+" ").replace(" "+a+" "," ").trim();return this}function x(){this.parentNode&&this.parentNode.removeChild(this);Event.removeAll&&Event.removeAll(this);this.killHook&&this.killHook();
this.empty&&this.empty();return this}function z(a){var b,c=a._childs;if(!c)for(a._childs=c=[];b=a.firstChild;)c.push(b),a.removeChild(b);return c}function r(a,b){var c,d=this;if(c=!b&&d.getAttribute("data-bind"))if(d.getAttribute("lang"),c="n d p r->d&&("+c.replace(A,"(p['$1']?(r=p['$1'](n,d,$2)||r):(n['$1']=$2.format(d))),")+"r)",c.fn()(d,a,B))return d;for(d=d.firstChild;d;d=d.nextSibling)1==d.nodeType&&r.call(d,a);return this}function y(a,b,c){var d=0,e=[],f=["_"];b=b.replace(v,function(a,b,c,d){f.push("."==
b?"(' '+_.className+' ').indexOf(' "+c+" ')>-1":"#"==b?"_.id=='"+c+"'":"_.getAttribute('"+c+"')"+(d?"=='"+d+"'":""));return""})||"*";b=a.getElementsByTagName(b);for(var h=Fn(f.join("&&"));a=b[d++];)if(h(a)){if(c)return a;e.push(a)}return c?null:e}function s(a){this._nodes=a}function t(a,b){if(a)for(b in d)a[b]=d[b];return a}function u(a,b,c){k[a]="string"==typeof b?e(b):b;c&&(l[a]=c)}var k={},l={},d=(m.HTMLElement||m.Element||e)[n],v=/([.#:[])([-\w]+)(?:=((["'\/])(?:\\.|.)*?\4|[-\w]+)])?]?/g,A=/[;\s]*(\w+)(?:\s*\:((?:(["'\/])(?:\\.|.)*?\3|[-,\s\w])*))?/g,
B=e.bindings={txt:function(a,b,c){a.txt(c.format(b))},"class":function(a,b,c,d){a.toggleClass(c,d.fn("_")(b))},html:function(a,b,c){a.innerHTML=c.format(b)},each:function(a,b,c){var d=z(a);c&&a.empty().append(c.map(function(a){return d.map(function(b){return r.call(b.cloneNode(!0),a)})}));return a}};d.append=h;d.after=function(a,b){h.call(a.parentNode,this,b?a:a.nextSibling);return this};d.to=function(a,b){h.call(a,this,b);return this};d.hasClass=p;d.addClass=q;d.rmClass=w;d.toggleClass=function(a,
b){1==arguments.length&&(b=!p.call(this,a));return(b?q:w).call(this,a),b};d.empty=function(){for(var a;a=this.firstChild;)x.call(a);return this};d.kill=x;d.on=function(a,b){Event.add(this,a,b);return this};d.non=function(a,b){Event.remove(this,a,b);return this};d.set=function(a){var b,c=typeof a;if(!a)return this;if("string"==c||"number"==c||a.nodeType||"length"in a)h.call(this,a);else for(c in a)b=a[c],"class"==c?q.call(this,b):b?"string"==typeof b?(this.setAttribute(c,b),"id"!=c&&"name"!=c||"\v"!=
"v"||this.mergeAttributes(f.createElement("<INPUT "+c+'="'+b+'"/>'),!1)):this[c]=b:this.removeAttribute(c);return this};d.render=r;d.txt=function(a){var b="textContent"in this?"textContent":"innerText";return arguments.length?this[b]=a:this[b]};d.find="\v"!=="v"&&d.querySelector||function(a){return y(this,a,!0)};d.findAll=d.querySelectorAll?function(a){return new s(this.querySelectorAll(a))}:function(a){return new s(y(this,a))};s.prototype=Object.keys(d).reduce(function(a,b){a[b]=function(){for(var a=
this._nodes,e=0,f=a.length;e<f;)d[b].apply(a[e++],arguments);return this};return a},{});if(d===e[n]){var C=f.createElement;f.createElement=function(a){return t(C(a))};t(f.body)}m.El=e;e[n]=d;e.get=function(a){"string"==typeof a&&(a=f.getElementById(a));return a&&a.to?a:t(a)};u._el=k;u._fn=l;e.cache=u;e.text=function(a){return f.createTextNode(a)}}(window,document,"prototype");
