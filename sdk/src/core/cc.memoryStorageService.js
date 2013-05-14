cc.define('cc.MemoryStorageService', function(){
    
    var _storage = {};

    var set = function(id, data){
        _storage[id] = data;
    };

    var get = function(id){
        return _storage[id];
    };

    var remove = function(id){
        delete _storage[id];
    };

    return {
        set: set,
        get: get,
        remove: remove
    };
});