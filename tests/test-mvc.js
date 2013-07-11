
/** Tests
!function(){
	var test = new TestCase("Model");

	var sortedList = List.extend({sortFn: function(a, b){return a.get("id") - b.get("id")}});
	var list = sortedList("test");

	list.add({id:1})
	list.add({id:3})
	list.add({id:2})
	list.add({id:3})

	test.compare(
	  list.pluck("id").join(",")
	, "1,2,3"
	, "List.add");

	test.done();
}()
//*/

