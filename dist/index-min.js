!function(q,m,k){function H(a,b,d){for(var g=[],r=a.firstChild,c=I(b);b=r;){if(c(b)){if(d)return b;g.push(b)}for(r=b.firstChild||b.nextSibling;!r&&(b=b.parentNode)!==a;)r=b.nextSibling}return d?null:g}function I(a){return J[a]||(J[a]=Function("_,v,a,b","return "+a.split(Y).map(function(a){var d,g,c=["_&&_.nodeType==1"],w=a.replace(Z,function(a,b,c,r){g=r+b.length;d=b.trim();return""});(a=a.slice(g).replace(K,function(a,b,d,g,w,f,e){c.push("((v='"+(g||(e?f.slice(1,-1):f)||"").replace(/'/g,"\\'")+"'),(a='"+
d+"'),1)",L[":"==b?d:b]||"(a=_.getAttribute(a))"+(w?"&&"+L[w]:f?"==v":""));return""}))&&"*"!=a&&(c[0]+="&&_.nodeName=='"+a.toUpperCase()+"'");w&&c.push("+"==d?"(a=_.previousSibling)":"(a=_.parentNode)",(d?"a.matches&&a.matches('":"a.closest&&a.closest('")+w+"')");return c.join("&&")}).join("||")))}function f(a,b,d){var g={};a=a.replace(K,function(a,b,d,c,f,e,h){e=h?e.slice(1,-1):e||d;g[b="."==b?(f="~","class"):"#"==b?"id":d]=f&&g[b]?"^"==f?e+g[b]:g[b]+("~"==f?" ":"")+e:e;return""})||"div";a=(z[a]||
(z[a]=m.createElement(a))).cloneNode(!0).attr(g);return d||!b?a:("object"==typeof b?h:x).call(a,b)}function x(a,b){var d,g=0,c=typeof a;if(a){if("string"==c||"number"==c)a=m.createTextNode(a);else if(!("nodeType"in a)&&"length"in a){c=a.length;for(d=m.createDocumentFragment();g<c;)x.call(d,a[g++]);a=d}a.nodeType&&(c=this.insertBefore?this:this[this.length-1],c.insertBefore(a,(!0===b?c.firstChild:"number"==typeof b?c.childNodes[0>b?c.childNodes.length-b-2:b]:b)||null))}return this}function y(a){return-1<
this.className.split(/\s+/).indexOf(a)}function A(a){var b=this.className;b&&(a=y.call(this,a)?b:b+" "+a);b!=a&&(this.className=a);return this}function M(a){y.call(this,a)&&(this.className=(" "+this.className+" ").replace(" "+a+" "," ").trim());return this}function N(a,b){1==arguments.length&&(b=!y.call(this,a));return(b?A:M).call(this,a),b}function O(){var a;this.emit&&this.emit("kill");this.parentNode&&this.parentNode.removeChild(this);Event.removeAll&&Event.removeAll(this);this.empty&&this.empty();
(a=this.attr&&this.attr("data-scope"))&&delete p[a];this.valObject&&(this.valObject=null);return this}function h(a,b){var d;if(a&&a.constructor==Object){for(b in a)h.call(this,b,a[b]);return this}d=this.getAttribute(a);if(1==arguments.length)return d;!aa||"id"!=a&&"name"!=a&&"checked"!=a?"class"==a?A.call(this,b):b||0===b?d!=b&&this.setAttribute(a,b):d&&this.removeAttribute(a):this.mergeAttributes(P("<INPUT "+a+'="'+b+'">'),!1)}function p(a,b,d){if(d=p[h.call(a,"data-scope")])return d;b&&!0!==b||
(d=(d=B.call(a,"[data-scope]"))&&p[h.call(d,"data-scope")]||Q);b&&(h.call(a,"data-scope",++R),d=p[R]=Object.create(b=d||b),d._super=b);return d}function S(a,b){var d,c,f;if(1!=this.nodeType)return this;a=p[h.call(this,"data-scope")]||a||(d=B.call(this,"[data-scope]"))&&p[h.call(d,"data-scope")]||Q;if(d=!b&&h.call(this,"data-bind")){c=d;f="data b r->data&&("+d.replace(ba,function(a,b,d){return t[b]?(ca.call(t[b],"once")&&(c=c.replace(a,"")),"(r=b['"+b+"'].call(this,"+(t[b].raw?"data,'"+d+"'":d)+")||r),"):
"this.attr('"+b+"',"+d+"),"})+"r)";d!=c&&h.call(this,"data-bind",c);try{if(Fn(f,this,a)(a,t))return this}catch(e){e.message+=" in binding: "+d;console.error(e);if(q.onerror)q.onerror(e.message,e.fileName,e.lineNumber);return this}}for(d=this.firstChild;d;d=c)c=d.nextSibling,S.call(d,a);C&&"SELECT"==this.nodeName&&this.parentNode.insertBefore(this,this);return this}function B(a){for(var b=this;b;b=b.parentNode)if(b.matches&&b.matches(a))return b;return null}function u(a){for(var b=this.length=a.length;b--;)this[b]=
a[b]}function T(a){function b(a,d,m,n,l,k){for(l=d.length;l<=e[0];)e.shift(),c=c.plugin?c.plugin.done():c.parentNode||c[0].parentNode;m?f.plugins[n]?(c=(new f.plugins[n](c,k)).el,e.unshift(l)):c.append(a):(n&&(c=f(n,0,1).to(c),e.unshift(l)),k&&(l=k.charAt(0),n=k.slice(1),">"==l?(d+" "+n).replace(U,b):"|"==l||"\\"==l?c.append(n):"/"!=l&&("&"!=l&&(n=("INPUT"==c.tagName?"val":"txt")+":_('"+k.replace(/'/g,"\\'")+"').format(data)"),l=h.call(c,"data-bind"),h.call(c,"data-bind",(l?l+";":"")+n))))}var d=
m.createDocumentFragment(),c=d,e=[-1];a.replace(U,b);d=d.childNodes;return 1==d.length?d[0]:d}function D(a,b){this.name=b;this.parent=a;this.el=f("div");this.el.plugin=this;return this}function e(a,b){b=e[E(b)||v];return b[a]||b[a=a.slice(a.indexOf(":")+1)||a]||a}function E(a){return a&&(e[a=(""+a).toLowerCase()]||e[a=a.split("-")[0]])&&a}function V(a){(a=E(a))&&v!=a&&(e[v=e.current=a]=e[v]||{});return v}function W(a,b){-1==e.list.indexOf(a)&&e.list.push(a);Object.merge(e[a]||(e[a]={}),b);v||V(a)}
var v,C=!+"\v1",aa=C&&8>(m.documentMode|0),ca=Object[k].hasOwnProperty,F=[],X=m.body,P=m.createElement,G="textContent"in X?"textContent":"innerText",z=f.cache={},R=0,Q=f.data={window:q,_:e},c=(q.HTMLElement||q.Element||f)[k],U=/^([ \t]*)(@?)((?:("|')(?:\\?.)*?\4|[-\w\:.#\[\]=])*)[ \t]*(.*?)$/gm,ba=/[;\s]*(\w+)(?:\s*\:((?:(["'\/])(?:\\?.)*?\3|[^;])*))?/g,t=f.bindings={"class":function(a,b){N.call(this,a,2>arguments.length||b)},css:function(a,b){this.style[a.camelCase()]=b||""},data:function(a,b){this.attr("data-"+
a,b)},html:function(a){this.innerHTML=a}},K=/([.#:[])([-\w]+)(?:\((.+?)\)|([~^$*|]?)=(("|')(?:\\?.)*?\6|[-\w]+))?]?/g,Z=/([\s>+]*)(?:("|')(?:\\?.)*?\2|\(.+?\)|[^\s+>])+$/,Y=/\s*,\s*(?=(?:[^'"()]|"(?:\\?.)*?"|'(?:\\?.)*?'|\(.+?\))+$)/,J={},L={"first-child":"(a=_.parentNode)&&a.firstChild==_","last-child":"(a=_.parentNode)&&a.lastChild==_",".":"~_.className.split(/\\s+/).indexOf(a)","#":"_.id==a","^":"a.indexOf(v)==0","|":"a.split('-')[0]==v",$:"a.slice(-v.length)==v","~":"~a.split(/\\s+/).indexOf(v)",
"*":"~a.indexOf(v)"};q.El=f;c.append=x;c.after=function(a,b){x.call(a.parentNode,this,b?a:a.nextSibling);return this};c.to=function(a,b){x.call(a,this,b);return this};c.hasClass=y;c.addClass=A;c.rmClass=M;c.toggleClass=N;c.empty=function(){for(var a;a=this.firstChild;)O.call(a);return this};c.kill=O;c.on=function(a,b){Event.add(this,a,b);return this};c.non=function(a,b){Event.remove(this,a,b);return this};c.emit=function(){Event.Emitter.emit.apply(this,arguments)};c.attr=h;f.scope=p;c.render=S;c.txt=
t.txt=function(a){return arguments.length&&this[G]!=a?this[G]=a:this[G]};c.val=t.val=function(a){var b=this,c=b.type,e=b.options;if(arguments.length)return b.value=a;if(e){if("select-multiple"==c){a=[];for(c=0;b=e[c++];)b.selected&&!b.disabled&&a.push(b.valObject||b.value);return a}b=e[b.selectedIndex]||b}return"checkbox"!=c&&"radio"!=c||b.checked?b.valObject||b.value:null};c.matches||(c.matches=function(a){return!!I(a)(this)});c.closest||(c.closest=B);c.find=!C&&c.querySelector||function(a){return H(this,
a,!0)};c.findAll=c.querySelectorAll?function(a){return new u(this.querySelectorAll(a))}:function(a){return new u(H(this,a))};f.wrap=u;u[k]=Object.keys(c).reduce(function(a,b){function d(){for(var a,e=0,f=this.length;e<f;)if(a=c[b].apply(this[e++],arguments),d.first&&a)return a;return d.first?null:this}a[b]=d;return a},F);F.find.first=1;F.cloneNode=function(a){return new u(this.map(function(b){return b.cloneNode(a)}))};c==f[k]&&(m.createElement=function(a){return Object.merge(P(a),c)},Object.merge(X,
c));f[k]=c;f.get=function(a){"string"==typeof a&&(a=m.getElementById(a));return a&&a.to?a:Object.merge(a,c)};D[k]={_done:function(){var a=1<this.el.childNodes.length?new u(this.el.childNodes):this.el.firstChild;this.el.plugin=this.el=this.parent=null;return a},done:function(){var a=this.parent;z[this.name]=this._done();return a}};f.plugins={template:D};f.create=f.tpl=T;f.include=function(a,b,c){b=f.get(a);(new D(null,a)).el.append(T(b.innerHTML)).plugin.done();b.kill()};f.i18n=e;e.list=[];e.get=E;
e.use=V;e.add=W;e.def=function(a){Object.each(a,function(b,c){W(c,a)})};String[k].lang=function(a){return e(this,a)}}(window,document,"prototype");
