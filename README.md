
[1]: https://raw.github.com/litejs/elements-lite/master/min.elements.js
[2]: https://raw.github.com/litejs/elements-lite/master/elements.js


    @version    0.1.15
    @date       2014-03-20
    @stability  0 - Deprecated,1 - Experimental,2 - Unstable,3 - Stable,4 - API Frozen,5 - Locked


Elements
========


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






Example

var text = document.createTextNode('Mmm ... something');
The example above creates a new Text node and saves it to the variable text. The node can then be added to an element like this:
element.appendChild(text);
The argument to createTextNode can only be plain text — you cannot pass entity references (for that you would need the createEntityReference method, which is poorly supported) — however you can pass unicode characters, such as \u00a0 for a non-breaking space.
Since the createTextNode method returns the created Text node, you can also use it directly as the argument to appendChild, which slightly reduces the amount of code (and typing!) involved:
element.appendChild(document.createTextNode('Mmm ... something'));





You can't create nodes with HTML entities. Your alternatives would be to use unicode values

var dropdownTriggerText = document.createTextNode('blabla \u0026');
or set innerHTML of the element. You can of course directly input &...



createTextNode is supposed to take any text input and insert it into the DOM exactly like it is. This makes it impossible to insert for example HTML elements, and HTML entities. It’s actually a feature, so you don’t need to escape these first. Instead you just operate on the DOM to insert text nodes.

So, you can actually just use the & symbol directly:






Nope, it's not specific to the XML (Core) DOM - a TextNode can only contain pure text. If you want to create an entity, you have to use Document.createEntityReference which to my knowledge isn't implemented anywhere (or at least wasn't working even in moz last time I tried to use it).

It takes a DOMString with UTF-16 characters, so I guess you can use a JavaScript string with U+00bb to get your result. ("\u00bb")






Entity references are necessary in the HTML or XML markup. For example, &lt; in a text file tells a parser that the '<' character is part of the data, not the start of a new tag.

But once a document is parsed into a DOM representation, you no longer need to distiguish between the markup and the data. Programming object represent nodes, rather than syntactic strings of text. The DOM doesn't need entity references because there's no mistaking between what's structure and what's data. That's why it gives you the literal text.

How you define characters within the DOM depends on the particular DOM API. liorean's suggestion works in JavaScript because that language uses the \u escape sequence in string literals to define arbitrary Unicode characters. I think C and Java use that too, but other languages might use other methods. It's all dependent on the language of the DOM implementation, not on the DOM or XML standards.

I hadn't heard of document.createEntityReference before but I suspect it's a convenience function that will maps an entity reference to a native character code for you. That would be a nice alternative to looking up the codes.





Entities are a bit more than that. An entity in HTML is usually a single character - it needn't be. And entity can be a strings of longer content, composed of other entities and/or characters. They are defined by the DTD, though, and that's where the problem lies: our browsers are not validating XML parsers, even if expat and msxml have that ability - they don't parse the DTD, they merely checks if one they recognise exists, and use that one.
In other words, they don't "get" entities. They resolve the standard html set of them, but they don't let the user define new ones.

An entity reference is what it sounds like, a reference to an entity - the entity itself is what tells us what content it's to be replaced with. (Look on entities as the declaration of a variable - and entity references as the usage of that variable. It's the closest analogue that I can think of.)







createTextNode and entities

 
Modified with a newer version since it was first posted. Some comments may refer to older versions.

Code:
function entity(str, mode) {
    str = (str) ? str : "";
    mode = (mode) ? mode : "string";

    var e = document.createElement("div");
    e.innerHTML = str;

    if (mode == "numeric") {
        return "&#" + e.innerHTML.charCodeAt(0) + ";";
    }
    else if (mode == "utf16") {
        var un = e.innerHTML.charCodeAt(0).toString(16);
        while (un.length < 4) un = "0" + un;
        return "\\u" + un;
    }
    else return e.innerHTML;
}
entity() has two parameters:
- entity: is a string which can be either a named entity (&raquo;), numeric entity (&#38;#187;), UTF-16 value (\u00bb), or even the character itself (&#187;).
- mode: is an optional value that can be 'string', 'numeric', or 'utf16'. This tells the function what to return the value as. Defaults to 'string'.

You'd use it like this:
Code:
// String mode
var div = document.createElement('div');
var text = document.createTextNode('Parent '+entity('&raquo;')+' Child');
div.appendChild(text);

// Numeric mode
var description = "The entity for &#187; is "+entity('&#187;', 'numeric');

// UTF-16 mode
var description = "The UTF-16 value for &#187; is "+entity('&#187;', 'utf16');
Hope this helps!

function entity(str,stupefy){
    var
        e=document.createElement("div");
    e.innerHTML=String(str);

    if (stupefy)
        return '&#'+e.innerHTML.charCodeAt(0)+';';
    return e.innerHTML;
}










### Licence

Copyright (c) 2012 Lauri Rooden &lt;lauri@rooden.ee&gt;  
[The MIT License](http://lauri.rooden.ee/mit-license.txt)


