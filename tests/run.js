global.document = global.document || require("../lib/min-document.js")
global.HTMLElement = global.HTMLElement || document.HTMLElement
global.window = global.window || global
global.Event = global.Event || {}

require("../")

var getString = (function() {
	var DIV = document.createElement("div");

	if (DIV.hasOwnProperty("toString")) {
		console.log("toString")
		return function(node) {
			return node.toString()
		}
	}

	if ('outerHTML' in DIV)
		return function(node) {
			return node.outerHTML;
		};

	return function(node) {
		var div = document.createElement("div");
		div.appendChild(node.cloneNode(true));
		return div.innerHTML;
	};

})();

var el, h1, h2, h3, h4, select

require("testman")
.describe("El").
	it ("should build elements").
		run(function(){
			el = El("div")
			select = El("select#id2.cl2:disabled")
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
		equal(getString(el.append(h2)), "<div><h2></h2></div>").
		anyOf(getString(h2.append(select)),	[ '<h2><select id="id2" disabled="disabled" class="cl2"></select></h2>'
		     					, '<h2><select disabled="disabled" class="cl2" id="id2"></select></h2>'
							, '<h2><select id="id2" class="cl2" disabled="disabled"></select></h2>'
		     					]).

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

		equal(select.kill(), select).

		equal(getString(El("")), "<div></div>").
		equal(getString(El("div")), "<div></div>").
		equal(getString(El("", "element")), "<div>element</div>").
		equal(getString(El("div", "element")), "<div>element</div>").
		equal(getString(El("#123")), '<div id="123"></div>').
		equal(getString(El("div#123")), '<div id="123"></div>').
		equal(getString(El(".c1")), '<div class="c1"></div>').
		equal(getString(El("div.c1")), '<div class="c1"></div>').
		equal(getString(El(".c1.c2")), '<div class="c1 c2"></div>').
		equal(getString(El("div.c1.c2")), '<div class="c1 c2"></div>').
		anyOf(getString(El("#123.c1")),	[ '<div id="123" class="c1"></div>'
		     				, '<div class="c1" id="123"></div>'
						]).
		anyOf(getString(El("div#123.c1")),	[ '<div id="123" class="c1"></div>'
		     					, '<div class="c1" id="123"></div>'
		     					]).

		equal(getString(El("a[href='http://example.com/']")), '<a href="http://example.com/"></a>').
		equal(getString(El('a[href="http://example.com/"]')), '<a href="http://example.com/"></a>').
		anyOf(getString(El("a[href='http://example.com/'][title=Link]")),
			[ '<a href="http://example.com/" title="Link"></a>'
			, '<a title="Link" href="http://example.com/"></a>',
			]).
		anyOf(getString(El('a[href="http://example.com/"][title="Link to site"]')),
			[ '<a href="http://example.com/" title="Link to site"></a>'
			, '<a title="Link to site" href="http://example.com/"></a>'
			]).
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


