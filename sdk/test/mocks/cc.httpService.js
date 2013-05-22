cc.define('cc.mocks.httpService', function($q){

    'use strict';

    var mocks;
    
    var self = function(config){
        var deferred = $q.defer();
        deferred.resolve(mocks[config.method][config.url]);
        return deferred.promise;
    };


    self.when = function(method, endpoint){
        return {
            respond: function(data){
                method = method.toLowerCase();
                mocks[method][endpoint] = { data: data };
            }
        };
    };


    /**
     * clear the mocked data so that the service is in it's initial state
     * 
     */
    self.clear = function(){
        mocks = {
            get: {},
            post: {},
            put: {},
            jsonp: {},
            'delete': {}
        };
    };

    self.clear();

    return self;
});