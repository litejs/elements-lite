require("browser-upgrade-lite")
global.Fn = require("functional-lite").Fn

global.Event = global.Event || {}

require("liquid-filters-lite")
require("../")
global.i18n = window.El.i18n

function getString(node) {
	if ('outerHTML' in node)
		return node.outerHTML.toLowerCase().replace(/>[\n\r]+</g, "><").trim()

	var div = document.createElement("div")
	div.appendChild(node.cloneNode(true))
	return div.innerHTML
}

i18n.def({ "et":"Eesti keeles"
	, "en":"In English"
	, "ru":"На русском"
	, "fi":"Suomeksi"
	, "se":"på Svenska"
})

i18n.add("en", {
	date: "%a, %d %b %Y %H:%M:%S %z",
	name: "Name {date|lang}"
})

i18n.add("et", {
	date: "%Y %H:%M:%S %z",
	name: "Nimi {date|lang:'et'}"
})

/*
 * navigator.language
 * "et"
 * navigator.languages
 * ["et", "en-US", "en"]
 */
//i18n.setLang(navigator.language || navigator.userLanguage)

Date.prototype.lang = function(lang) {
	return this.format( i18n("date", lang) )
}

String.prototype.lang = function(lang) {
	return i18n(this, lang)
}

i18n.add("en", {
	firstName: "First Name",
	lastName: "Last Name"
})

i18n.use("en")

var el, h1, h2, h3, h4, input, select, t1

require("testman").

describe("El").
	it ("should build elements").
		run(function(){
			el = El("div")
			select = El("select#id2.cl2:disabled")
			input = El("input")
			h1 = El("h1")
			h2 = El("h2")
			h3 = El("h3")
			h4 = El("h4")
		}).
		equal(getString(el), "<div></div>").
		equal(getString(h1), "<h1></h1>").
		equal(getString(h2), "<h2></h2>").
		equal(getString(h3), "<h3></h3>").
		equal(getString(h4), "<h4></h4>").

		equal(getString(El("")), "<div></div>").
		equal(getString(El("div")), "<div></div>").
		equal(getString(El("", "element")), "<div>element</div>").
		equal(getString(El("div", "element")), "<div>element</div>").
		equal(getString(El("p", "element")), "<p>element</p>").
		anyOf(getString(El("#123")),	[ '<div id="123"></div>'
						, '<div id=123></div>'
						]).
		anyOf(getString(El("div#123")),	[ '<div id="123"></div>'
						, '<div id=123></div>'
						]).
		anyOf(getString(El("p#123")),	[ '<p id="123"></p>'
						, '<p id=123></p>'
						]).
		anyOf(getString(El(".c-1")),	[ '<div class="c-1"></div>'
						, '<div class=c-1></div>'
						]).
		anyOf(getString(El("div.c1")),	[ '<div class="c1"></div>'
						, '<div class=c1></div>'
						]).
		anyOf(getString(El("p.c1")),	[ '<p class="c1"></p>'
						, '<p class=c1></p>'
						]).
		equal(getString(El(".c1.c2")), '<div class="c1 c2"></div>').
		equal(getString(El("div.c1.c2")), '<div class="c1 c2"></div>').
		equal(getString(El("p.c1.c2")), '<p class="c1 c2"></p>').
		anyOf(getString(El("#123.c1")),	[ '<div id="123" class="c1"></div>'
		     				, '<div class="c1" id="123"></div>'
						, '<div class=c1 id=123></div>'
						, '<div id=123 class=c1></div>'
						]).
		anyOf(getString(El("div#123.c1")),	[ '<div id="123" class="c1"></div>'
		     					, '<div class="c1" id="123"></div>'
							, '<div class=c1 id=123></div>'
							, '<div id=123 class=c1></div>'
		     					]).

		equal(getString(El("a[href='http://example.com/']")), '<a href="http://example.com/"></a>').
		equal(getString(El('a[href="http://example.com/"]')), '<a href="http://example.com/"></a>').
		anyOf(getString(El("a[href='http://example.com/'][title=link]")),
			[ '<a href="http://example.com/" title="link"></a>'
			, '<a title="link" href="http://example.com/"></a>',
			, '<a title=link href="http://example.com/"></a>'
			]).
		anyOf(getString(El('a[href="http://example.com/"][title="link to site"]')),
			[ '<a href="http://example.com/" title="link to site"></a>'
			, '<a title="link to site" href="http://example.com/"></a>'
			]).

	it ("shoult set attributes").
		equal(input.set({id: "set_id", title:"set title"}), input).
		equal(input.id, "set_id").
		equal(input.title, "set title").
		equal(input.set({title:"change title", name:"new name", id: "new_id"}), input).
		equal(input.title, "change title").
		equal(input.name, "new name").
		equal(input.id, "new_id").
		equal(input.set({title: null}), input).
		ok(!input.title).

	it ("has kill() and empty() methods").
		equal(select.kill(), select).
		equal(h2.innerHTML, "").
		equal(el.empty(), el).
		equal(el.innerHTML, "").

	it ("set childs").
		equal(getString(el.to(document.body)), "<div></div>").
		equal(getString(el.append(h2)), "<div><h2></h2></div>").
		equal(getString(el.append(h1, h2)), "<div><h1></h1><h2></h2></div>").
		equal(getString(h4.after(h2)), "<h4></h4>").
		equal(getString(el), "<div><h1></h1><h2></h2><h4></h4></div>").
		equal(getString(h3.after(h4, true)), "<h3></h3>").
		equal(getString(el), "<div><h1></h1><h2></h2><h3></h3><h4></h4></div>").
		equal(getString(h3.to(el, h4)), "<h3></h3>").
		equal(getString(el), "<div><h1></h1><h2></h2><h3></h3><h4></h4></div>").

		equal(getString(h1.append([h2, h3])), "<h1><h2></h2><h3></h3></h1>").
		equal(getString(el), "<div><h1><h2></h2><h3></h3></h1><h4></h4></div>").

		anyOf(getString(select.to(h2)),	[ '<select id="id2" disabled="disabled" class="cl2"></select>'
		     				, '<select disabled="disabled" class="cl2" id="id2"></select>'
						, '<select id="id2" class="cl2" disabled="disabled"></select>'
						, '<select class=cl2 id=id2 disabled></select>'
						, '<select id=id2 class=cl2 disabled></select>'
		     				]).
	it ("should get element by id").
		equal(El.get("id2"), select).

	it ("find childs").
		equal(el.find("#id2"), select).
		equal(el.find(".cl2"), select).
		equal(el.find("#id2.cl2"), select).
		equal(el.find(".cl2#id2"), select).
		equal(el.find("select"), select).
		equal(el.find("select#id2"), select).
		equal(el.find("select.cl2"), select).
		equal(el.find("select#id2.cl2"), select).
		equal(el.find("select.cl2#id2"), select).
		equal(el.find("SELECT"), select).
		equal(el.find("SELECT#id2"), select).
		equal(el.find("SELECT.cl2"), select).
		equal(el.find("SELECT#id2.cl2"), select).
		equal(el.find("SELECT.cl2#id2"), select).

		equal(el.find("h2"), h2).
		equal(!!el.find(".cl3"), false).


	it ("supports boolean attributes").
		equal(getString(El("input:selected")), '<input selected="selected">').

	it ("has txt() method").
		equal(el.txt(), "").
		equal(el.txt("hello"), "hello").
		equal(el.txt(), "hello").


	it ("has class methods").
		equal(el.className, "").
		equal(el.hasClass("c1"), false).
		equal(el.hasClass("c2"), false).
		equal(el.hasClass("c3"), false).

		equal(el.addClass("c1"), el).
		equal(el.hasClass("c1"), true).
		equal(el.hasClass("c2"), false).
		equal(el.hasClass("c3"), false).

		equal(el.addClass("c2"), el).
		equal(el.hasClass("c1"), true).
		equal(el.hasClass("c2"), true).
		equal(el.hasClass("c3"), false).

		equal(el.rmClass("c3"), el).
		equal(el.hasClass("c1"), true).
		equal(el.hasClass("c2"), true).
		equal(el.hasClass("c3"), false).

		equal(el.rmClass("c2"), el).
		equal(el.hasClass("c1"), true).
		equal(el.hasClass("c2"), false).
		equal(el.hasClass("c3"), false).

		equal(el.rmClass("c1"), el).
		equal(el.hasClass("c1"), false).
		equal(el.hasClass("c2"), false).
		equal(el.hasClass("c3"), false).

		equal(el.className, "").

		equal(el.toggleClass("c1"), true).
		equal(el.hasClass("c1"), true).
		equal(el.toggleClass("c1", true), true).
		equal(el.hasClass("c1"), true).
		equal(el.toggleClass("c1"), false).
		equal(el.hasClass("c1"), false).
		equal(el.toggleClass("c1", false), false).
		equal(el.hasClass("c1"), false).

		equal(el.className, "").



describe( "Templates" ).
	it ("supports tpl").
		equal(getString(El.tpl("a\n b\n  i")), '<a><b><i></i></b></a>').
		equal(getString(El.tpl("a \n b\n  i")), '<a><b><i></i></b></a>').
		equal(getString(El.tpl("a\n b\n  i link")), '<a><b><i>link</i></b></a>').
		equal(getString(El.tpl("a\n b \n  i link")), '<a><b><i>link</i></b></a>').
		equal(getString(El.tpl("a\n b\n  i link>to")), '<a><b><i>link&gt;to</i></b></a>').
		anyOf(getString(El.tpl("a[href='#a>b']\n b.bold \n  i#ital link")),
			[ '<a href="#a>b"><b class=bold><i id=ital>link</i></b></a>'
			, '<a href="#a>b"><b class="bold"><i id="ital">link</i></b></a>'
			, '<a href="#a&gt;b"><b class="bold"><i id="ital">link</i></b></a>'
			, '<a href="#a%3Eb"><b class="bold"><i id="ital">link</i></b></a>'
			]).

	it ("supports block expansion").
		equal(getString(El.tpl("a>b>i")), '<a><b><i></i></b></a>').
		equal(getString(El.tpl("a > b>i")), '<a><b><i></i></b></a>').
		equal(getString(El.tpl("a>b>i link")), '<a><b><i>link</i></b></a>').
		equal(getString(El.tpl("a>b > i link")), '<a><b><i>link</i></b></a>').
		equal(getString(El.tpl("a>b>i link>to")), '<a><b><i>link&gt;to</i></b></a>').
		anyOf(getString(El.tpl("a[href='#a>b']>b.bold > i#ital link")),
			[ '<a href="#a>b"><b class=bold><i id=ital>link</i></b></a>'
			, '<a href="#a>b"><b class="bold"><i id="ital">link</i></b></a>'
			, '<a href="#a&gt;b"><b class="bold"><i id="ital">link</i></b></a>'
			, '<a href="#a%3Eb"><b class="bold"><i id="ital">link</i></b></a>'
			]).

	it ("supports templates").
		anyOf(getString(El.tpl(":template t1\n .temp1 t123\nt1")),
			[ '<div class=temp1>t123</div>'
			, '<div class="temp1">t123</div>'
			]).
		anyOf(getString(El.tpl(":template t2\n .temp2>b t123\nt2")),
			[ '<div class=temp2><b>t123</b></div>'
			, '<div class="temp2"><b>t123</b></div>'
			]).
		anyOf(getString(El.tpl(":template t3\n .temp3\n  b t123\nt3")),
			[ '<div class=temp3><b>t123</b></div>'
			, '<div class="temp3"><b>t123</b></div>'
			]).

	it ( "should render data to elements" ).
		equal(getString(t1 = El.tpl("a>b[data-bind=\"class:'red','i>1'\"]>i =txt:'hello {name}'")), "<a><b data-bind=\"class:'red','i>1'\"><i data-bind=\"txt:'hello {name}'\"></i></b></a>").
		anyOf(getString(t1.render({i:1,name:"world"})),
			[ "<a><b data-bind=\"class:'red','i>1'\"><i data-bind=\"txt:'hello {name}'\">hello world</i></b></a>"
			, "<a><b class=\"\" data-bind=\"class:'red','i>1'\"><i data-bind=\"txt:'hello {name}'\">hello world</i></b></a>"
			, "<a><b data-bind=\"class:'red','i>1'\" class=\"\"><i data-bind=\"txt:'hello {name}'\">hello world</i></b></a>"
			]).
		anyOf(getString(t1.render({i:2,name:"moon"})),
			[ "<a><b data-bind=\"class:'red','i>1'\" class=\"red\"><i data-bind=\"txt:'hello {name}'\">hello moon</i></b></a>"
			, "<a><b class=\"red\" data-bind=\"class:'red','i>1'\"><i data-bind=\"txt:'hello {name}'\">hello moon</i></b></a>"
			]).

		it ( "should show set DOM propperty when plugin not found" , {skip: "Browsers does not show attrs set by node.unknown_plugin = '123', should use node.set()"}).
		equal(getString(t1 = El.tpl("a =unknown_plugin:\'hello {name}\'")), '<a data-bind="unknown_plugin:\'hello {name}\'"></a>').
		equal(getString(t1.render({name:"world"})), '<a data-bind="unknown_plugin:\'hello {name}\'" unknown_plugin="hello world"></a>').
		equal(getString(t1.render({name:"moon"})), '<a data-bind="unknown_plugin:\'hello {name}\'" unknown_plugin="hello moon"></a>').

done()


/** Tests for El
!function(){
	var test_el = new TestCase("El");



	, el.find("h2"), h2
	//, !!el.find("select:enabled"), false
	, !!el.find("select.cl3"), false
	, "El.find()");
	select.kill();

	el.append(h4, true);
	test_el.compare(el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,""), "<h4></h4><h2></h2>", "El.append");
	h4.kill();
	test_el.compare(el.innerHTML.toLowerCase(), "<h2></h2>", "El.kill");
	h1.after(h2, true);
	test_el.compare(el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,""), "<h1></h1><h2></h2>", "El.after");
	h3.after(h2);
	test_el.compare(el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,""), "<h1></h1><h2></h2><h3></h3>", "El.after");
	el.empty();
	test_el.compare(el.innerHTML.toLowerCase(), "", "El.empty");
	el.append([h3,h4])
	var str = el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,"");
	test_el.compare(
		str == "<h3></h3><h4></h4>" || str == "<div><h3></h3><h4></h4></div>", true, "El.append array");

	el.addClass("test1");
	test_el.compare(el.className, "test1", "El.addClass");

	el.addClass("test2");
	test_el.compare(el.className, "test1 test2");

	el.addClass("test3");
	test_el.compare(el.className, "test1 test2 test3");

	el.addClass("test4");
	test_el.compare(el.className, "test1 test2 test3 test4");

	el.rmClass("test2");
	test_el.compare(el.className, "test1 test3 test4", "El.rmClass");

	el.rmClass("test1");
	test_el.compare(el.className, "test3 test4");

	el.rmClass("test4");
	test_el.compare(el.className, "test3");

	el.rmClass("c4");
	test_el.compare(el.className, "test3");

	var s;

	s = el.toggleClass("test4");
	test_el.compare(el.className, "test3 test4", s, true, "El.toggleClass");

	s = el.toggleClass("test4", true);
	test_el.compare(el.className, "test3 test4", s, true);

	s = el.toggleClass("test4");
	test_el.compare(el.className, "test3", s, false);

	s = el.toggleClass("test4", false);
	test_el.compare(el.className, "test3", s, false);
	test_el.compare(el.hasClass("test3"), true, el.hasClass("test4"), false, "El.hasClass");

	el.css("left","1px");
	test_el.compare(el.css("left"), "1px", "El.css");

	el.css({"top":"2px","left":"3px"});
	test_el.compare(el.css("top"), "2px", el.css("left"), "3px", "El.css");


	test_el.done();
}()
//*/


