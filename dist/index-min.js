!function(w,l,h){function I(a,b,d){for(var g=[],r=a.firstChild,c=J(b);b=r;){if(c(b)){if(d)return b;g.push(b)}for(r=b.firstChild||b.nextSibling;!r&&(b=b.parentNode)!==a;)r=b.nextSibling}return d?null:g}function J(a){return K[a]||(K[a]=Function("_,v,a,b","return "+a.split(ba).map(function(a){var d,g,c=["_&&_.nodeType==1"],f=a.replace(ca,function(a,b,c,r){g=r+b.length;d=b.trim();return""});(a=a.slice(g).replace(L,function(a,b,d,g,f,A,e){c.push("((v='"+(g||(e?A.slice(1,-1):A)||"").replace(/'/g,"\\'")+
"'),(a='"+d+"'),1)",M[":"==b?d:b]||"(a=_.getAttribute(a))"+(f?"&&"+M[f]:A?"==v":""));return""}))&&"*"!=a&&(c[0]+="&&_.nodeName=='"+a.toUpperCase()+"'");f&&c.push("+"==d?"(a=_.previousSibling)":"(a=_.parentNode)",(d?"a.matches&&a.matches('":"a.closest&&a.closest('")+f+"')");return c.join("&&")}).join("||")))}function f(a,b,d){var g={};a=a.replace(L,function(a,b,d,c,f,e,k){e=k?e.slice(1,-1):e||d;g[b="."==b?(f="~","class"):"#"==b?"id":d]=f&&g[b]?"^"==f?e+g[b]:g[b]+("~"==f?" ":"")+e:e;return""})||"div";
a=(B[a]||(B[a]=l.createElement(a))).cloneNode(!0).attr(g);return d||!b?a:("object"==typeof b?k:x).call(a,b)}function x(a,b){var d,g=0,c=typeof a;if(a){if("string"==c||"number"==c)a=l.createTextNode(a);else if(!("nodeType"in a)&&"length"in a){c=a.length;for(d=l.createDocumentFragment();g<c;)x.call(d,a[g++]);a=d}a.nodeType&&(c=this.insertBefore?this:this[this.length-1],c.insertBefore(a,(!0===b?c.firstChild:"number"==typeof b?c.childNodes[0>b?c.childNodes.length-b-2:b]:b)||null))}return this}function y(a){return-1<
this.className.split(/\s+/).indexOf(a)}function C(a){var b=this.className;b&&(a=y.call(this,a)?b:b+" "+a);b!=a&&(this.className=a);return this}function N(a){y.call(this,a)&&(this.className=(" "+this.className+" ").replace(" "+a+" "," ").trim());return this}function O(a,b){1==arguments.length&&(b=!y.call(this,a));return(b?C:N).call(this,a),b}function P(){var a;this.emit&&this.emit("kill");this.parentNode&&this.parentNode.removeChild(this);Event.removeAll&&Event.removeAll(this);this.empty&&this.empty();
(a=this.attr&&this.attr("data-scope"))&&delete p[a];this.valObject&&(this.valObject=null);return this}function k(a,b){var d;if(a&&a.constructor==Object){for(b in a)k.call(this,b,a[b]);return this}d=this.getAttribute(a);if(1==arguments.length)return d;!da||"id"!=a&&"name"!=a&&"checked"!=a?"class"==a?C.call(this,b):b||0===b?d!=b&&this.setAttribute(a,b):d&&this.removeAttribute(a):this.mergeAttributes(Q("<INPUT "+a+'="'+b+'">'),!1)}function p(a,b,d){if(d=p[k.call(a,"data-scope")])return d;b&&!0!==b||
(d=(d=R.call(a,"[data-scope]"))&&p[k.call(d,"data-scope")]||S);b&&(k.call(a,"data-scope",++T),d=p[T]=Object.create(b=d||b),d._super=b);return d}function U(a,b){var d,c,f;if(1!=this.nodeType)return this;a=p[k.call(this,"data-scope")]||a||(d=R.call(this,"[data-scope]"))&&p[k.call(d,"data-scope")]||S;if(d=!b&&k.call(this,"data-bind")){c=d;f="data b r->data&&("+d.replace(ea,function(a,b,d){return q[b]?(fa.call(q[b],"once")&&(c=c.replace(a,"")),"(r=b['"+b+"'].call(this,"+(q[b].raw?"data,'"+d+"'":d)+")||r),"):
"this.attr('"+b+"',"+d+"),"})+"r)";d!=c&&k.call(this,"data-bind",c);try{if(Fn(f,this,a)(a,q))return this}catch(e){e.message+=" in binding: "+d;console.error(e);if(w.onerror)w.onerror(e.message,e.fileName,e.lineNumber);return this}}for(d=this.firstChild;d;d=c)c=d.nextSibling,U.call(d,a);D&&"SELECT"==this.nodeName&&this.parentNode.insertBefore(this,this);return this}function t(a){for(var b=this.length=a.length;b--;)this[b]=a[b]}function V(a){var b="closest"==a||"find"==a;E[a]=function(){for(var d,g=
0,f=this.length;g<f;)if(d=c[a].apply(this[g++],arguments),b&&d)return d;return b?null:this}}function W(a){function b(a,d,l,n,m,h){for(m=d.length;m<=e[0];)e.shift(),c=c.plugin?c.plugin.done():c.parentNode||c[0].parentNode;c.txtMode?c.txt+=a+"\n":l?f.plugins[n]?(c=(new f.plugins[n](c,h)).el,e.unshift(m)):c.append(a):(n&&(c=f(n,0,1).to(c),e.unshift(m)),h&&(m=h.charAt(0),n=h.slice(1),">"==m?(d+" "+n).replace(X,b):"|"==m||"\\"==m?c.append(n):"/"!=m&&("&"!=m&&(n=("INPUT"==c.tagName?"val":"txt")+":_('"+
h.replace(/'/g,"\\'")+"').format(data)"),m=k.call(c,"data-bind"),k.call(c,"data-bind",(m?m+";":"")+n))))}var d=l.createDocumentFragment(),c=d,e=[-1];a.replace(X,b);d=d.childNodes;return 1==d.length?d[0]:d}function F(a,b){this.name=b;this.parent=a;this.el=f("div");this.el.plugin=this}function z(a){this.txtMode=this.parent=a;this.txt="";this.plugin=this.el=this}function e(a,b){b=e[G(b)||u];return b[a]||b[a=a.slice(a.indexOf(":")+1)||a]||a}function G(a){return a&&(e[a=(""+a).toLowerCase()]||e[a=a.split("-")[0]])&&
a}function Y(a){(a=G(a))&&u!=a&&(e[u=e.current=a]=e[u]||{});return u}function Z(a,b){-1==e.list.indexOf(a)&&e.list.push(a);Object.merge(e[a]||(e[a]={}),b);u||Y(a)}var u,v,D=!+"\v1",da=D&&8>(l.documentMode|0),fa=Object[h].hasOwnProperty,E=[],aa=l.body,Q=l.createElement,H="textContent"in aa?"textContent":"innerText",B=f.cache={},T=0,S=f.data={_:e},c=(w.HTMLElement||w.Element||f)[h],X=/^([ \t]*)(@?)((?:("|')(?:\\?.)*?\4|[-\w\:.#\[\]=])*)[ \t]*(.*?)$/gm,ea=/[;\s]*(\w+)(?:\s*\:((?:(["'\/])(?:\\?.)*?\3|[^;])*))?/g,
q=f.bindings={"class":function(a,b){O.call(this,a,2>arguments.length||b)},css:function(a,b){this.style[a.camelCase()]=b||""},data:function(a,b){this.attr("data-"+a,b)},html:function(a){this.innerHTML=a}},ga=c.matches||function(a){return!!J(a)(this)},R=c.closest||function(a){for(var b=this;b;b=b.parentNode)if(ga.call(b,a))return b;return null},L=/([.#:[])([-\w]+)(?:\((.+?)\)|([~^$*|]?)=(("|')(?:\\?.)*?\6|[-\w]+))?]?/g,ca=/([\s>+]*)(?:("|')(?:\\?.)*?\2|\(.+?\)|[^\s+>])+$/,ba=/\s*,\s*(?=(?:[^'"()]|"(?:\\?.)*?"|'(?:\\?.)*?'|\(.+?\))+$)/,
K={},M={"first-child":"(a=_.parentNode)&&a.firstChild==_","last-child":"(a=_.parentNode)&&a.lastChild==_",".":"~_.className.split(/\\s+/).indexOf(a)","#":"_.id==a","^":"!a.indexOf(v)","|":"a.split('-')[0]==v",$:"a.slice(-v.length)==v","~":"~a.split(/\\s+/).indexOf(v)","*":"~a.indexOf(v)"};w.El=f;c.append=x;c.after=function(a,b){x.call(a.parentNode,this,b?a:a.nextSibling);return this};c.to=function(a,b){x.call(a,this,b);return this};c.hasClass=y;c.addClass=C;c.rmClass=N;c.toggleClass=O;c.empty=function(){for(var a;a=
this.firstChild;)P.call(a);return this};c.kill=P;c.on=function(a,b){Event.add(this,a,b);return this};c.non=function(a,b){Event.remove(this,a,b);return this};c.emit=function(){Event.Emitter.emit.apply(this,arguments)};c.attr=k;f.scope=p;c.render=U;c.txt=q.txt=function(a){return arguments.length&&this[H]!=a?this[H]=a:this[H]};c.val=q.val=function(a){var b=this,c=b.type,e=b.options;if(arguments.length)return b.value=a;if(e){if("select-multiple"==c){a=[];for(c=0;b=e[c++];)b.selected&&!b.disabled&&a.push(b.valObject||
b.value);return a}a=b.selectedIndex;b=-1<a&&e[a]||b}return"checkbox"!=c&&"radio"!=c||b.checked?b.valObject||b.value:null};c.find=!D&&c.querySelector||function(a){return I(this,a,!0)};c.findAll=c.querySelectorAll?function(a){return new t(this.querySelectorAll(a))}:function(a){return new t(I(this,a))};f.wrap=t;t[h]=E;Object.keys(c).each(V);V("closest");E.cloneNode=function(a){return new t(this.map(function(b){return b.cloneNode(a)}))};c==f[h]&&(l.createElement=function(a){return Object.merge(Q(a),c)},
Object.merge(aa,c));f[h]=c;f.get=function(a){"string"==typeof a&&(a=l.getElementById(a));return a&&a.to?a:Object.merge(a,c)};f.css=function(a){v||(v=f("style").to(l.getElementsByTagName("head")[0]));v.styleSheet?v.styleSheet.cssText+=a:v.appendChild(l.createTextNode(a))};F[h]={_done:function(){var a=1<this.el.childNodes.length?new t(this.el.childNodes):this.el.firstChild;this.el.plugin=this.el=this.parent=null;return a},done:function(){var a=this.parent;B[this.name]=this._done();return a}};z[h].done=
Fn("Function(this.txt)(),this.parent");f.plugins={binding:z.extend({done:function(){Object.merge(q,Function("return({"+this.txt+"})")());return this.parent}}),css:z.extend({done:Fn("El.css(this.txt),this.parent")}),js:z,template:F};f.view=f.tpl=W;f.include=function(a,b,c){b=f.get(a);(new F(null,a)).el.append(W(b.innerHTML)).plugin.done();b.kill()};f.i18n=e;e.list=[];e.get=G;e.use=Y;e.add=Z;e.def=function(a){Object.each(a,function(b,c){Z(c,a)})};String[h].lang=function(a){return e(this,a)}}(window,
document,"prototype");
