
[1]: https://raw.github.com/litejs/elements-lite/master/min.js
[2]: https://raw.github.com/litejs/elements-lite/master/elements-lite.js


Elements
========

DOM builder for browser.
Download [compressed][1] 
(2741 bytes, 1219 bytes gzipped)
or [uncompressed][2] source.


### Usage

`<script src=elements-lite.js></script>` should place inside body.

```javascript
El("div", "test").to(document.body)
//<div>test</div>

El("a", {id:"link", href:"/home"}).append("Home").to(document.body)
//<a id="link" href="/home">Home</a>

El(".custom", "test").to(document.body)
//<div class="custom">test</div>
```


### Licence

Copyright (c) 2012 Lauri Rooden &lt;lauri@rooden.ee&gt;  
[The MIT License](http://lauri.rooden.ee/mit-license.txt)


