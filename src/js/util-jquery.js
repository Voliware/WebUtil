/*!
 * util-jquery
 * https://github.com/Voliware/Util
 * Licensed under the MIT license.
 */

if(!isDefined($))
	throw new ReferenceError("util-jquery requires jquery 2.2.2 or greater");

/**
 * jQuery utility functions
 */
class $Util {

	/**
	 * Attaches all jQuery functions to a
	 * $wrapper property of an object, but
	 * always returns the base object
	 * @param {*} obj - some object that has a $wrapper property
	 */
	static jQuerify(obj) {
		if (!obj.$wrapper)
			throw new ReferenceError('$Util.jQuerify: $wrapper must be a property of the first argument');
		Util.each($Util.jqueryPrototype, function(i, e) {
			obj[e] = function() {
				obj.$wrapper[e](...arguments);
				return obj;
			}
		});
	}

	/**
	 * Convenient wrapper for merging defaults
	 * and options object with jquery deep $.extend
	 * @param {object} defaults - the default settings
	 * @param {object} options - set options
     */
	static opts(defaults, options){
		return $.extend(true, defaults, options);
	}
}

$Util.jqueryPrototype = Object.getOwnPropertyNames($.prototype);

// extensions for $.fn.populate
// specificy tag name as object name
// and a prop called populate that is a
// function that takes some data argument
$Util.populate = {};


(function($) {

	/**
	 * Append option(s) to a select
	 * @param {*} arguments - Either an object of key/value pairs, where the key is the
	 * option value and the value is the string within the tags,
	 * or a key and value as two parameters to add one option
	 * @returns {jQuery}
	 */
	$.fn.addToSelect = function(){
		var data = {};

		if(arguments.length > 1)
			data[arguments[0]] = arguments[1];
		else
			data = arguments[0];

		var $this = $(this);
		if($this.is('select')){
			Util.each(data, function(i, e){
				var opt = '<option value="'+i+'">'+e+'</option>';
				$this.append(opt);
			});
		}

		return this;
	};

	/**
	 * Checks if an element has an attribute
	 * @param {string} attr - attribute name
	 * @returns {boolean} - true if it does, false otherwise
	 */
	$.fn.hasAttr = function(attr){
		return $(this).is('['+attr+']');
	};

	/**
	 * Popualte a DOM object in the appropriate way.
	 * Extend with $Util.populate object
	 * @param {string|number|jQuery} data
	 */
	$.fn.populate = function(data){
		var $this = $(this);
		var tag = $this.prop("tagName").toLowerCase();
		var type = $this.attr('type');

		var extension = getExtension(tag);
		if(extension)
			extension.call(this, data);
		else
			defaultPopulate(tag, type, data);

		return this;

		/**
		 * Default populate switch
		 * @param {string} tag - element tag
		 * @param {string} type - element type
		 * @param {*} data - data to populate with
		 */
		function defaultPopulate(tag, type, data){
			switch(tag){
				case 'input':
					_populateInput(type, data);
					break;
				case 'select':
				case 'textarea':
					$this.val(data);
					break;
				case 'img':
					$this.attr('src', data);
					break;
				case "button":
					$this.prop('disabled', data === 0);
					break;
				default:
					$this.html(data);
					break;
			}
		}

		/**
		 * Get the extension for this tag,
		 * or for a data-tag attribute
		 * @param {string} tag - element tag
		 * @returns {function|null}
		 */
		function getExtension(tag){
			if($Util.populate[tag])
				return $Util.populate[tag];
			if($this.hasAttr('data-tag'))
				return $Util.populate[$this.attr('data-tag')];
			return null;
		}

		/**
		 * Populate an input according to type
		 */
		function _populateInput(type, data){
			switch(type){
				case "checkbox":
					var checkedValue = $this.data('checked');
					if(data.toString() === checkedValue || data.toString() === "1" || data === true)
						$this.prop('checked', true);
					break;
				case "radio":
					if(data === $this.attr('value'))
						$this.prop('checked', true);
					break;
				default:
					$this.val(data);
					break;
			}
		}
	};

	/**
	 * Populates the children of an object such as a form
	 * by matching data keys with DOM elements that have the
	 * attribute [data-name="key"] or [name="key"].
	 * Uses $.populate(data) to appropriately fill in the
	 * found element.
	 * @param {object} data
	 * @returns {jQuery}
	 */
	$.fn.populateChildren = function(data){
		var $this = $(this);
		Util.each(data, function(i ,e){
			var $el = $this.find('[name="'+i+'"]');
			if($el.length === 0)
				$el = $this.find('[data-name="'+i+'"]');
			if($el.length > 0 && $el.data('populate') !== false)
				$el.populate(e);
		});
		return this;
	};

	/**
	 * Slide toggle who's first arg is a toggle state
	 * @param {boolean} state - true to slide down
	 * @param {string} [options=""]
	 * @param {function} [cb=null]
	 */
	$.fn.slideToggleState = function(state, options = '', cb = null){
		if(state)
			$(this).slideDown(options, cb);
		else
			$(this).slideUp(options, cb);
		return this;
	};

	/**
	 * Disable/enable an option/set of options based on value attribute
	 * @param {*} [arguments] - Pass a boolean to toggle all options,
	 * pass an array and boolean to toggle some options,
	 * pass a string and boolean to toggle one option
	 * @returns {jQuery}
	 */
	$.fn.toggleOption = function(){
		var $this = $(this);
		if(!$this.is('select'))
			return this;

		var state;
		var value;

		// toggle specific options
		if(arguments.length > 1){
			value = arguments[0];
			if(!$.isArray(value))
				value = [value];

			state = arguments[1];

			for(var i = 0; i < value.length; i++){
				$this.find('option[value="'+value[i]+'"]').prop('disabled', !state);
			}
		}
		// toggle all <option>s
		else {
			state = arguments[0];
			$this.find('option').prop('disabled', !state);
		}

		return this;
	};

})(jQuery);