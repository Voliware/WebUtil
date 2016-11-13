"use strict";

var expect = chai.expect;


// EventSystem

describe("EventSystem", function() {
	describe("_	createEvent", function() {
		it("should return a new event object", function() {
			var t = new EventSystem();
			var e = t._createEvent('foo');
			expect(e).to.have.key("callbacks");
		});
	});
	describe("on", function() {
		it("should add a new event if it does not exist", function() {
			var t = new EventSystem();
			function fooListener(sender, e){}
			t.on('foo', fooListener);
			expect(t.events).to.have.key("foo");
		});
		it("should add on to list of previous listeners", function() {
			var t = new EventSystem();
			function fooListener(sender, e){}
			function fooListener2(sender, e){}
			t.on('foo', fooListener);
			t.on('foo', fooListener2);
			expect(t.events.foo.callbacks.length).to.equal(2);
		});
		it("should add a new event callback if the event exists", function() {
			var t = new EventSystem();
			t._createEvent('foo');
			function fooListener(sender, e){}
			t.on('foo', fooListener);
			expect(t.events.foo.callbacks.length).to.equal(1);
		});
	});
	describe("off", function() {
		it("should remove an event listener if it exists", function() {
			var t = new EventSystem();
			function fooListener(sender, e){}
			function fooListener2(sender, e){}
			t.on('foo', fooListener);
			t.on('foo', fooListener2);
			t.off('foo', fooListener2);
			expect(t.events.foo.callbacks.length).to.equal(1);
		});
	});
	describe("trigger", function() {
		it("should run all callbacks for an event", function() {
			var t = new EventSystem();
			var res = {};
			t.on('foo', function(val){
				res.e = val;
			});
			t.trigger('foo', 555);
			expect(res.e).to.equal(555);
		});
	});
});