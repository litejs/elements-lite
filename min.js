!function(l,f,g){function e(a,b){var d,c={};a=a.replace(m,function(a,b,d,e){c["."==b?(b="class",c[b]&&(d=c[b]+" "+d),b):"#"==b?"id":d]=e||d;return""})||"div";d=(h[a]||(h[a]=f.createElement(a))).cloneNode(!0).set(c);return j[a]&&j[a](d,b)||d.set(b)}function k(a,b,d){if(a)for(d in b=e[g],b)a[d]=b[d];return a}var h={},j={},c=(l.HTMLElement||l.Element||e)[g],m=/([.#:[])([-\w]+)(?:=([-\w]+)])?/g;c.append=function(a,b){if(a){if("string"==typeof a||"number"==typeof a)a=e.text(a);else if(!("nodeType"in a)&&
"length"in a){for(var d=a.length,c=0,g=f.createDocumentFragment();c<d;)this.append.call(g,a[c++]);a=g}a.nodeType&&this.insertBefore(a,(!0===b?this.firstChild:"number"==typeof b?this.childNodes[b]:b)||null);a.append_hook&&a.append_hook()}return this};c.after=function(a,b){a.parentNode.append(this,b?a:a.nextSibling);return this};c.to=function(a,b){a.append(this,b);return this};c.hasClass=function(a){return RegExp("\b"+a+"\b").test(this.className)};c.addClass=function(a){this.className+=""==this.className?
a:this.hasClass(a)?"":" "+a;return this};c.rmClass=function(a){this.className=(" "+this.className+" ").replace(" "+a+" "," ").trim();return this};c.toggleClass=function(a,b){1==arguments.length&&(b=!this.hasClass(a));this[b?"addClass":"rmClass"](a);return b};c.empty=function(){for(var a;a=this.firstChild;)this.kill.call(a);return this};c.kill=function(){this.parentNode&&this.parentNode.removeChild(this);Event.removeAll&&Event.removeAll(this);this.kill_hook&&this.kill_hook();this.empty&&this.empty();
return this};c.on=function(a,b){Event.add(this,a,b);return this};c.non=function(a,b){Event.remove(this,a,b);return this};c.set=function(a){var b=typeof a,d;if(a)if("string"==b||"number"==b||a.nodeType||"length"in a)this.append(a);else for(b in a)d=a[b],"class"==b?this.addClass(d):"string"==typeof d?(this.setAttribute(b,d),"name"==b&&"\v"=="v"&&this.mergeAttributes(f.createElement("<INPUT name='"+b+"'/>"),!1)):d?this[b]=d:this.removeAttribute(b);return this};c._find=function(a){var b=0,d=["_"];a=a.replace(m,
function(a,b,c,e){d.push("."==b?"(' '+_.className+' ').indexOf(' "+c+" ')>-1":"#"==b?"_.id=='"+c+"'":"_.getAttribute(['"+c+"'])"+(e?"=='"+e+"'":""));return""})||"*";var c=this.getElementsByTagName(a),e=d.join("&&").fn();for(d.join("&&");a=c[b++];)if(e(a))return a.to?a:k(a)};c.find=f.querySelector?function(a){return this.querySelector(a)}:c._find;if(c===e[g]){var n=f.createElement;f.createElement=function(a){return k(n(a))};k(f.body)}e[g]=c;e.get=function(a){"string"==typeof a&&(a=f.getElementById(a));
return a&&a.to?a:k(a)};e.cache=function(a,b,c){h[a]="string"==typeof b?e(b):b;c&&(j[a]=c)};e.cache.el=h;e.cache.fn=j;e.text=function(a){return f.createTextNode(a)};l.El=e}(this,document,"prototype");
