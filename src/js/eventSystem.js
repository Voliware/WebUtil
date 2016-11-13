/*!
 * eventSystem
 * https://github.com/Voliware/Util
 * Licensed under the MIT license.
 */

/**
 * Basic event system.
 * Uses the on/off/trigger or emit methods.
 */
class EventSystem {

	/**
	 * Constructor
	 * @returns {EventSystem}
	 */
	constructor(){
		this.events = {};
		return this;
	}

	/**
	 * Create an event an object
	 * with an array of callbacks
	 * @param {string} name - name of the event
	 * @returns {{callbacks: Array}}
	 * @private
	 */
	_createEvent(name){
		return this.events[name] = { callbacks : [] };
	}

	/**
	 * Destroy an event
	 * @param {string} name - name of the event
	 * @returns {EventSystem}
	 * @private
	 */
	_destroy(name){
		if(isDefined(this.event[name]))
			delete this.event[name];
		return this;
	}

	/**
	 * Attaches a callback to an event
	 * @param {string} name - name of the event
	 * @param {function} callback - the callback function
	 * @returns {EventSystem}
	 */
	on(name, callback){
		var event = this.events[name];

		if(!isDefined(event))
			event = this._createEvent(name);

		event.callbacks.push(callback);
		return this;
	}

	/**
	 * Detach a callback from an event.
	 * This will only work if the callback is not anonymous
	 * @param {string} name - name of the event
	 * @param {function} callback - the callback function
	 * @returns {EventSystem}
	 */
	off(name, callback){
		var event = this.events[name];

		if(isDefined(event)){
			var i = event.callbacks.indexOf(callback);
			if (i > -1)
				event.callbacks.splice(i, 1);
		}
		return this;
	}

	/**
	 * Remove all callbacks for an event
	 * @param {string} name - name of the event
	 * @returns {EventSystem}
	 */
	offAll(name){
		var event = this.events[name];

		if(isDefined(event))
			event[name].callbacks = [];

		return this;
	}

	/**
	 * Run all callbacks attached to an event
	 * @returns {EventSystem}
	 */
	trigger(){
		// grab the name of the event and remove it from arguments
		var shift = [].shift;
		var name = shift.apply(arguments);
		var event = this.events[name];

		// there's no need to trigger if no one is listening
		if(!isDefined(event))
			return this;

		for(var i = 0; i < event.callbacks.length; i++){
			event.callbacks[i](...arguments);
		}
		return this;
	}

	/**
	 * Alias to trigger method
	 * @returns {EventSystem}
	 */
	emit(){
		return this.trigger();
	}
}