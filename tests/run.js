


/** Tests for El
!function(){
	var test_el = new TestCase("El");

	var el = El("div")
	  , select = El("select#id2.cl2:disabled")

	var h1 = El("h1");
	var h2 = El("h2");
	var h3 = El("h3");
	var h4 = El("h4");

	el.append(h2);
	test_el.compare(el.innerHTML.toLowerCase(), "<h2></h2>", "El.append");
	h2.append(select)
	test_el.compare(
	  el.find("#id2"), select
	, el.find(".cl2"), select
	//, el.find("select:disabled"), select
	, el.find("#id2.cl2"), select
	//, el.find("#id2.cl2:disabled"), select
	//, el.find("select#id2.cl2:disabled"), select
	, el.find("select#id2.cl2"), select
	, el.find("select#id2"), select
	, el.find("select"), select
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


