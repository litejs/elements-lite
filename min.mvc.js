!function(l){function g(a){/[^0-9]/.test(a)&&(a='"'+a+'"');return a}function m(a){a=a.replace(/([^&\|\(\)]+)(\)?)(&|\||$)/g,function(a,b,d,c){c=d+c+c;if(~b.indexOf("*"))return'(""+i.'+b.split(".").join("\\.").split("*").join(".*").replace("=",").search(/")+"/i)>-1"+c;if(a=b.match(/^([^\[\{=]+)=?(\[|\{)([^\]\}]+)(\]|\})$/)){var f="i."+a[1];a=a[3].replace(/[^,]+/g,function(a,b,c){b=a.split("-");if(1==b.length)return f+"=="+g(a);a=[];b[0].length&&a.push(f+">="+g(b[0]));b[1].length&&a.push(f+"<="+g(b[1]));
return"("+a.join("&&")+")"});return"("+a.split(",").join("||")+")"+c}a=b.indexOf("=");return~a?"''+i."+b.substr(0,a)+"==''+"+g(b.substr(a+1))+c:~b.indexOf(".")?g(b)+'.split(".").fold(function(a,b){return a && b in a && a[b]}, i)':g(b)+" in i"+c});0<a.length&&(this.str=a,this.test=new Function("i","return i&&"+a))}var h=Init.extend(Fn.Events,{init:function(a){this.data=a;this.previous={};this.lists=[]},set:function(a,e){var b=this.data,d=[],c;for(c in a)a.hasOwnProperty(c)&&b[c]!==a[c]&&(this.previous[c]=
b[c],b[c]=a[c],d.push(c));!e&&d.length&&this.emit("change",d,e);return d},get:function(a){return this.data[a]},destroy:function(a){for(var e=this.lists,b=e.length;0<b;)e[--b].remove(this);this.trigger("destroy",a)}}).cache(!0,function(a){return a[0].id}),n=Init.extend(Fn.Items,Fn.Events,{init:function(a){this.name=a;this.items=[]},model:h,add:function(a,e){var b=a;b instanceof this.model||(b=this.model(a),b.set(a,!0));if(-1==b.lists.indexOf(this)){b.lists.push(this);var d;if(void 0!==e)d=e;else{d=
this.items;var c=b,f=this.sortFn,g,h=0,k=d.length;if(f&&0<k&&1>f(c,d[k-1]))for(;h<k;)0>f(c,d[g=h+k>>1])?k=g:h=g+1;d=k}e=d;this.items.splice(e,0,b);this.emit("add",b,e)}return this},set:function(a,e){this.each(function(b){b.set(a,e)})},remove:function(a){-1<a.lists.remove(this)&&this.emit("remove",a,this.items.remove(a))},removeAll:function(){for(var a=this.items.length;a--;)this.remove(this.items[a])},toString:function(){return"[List: "+this.name+"]"}}).cache(!0);m.prototype={test:True,str:"all",
subset:function(a){return"all"==a.str||~this.str.indexOf(a.str)},toString:function(){return"[Filter: "+this.str+"]"}};n.Filter=m.cache(!0);l.Model=h;l.List=n;h.merge=function(a,e,b,d){b=b||"";d=d||[];var c,f;for(c in e)e.hasOwnProperty(c)&&a[c]!==e[c]&&(f=e[c],d.push(b+c),null===f?delete a[c]:"object"==typeof f&&Object.keys(f).length&&"object"==typeof a[c]?h.merge(a[c],f,b+c+".",d):a[c]=f);return d}}(this);
