/*!
 * util
 * https://github.com/Voliware/Util
 * Licensed under the MIT license.
 */

/**
 * General utility functions
 */
class Util {
	/**
	 * Wraps a for in loop.
	 * For each object it will pass the
	 * property name and value to a callback.
	 * @param {object} data - data to loop through
	 * @param {function} cb - callback
	 */
	static each(data, cb){
		for(var i in data){
			var e = data[i];
			cb(i, e);
		}
	}
}

// helpers
if(typeof isDefined === 'undefined'){
	window.isDefined = function(x){
		return typeof x !== 'undefined';
	}
}
if(typeof isNull === 'undefined'){
	window.isNull = function(x){
		return x === null;
	}
}
if(typeof isFunction === 'undefined'){
	window.isFunction = function(x){
		return typeof x === 'function';
	}
}
if(typeof isString === 'undefined'){
	window.isString = function(x){
		return typeof x === 'string';
	}
}
if(typeof isNumber === 'undefined'){
	window.isNumber = function(x){
		return typeof x === 'number';
	}
}
if(typeof isObject === 'undefined'){
	window.isObject = function(x){
		return x !== null && typeof x === 'object';
	}
}
if(typeof getType === 'undefined') {
	//http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
	window.getType = function (x) {
		if (x === null)
			return "[object Null]";
		return Object.prototype.toString.call(x);
	}
}
if(typeof createGuid === 'undefined'){
	window.createGuid =	function createGuid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	}
}


// array
if(typeof Array.diff === 'undefined'){
	Array.diff = function(a, b) {
		return a.filter(function(i) {
			return b.indexOf(i) < 0;
		});
	};
}
if(typeof Array.min === 'undefined'){
	Array.min = function(array){
		return Math.min.apply(Math, array)
	}
}
if(typeof Array.max === 'undefined'){
	Array.max = function(array){
		return Math.max.apply(Math, array)
	}
}

//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign != 'function') {
	Object.assign = function(target) {
		'use strict';
		if (target == null) {
			throw new TypeError('Cannot convert undefined or null to object');
		}

		target = Object(target);
		for (var index = 1; index < arguments.length; index++) {
			var source = arguments[index];
			if (source != null) {
				for (var key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = source[key];
					}
				}
			}
		}
		return target;
	};
}