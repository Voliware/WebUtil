/*!
 * manager
 * https://github.com/Voliware/Util
 * Licensed under the MIT license.
 */

if(!isDefined(EventSystem))
	throw new ReferenceError("Manager requires EventSystem");

/**
 * Generic object manager.
 * Adds/updates/deletes objects in a collection.
 * Can accept an array or object of
 * data and determine which objects
 * are new, old, or no longer exist
 * @extends EventSystem
 */
class Manager extends EventSystem {

	/**
	 * Constructor
	 * @param {object} [options]
	 * @param {string} [options.identifier='id'] - the property name that identifies
	 * each object, which is a property of each object, managed by this manager
	 * @param {boolean} [options.useObjectNames=false] - whether to use the names
	 * of objects passed to manage() as their object identifiers
	 * @returns {Manager}
	 */
	constructor(options) {
		super();
		var defaults = {
			// to manage objects, they must have
			// a unique id before they get to Manager.
			// this is their id property name
			identifier: 'id',
			// OR instead of using an identifier,
			// use the name of the object.
			// this only works when passing
			// objects of objects to manage()
			useObjectNames : false
		};
		this.settings = Object.assign(defaults, options);

		// all child classes will use
		// a more friendly name for objects
		// so any mutations must be done
		// to the object itself, not this ref
		this.objects = {};
		this.count = 0;

		// cached data passed to manage()
		this._cachedData = {};

		return this;
	}

	/**
	 * Check if an object exists in the collection
	 * @param {...(number|object|string)} arguments - the object or the id of the object
	 * @returns {boolean}
	 * @private
	 */
	_exists(){
		var arg = arguments[0];
		if(isString(arg) || isNumber(arg))
			return isDefined(this.objects[arg]);
		else
			return isDefined(this.objects[arg[this.settings.identifier]]);
	}

	/**
	 * Get an object in the managed collection
	 * by id (string/number) or by an object's
	 * property as set in this.settings.identifier
	 * @param {...(number|object|string)} arguments - the object or the id of the object
	 * @returns {*}
	 * @private
	 */
	_get(){
		var arg = arguments[0];
		if(isString(arg) || isNumber(arg))
			return this.objects[arg];
		else
			return this.objects[arg[this.settings.identifier]];
	}

	/**
	 * Adds an object to the collection.
	 * Replaces any existing object
	 * @param {object} obj - the object to add
	 * @param {string} [id] - the id of the object
	 * @returns {*}
	 * @private
	 */
	_add(obj, id) {
		this.trigger('add', obj);
		this.count++;

		if(isDefined(id)) {
			obj[this.settings.identifier] = id;
			return this.objects[id] = obj;
		}
		else
			return this.objects[obj[this.settings.identifier]] = obj;
	}	

	/**
	 * Replaces or adds an object
	 * @param {object} obj - the object to update
	 * @param {string} [id] - the id of the object
	 * @returns {*}
	 * @private
	 */
	_update(obj, id) {
		this.trigger('update', obj);

		if(id)
			return this.objects[id] = obj;
		else
			return this.objects[obj[this.settings.identifier]] = obj;
	}

	/**
	 * Deletes an object from the collection
	 * @param {...(number|object|string)} arguments - the object or the id of the object
	 * @returns {Manager}
	 * @private
	 */
	_delete() {
		var arg = arguments[0];
		// an object id was passed
		if(isString(arg) || isNumber(arg)){
			String(arg);
			if(this.objects[arg])
				delete this.objects[arg];
		}
		// an object was passed
		else if (this.objects[arg[this.settings.id]])
			delete this.objects[arg[this.settings.id]];
		// fail
		else
			return this;

		this.count--;
		this.trigger('delete', arguments[0]);
		return this;
	}

	/**
	 * Deletes all objects from the collection
	 * @returns {Manager}
	 * @private
	 */
	_empty(){
		// in likely case there are references
		for(var i in this.objects){
			delete this.objects[i];
		}
		return this;
	}

	/**
	 * Cache data
	 * @param {*} data
	 * @returns {Manager}
	 * @private
	 */
	_cacheData(data){
		this._cachedData = Object.create(data);
		return this;
	}

	/**
	 * Process all incoming data to manage
	 * @param {object} data
	 * @returns {object}
	 * @private
	 */
	_processData(data){
		return data;
	}

	/**
	 * Get the ids of all objects
	 * @returns {string[]}
	 */
	getIds() {
		var ids = [];
		for(var i in this.objects){
			ids.push(i);
		}
		return ids;
	}

	/**
	 * Get the id of an object
	 * @param {object} obj
	 * @returns {string|undefined}
	 */
	getId(obj){
		return obj[this.settings.identifier];
	}

	/**
	 * Given a collection of objects in an array, 
	 * or in an object, add and update them 
	 * in the manager's own collection.
	 * Then delete any objects still in the manager's
	 * collection that are not in the data
	 * @param {object|object[]} data
	 * @returns {Manager}
	 */
	manage(data) {
		data  = this._processData(data);

		if(!isObject(data) && this.settings.useObjectNames)
			throw new Error("Manager.manage: to use option useObjectNames, object passed to manage() must be an object.");

		var self = this;
		var id = this.settings.identifier;
		// maintain an array of ids found in data
		// then xreference this to see which objects
		// no longer exist (data is the master here)
		var dataIds = [];

		// add or update objects
		for(var i in data){
			var e = data[i];

			if(this.settings.useObjectNames)
				e[id] = i;

			// ids must be defined within objects
			// there is no other way to know if an
			// object is new or old otherwise
			if(!isDefined(e[id]))
				return console.error("Manager.manage: cannot manage objects with no ids");

			// objectIds will always be strings
			var objId = e[id].toString();
			var obj = self.objects[objId];
			if (isDefined(obj))
				self._update(e);
			else
				self._add(e);
			dataIds.push(objId);
		}

		// diff the array of object ids
		// with the array of data ids
		var objectIds = this.getIds();
		var diff = Array.diff(objectIds, dataIds);

		// delete any objects that are
		// no longer found in data
		for (i = 0; i < diff.length; i++) {
			this._delete(diff[i]);
		}

		return this;
	}

	/**
	 * Public method to see if an object exists
	 * @returns {boolean}
	 */
	exists() {
		return this._exists(...arguments);
	}

	/**
	 * Add many objects to the collection
	 * @param {...object} arguments - one or more objects
	 * @returns {Manager}
	 */
	addObjects(){
		var data = arguments.length > 1 ? [].slice.call(arguments).sort() : arguments[0];
		for(var i in data){
			var e = data[i];
			this.addObject(e);
		}
		return this;
	}

	/**
	 * Public method to add an object
	 * @returns {*}
	 */
	addObject() {
		return this._add(...arguments);
	}

	/**
	 * Public method to get an object
	 * @returns {*}
	 */
	getObject(){
		return this._get(...arguments);
	}

	/**
	 * Public method to update an object
	 * @returns {*}
	 */
	updateObject() {
		return this._update(...arguments);
	}

	/**
	 * Public method to delete an object
	 * @returns {*}
	 */
	deleteObject() {
		return this._delete(...arguments);
	}

	/**
	 * Public method to delete all objects
	 * @returns {*}
	 */
	deleteObjects() {
		return this._empty();
	}

	/**
	 * Serialize all objects in some way
	 * @param {number} [index=0] - index to start at
	 * @param {number} [max=0] - max amount to serialize
	 * @returns {object}
	 */
	serializer(index = 0, max = 0){
		var objects = [];
		//var c = 0;
		Util.each(this.objects, function(i, e){
			// if(c >= max)
			// 	return false;
			if(e.toObject)
				objects.push(e.toObject());
			//c++;
		});
		return {
			objects : objects
		};
	}
}