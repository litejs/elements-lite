[1]: https://secure.travis-ci.org/litejs/elements-lite.png
[2]: https://travis-ci.org/litejs/elements-lite
[3]: https://coveralls.io/repos/litejs/elements-lite/badge.png
[4]: https://coveralls.io/r/litejs/elements-lite
[7]: https://ci.testling.com/litejs/elements-lite.png
[8]: https://ci.testling.com/litejs/elements-lite
[npm package]: https://npmjs.org/package/elements-lite
[GitHub repo]: https://github.com/litejs/elements-lite


    @version    0.1.17
    @date       2014-03-24
    @stability  1 - Experimental


Elements &ndash; [![Build][1]][2] [![Coverage][3]][4]
========

Syntax follows CSS Selectors where possible.

Usage
-----

`<script src=elements-lite.js></script>` should place inside body.

### Create elements one by one

```javascript
El("div", "test").to(document.body)
//<div>test</div>

El("a#link[href='/home']", "Home").to(document.body)
//<a id="link" href="/home">Home</a>

El("a", {id:"link", href:"/home"}).append("Home").to(document.body)
//<a id="link" href="/home">Home</a>

El(".custom", "test").to(document.body)
//<div class="custom">test</div>
```



Browser Support
---------------

[![browser support][7]][8]



External links
--------------

-   [GitHub repo][]
-   [npm package][]



### Licence

Copyright (c) 2012 Lauri Rooden &lt;lauri@rooden.ee&gt;  
[The MIT License](http://lauri.rooden.ee/mit-license.txt)


