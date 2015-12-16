[1]: https://secure.travis-ci.org/litejs/elements-lite.png
[2]: https://travis-ci.org/litejs/elements-lite
[3]: https://coveralls.io/repos/litejs/elements-lite/badge.png
[4]: https://coveralls.io/r/litejs/elements-lite


    @version    0.8.2
    @date       2015-12-16
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


### Templates

It is a template engine inspired by Haml
but uses CSS selectors like syntax for describing elements and attributes.


#### Tags

By default, text at the start of a line (or after only white space) represents an html tag. 
Indented tags are nested, creating the tree like structure of html.


```html
ul
  li Item A
  li Item B
```

becomes

```html
<ul>
  <li>Item A</li>
  <li>Item B</li>
</ul>
```

From CSS Class selectors, ID selectors, Pseudo-classes selectors
and Attribute selectors are supported.

```html
a#123.link.bold[href="#A"][title=go] link
button:disabled
```

becomes

```html
<a id="123" class="link bold" href="#A" title="go">link</a>
<button disabled="disabled"></button>
```


To save space you can use an inline syntax for nested tags.

```html
a>i text
```

becomes

```html
<a><i>text</i></a>
```

#### Inline templates

```html
ul.list
  @template my-row
    li.my-row > b row
  my-row
  my-row
  / Comment
```

becomes

```html
<ul class="list">
  <li class="my-row"><b>row</b></li>
  <li class="my-row"><b>row</b></li>
</ul>
```

#### Data bindings

```html
ul[data-bind="class: 'red', list.count > 5"]
  li[data-bind="txt: row"]
```

.. is equal to

```html
ul &class: "red", list.count > 5
  li[data-bind="txt: row"]
```

Add custom bindings

```javascript
El.bindings.enabled = function(enabled) {
    this.disabled = !enabled
}
```

```html
ul &enabled: list.count > 5
  li[data-bind="txt: row"]
```


Browser Support
---------------

It should work IE6 and up but automated testing is currently broken.



External links
--------------

-   [Source-code on Github](https://github.com/litejs/elements-lite)
-   [Package on npm](https://npmjs.org/package/elements-lite)



### Licence

Copyright (c) 2012-2015 Lauri Rooden &lt;lauri@rooden.ee&gt;  
[The MIT License](http://lauri.rooden.ee/mit-license.txt)


