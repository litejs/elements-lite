!function(m,n){function s(b){for(var a=[],c=b.length;c--;)a[c]=b[c];return a}function k(b){function a(b,c,h,f,l,g){for(l=c.length;l<=d[0];)d.shift(),e=e.plugin?e.plugin.done():e.parentNode;h?k.plugins[f]?(e=(new k.plugins[f](e,g)).el,d.unshift(l)):e.append(El.text(b)):(f&&(e=El(f).to(e),d.unshift(l)),g&&(">"==g.charAt(0)?(c+" "+g.slice(1)).replace(p,a):"="==g.charAt(0)?e.set({"data-bind":g.slice(1)}):e.append(g.replace(/\\([=>:])/g,"$1"))))}var c=n.createDocumentFragment(),e=c,d=[-1];b.replace(p,
a);d=c.childNodes;return 1==d.length?d[0]:s(d)}function f(b,a){this.name=a;this.parent=b;this.el=El("div");this.el.plugin=this;return this}function q(b){var a=b._template;if(!a){b._template=a=[];for(var c;c=b.firstChild;)a.push(c),b.removeChild(c);console.log(b,"TEMP",a)}return a}function h(b){var a,c,e,d=this;if(c=d.getAttribute("data-bind")){e=d.getAttribute("lang")||e;if(a=c.match(/(\w+)\:/))c=c.slice(a[0].length),a=r[a[1]]||a[1];if("function"==typeof a)return a(d,b,c),d;d[a||r.txt]=i18n(c,e).format(b)}for(d=
d.firstChild;d;d=d.nextSibling)1==d.nodeType&&h.call(d,b);return this}var p=/^([ \t]*)(\:?)((?:(["'\/])(?:\\.|.)*?\4|[-\w\:.#\[\]=])+)[ \t]*(.*)$/gm;f.prototype.done=function(){El.cache(this.name,this.el.removeChild(this.el.firstChild),h);this.el.plugin=null;return this.parent};var t=f.extend({done:function(){El.cache(this.name,this.el.firstChild,h);this.el.plugin=null;return this.parent}});k.plugins={template:f,"if":t,"for":function(b,a,c){}};m.haml=k;m.include=function(b,a,c){a=El.get(b);(new f(null,
b)).el.append(El.haml(a.innerHTML)).plugin.done();a.kill()};var r={txt:"textContent"in n?"textContent":"innerText",toggleClass:function(){},html:"innerHTML","if":function(b,a,c){q(b);var e=a&&a[c];e&&b.empty().append(Fn(c)(a)&&e)},each:function(b,a,c){var e=q(b);(a=a&&a[c])&&b.empty().append(a.map(function(a){return e.map(function(b){return h.call(b.cloneNode(!0),a)})}))}};m.prototype.render=h}(window.El||this,window.document);