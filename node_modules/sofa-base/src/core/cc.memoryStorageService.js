/**
 * @name MemoryStorageService
 * @namespace cc.MemoryStorageService
 *
 * @description
 * Simple memory storage service. Provides methods to get and set values in form
 * of simple key - value pairs.
 */
cc.define('cc.MemoryStorageService', function(){
    
    var _storage = {};

    /**
     * @method set
     * @memberof cc.MemoryStorageService
     *
     * @description
     * Sets a value by a given id.
     *
     * @param {string} id Identifier
     * @param {object} data Any kind of data to store under given id.
     */
    var set = function(id, data){
        _storage[id] = data;
    };

    /**
     * @method get
     * @memberof cc.MemoryStorageService
     *
     * @description
     * Gets a value by a given id.
     *
     * @param {string} id Identifier
     *
     * @return {object} Stored data.
     */
    var get = function(id){
        return _storage[id];
    };

    /**
     * @method remove
     * @memberof cc.MemoryStorageService
     *
     * @description
     * Removes a value by a given id.
     *
     * @param {string} id Identifier
     */
    var remove = function(id){
        delete _storage[id];
    };

    return {
        set: set,
        get: get,
        remove: remove
    };
});
