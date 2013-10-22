cc.define('cc.mocks.httpService', function($q){

    'use strict';

    var mocks,
        requestQueue = [];

    var self = function(config){

        config.method = config.method && config.method.toLowerCase();
        requestQueue.push(config);
        var deferred = $q.defer();


        var responseMock = mocks[config.method][config.url];
        var configData = config.data || config.params;
        if (responseMock === undefined && configData !== undefined){
            var endpointKey = createEndpointKey(config.url, configData);
            responseMock = mocks[config.method][endpointKey];
        }

        if (responseMock && typeof responseMock.responseTime === 'number'){
            setTimeout(function(){
                deferred.resolve({
                    data: responseMock.data
                });
            }, responseMock.responseTime);
        }
        else if (responseMock){
            deferred.resolve({
                    data: responseMock.data
            });
        }

        return deferred.promise;
    };

    self.getLastCallParams = function(){
        return requestQueue.length > 0 ? requestQueue[requestQueue.length - 1] : null;
    };

    self.getRequestQueue = function(){
        return requestQueue;
    };

    self.when = function(method, endpoint, data){

        endpoint = createEndpointKey(endpoint, data);

        return {
            respond: function(data, responseTime){
                method = method.toLowerCase();
                mocks[method][endpoint] = { data: data , responseTime: responseTime};
            }
        };
    };

    var createEndpointKey = function(endpoint, data){
        return data !== undefined ? endpoint + '_' + md5Object(data) : endpoint;
    };

    /**
     * clear the mocked data so that the service is in it's initial state
     * 
     */
    self.clear = function(){
        requestQueue.length = 0;
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