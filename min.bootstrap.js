function Nop(){}function lazy(a,d,c){a[d]||(a[d]=function(){return(a[d]=new Function("a,b,c,d",c)).apply(this,arguments)})}lazy(this,"XMLHttpRequest","return new ActiveXObject('MSXML2.XMLHTTP')");!this.execScript&&Function("d,Date","return(1,eval)('(Date)')===d")(Date,1)&&(this.execScript=eval);lazy(this,"execScript","d=document;b=d.body;c=d.createElement('script');c.text=a;b.insertBefore(c,b.firstChild)");
function xhr(a,d,c,e){var b=xhr.q.shift()||new XMLHttpRequest;b.open(a,d,!e);e||(b.onreadystatechange=function(){4==b.readyState&&(c&&c(b.responseText,b),b.onreadystatechange=c=Nop,xhr.q.push(b))});return b}xhr.q=[];function load(a,d){"string"==typeof a&&(a=[a]);for(var c=a.length,e=[];c--;)!function(b){xhr("GET",a[b],function(a){e[b]=a;--c||(execScript(e.join("/**/;")),d&&d(),e=null)}).send()}(c)}Function.prototype.bind||_load.unshift("up.js");load(_load);