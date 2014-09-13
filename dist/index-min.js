/*
    MIT License
*/
!function(r,g,s){function f(a,b,c){var d,e={};a=a.replace(z,function(a,b,c,d,f){e["."==b?(b="class",e[b]&&(c=e[b]+" "+c),b):"#"==b?"id":c]=(f?d.slice(1,-1):d)||c;return""})||"div";d=(n[a]||(n[a]=g.createElement(a))).cloneNode(!0).set(e);return c?(h[a]&&d.setAttribute("data-call",a),d):h[a]&&h[a].call(d,b)||d.set(b)}function m(a,b){if(a){if("string"==typeof a||"number"==typeof a)a=f.text(a);else if(!("nodeType"in a)&&"length"in a){for(var c=a.length,d=0,e=g.createDocumentFragment();d<c;)m.call(e,a[d++]);
a=e}a.nodeType&&this.insertBefore(a,(!0===b?this.firstChild:"number"==typeof b?this.childNodes[0>b?this.childNodes.length-b-2:b]:b)||null);a.appendHook&&a.appendHook()}return this}function t(a){return RegExp("\\b"+a+"\\b").test(this.className)}function u(a){this.className+=this.className?t.call(this,a)?"":" "+a:a;return this}function A(a){this.className=(" "+this.className+" ").replace(" "+a+" "," ").trim();return this}function B(){this.parentNode&&this.parentNode.removeChild(this);Event.removeAll&&
Event.removeAll(this);this.killHook&&this.killHook();this.empty&&this.empty();return this}function E(a){var b,c=a._childs;if(!c)for(a._childs=c=[];b=a.firstChild;)c.push(b),a.removeChild(b);return c}function p(a,b){var c,d=this;if(c=!b&&d.getAttribute("data-call"))d.removeAttribute("data-call"),h[c].call(d);if(c=!b&&d.getAttribute("data-bind"))if(d.getAttribute("lang"),"{"==c.charAt(0)&&(c='txt:"'+c.replace(/"/g,'\\"')+'"'),c="n d p r->d&&("+c.replace(F,"(p['$1']?(r=p['$1'](n,d,$2)||r):(n['$1']=$2.format(d))),")+
"r)",c.fn()(d,a,G))return d;for(d=d.firstChild;d;d=d.nextSibling)1==d.nodeType&&p.call(d,a);return this}function C(a,b,c){var d=0,e=[],f=["_"];b=b.replace(z,function(a,b,c,d){f.push("."==b?"(' '+_.className+' ').indexOf(' "+c+" ')>-1":"#"==b?"_.id=='"+c+"'":"_.getAttribute('"+c+"')"+(d?"=='"+d+"'":""));return""})||"*";b=a.getElementsByTagName(b);for(var g=Fn(f.join("&&"));a=b[d++];)if(g(a)){if(c)return a;e.push(a)}return c?null:e}function v(a){this._nodes=a}function w(a,b){if(a)for(b in e)a[b]=e[b];
return a}function x(a,b,c){n[a]="string"==typeof b?f(b):b;c&&(h[a]=c)}function q(a){function b(a,c,g,h,k,l){for(k=c.length;k<=e[0];)e.shift(),d=d.plugin?d.plugin.done():d.parentNode;g?q.plugins[h]?(d=(new q.plugins[h](d,l)).el,e.unshift(k)):d.append(f.text("text"==h?l:a)):(h&&(d=f(h,0,1).to(d),e.unshift(k)),l&&(k=l.charAt(0),">"==k?(c+" "+l.slice(1)).replace(D,b):"="==k?d.set({"data-bind":l.slice(1)}):d.append(l.replace(/\\([=>:])/g,"$1"))))}var c=g.createDocumentFragment(),d=c,e=[-1];a.replace(D,
b);e=c.childNodes;if(1==e.length)return e[0];a=[];for(c=e.length;c--;)a[c]=e[c];return a}function y(a,b){this.name=b;this.parent=a;this.el=f("div");this.el.plugin=this;return this}var n={},h={},e=(r.HTMLElement||r.Element||f)[s],z=/([.#:[])([-\w]+)(?:=((["'\/])(?:\\.|.)*?\4|[-\w]+)])?]?/g,D=/^([ \t]*)(\:?)((?:(["'\/])(?:\\.|.)*?\4|[-\w\:.#\[\]=])+)[ \t]*(.*)$/gm,F=/[;\s]*(\w+)(?:\s*\:((?:(["'\/])(?:\\.|.)*?\3|[-,\s\w])*))?/g,G=f.bindings={txt:function(a,b,c){a.txt(c.format(b))},"class":function(a,
b,c,d){a.toggleClass(c,d.fn("_")(b))},html:function(a,b,c){a.innerHTML=c.format(b)},each:function(a,b,c){var d=E(a);c&&a.empty().append(c.map(function(a){return d.map(function(b){return p.call(b.cloneNode(!0),a)})}));return a}};r.El=f;e.append=m;e.after=function(a,b){m.call(a.parentNode,this,b?a:a.nextSibling);return this};e.to=function(a,b){m.call(a,this,b);return this};e.hasClass=t;e.addClass=u;e.rmClass=A;e.toggleClass=function(a,b){1==arguments.length&&(b=!t.call(this,a));return(b?u:A).call(this,
a),b};e.empty=function(){for(var a;a=this.firstChild;)B.call(a);return this};e.kill=B;e.on=function(a,b){Event.add(this,a,b);return this};e.non=function(a,b){Event.remove(this,a,b);return this};e.set=function(a){var b,c=typeof a;if(!a)return this;if("string"==c||"number"==c||a.nodeType||"length"in a)m.call(this,a);else for(c in a)b=a[c],"class"==c?u.call(this,b):b?"string"==typeof b?(this.setAttribute(c,b),"id"!=c&&"name"!=c||"\v"!="v"||this.mergeAttributes(g.createElement("<INPUT "+c+'="'+b+'"/>'),
!1)):this[c]=b:this.removeAttribute(c);return this};e.render=p;e.txt=function(a){var b="textContent"in this?"textContent":"innerText";return arguments.length?this[b]=a:this[b]};e.find="\v"!=="v"&&e.querySelector||function(a){return C(this,a,!0)};e.findAll=e.querySelectorAll?function(a){return new v(this.querySelectorAll(a))}:function(a){return new v(C(this,a))};v.prototype=Object.keys(e).reduce(function(a,b){a[b]=function(){for(var a=this._nodes,d=0,f=a.length;d<f;)e[b].apply(a[d++],arguments);return this};
return a},{});if(e===f[s]){var H=g.createElement;g.createElement=function(a){return w(H(a))};w(g.body)}f[s]=e;f.get=function(a){"string"==typeof a&&(a=g.getElementById(a));return a&&a.to?a:w(a)};x._el=n;x._fn=h;f.cache=x;f.text=function(a){return g.createTextNode(a)};y.prototype.done=function(){f.cache(this.name,this.el.removeChild(this.el.firstChild),p);this.el.plugin=null;return this.parent};q.plugins={template:y};f.tpl=function(a){return q(a).render()};f.include=function(a,b,c){b=f.get(a);(new y(null,
a)).el.append(f.tpl(b.innerHTML)).plugin.done();b.kill()}}(window,document,"prototype");
