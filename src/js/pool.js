/*!
 * pool
 * https://github.com/Voliware/Util
 * Licensed under the MIT license.
 */

/**
 * Generic object pool for
 * limiting memory usage
 */
class Pool {

	/**
	 * Constructor
	 * @param {*} object - object to alloc in the pool
	 * @returns {Pool}
	 */
	constructor(object) {
		this.object = object;

		this.totalAlloc = 0;
		this.totalFree = 0;
		this.pool = [];
		return this;
	}

	/**
	 * Clear pool totalAlloc and totalFree
	 * @returns {Pool}
	 * @private
	 */
	_clearStats() {
		var inUse = this.totalAlloc - this.totalFree;
		this.totalAlloc = inUse || 0;
		this.totalFree = 0;
		return this;
	}

	/**
	 * Allocate space in the pool
	 * @returns {*}
	 */
	alloc() {
		var obj;
		if (this.pool.length === 0) {
			obj = new this.object;
			this.totalAlloc++;
		} else {
			obj = this.pool.pop();
			this.totalFree--;
		}
		return obj;
	}

	/**
	 * Free space in the pool by
	 * returning an object to it
	 * @param {*} obj
	 * @returns {Pool}
	 */
	free(obj) {
		this.pool.push(obj);
		this.totalFree++;
		return this;
	}

	/**
	 * Collect all objects in the pool
	 * and clear current stats
	 * @returns {Pool}
	 */
	collect() {
		this.pool = [];
		this._clearStats();
		return this;
	}
}