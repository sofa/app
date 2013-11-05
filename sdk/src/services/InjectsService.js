angular.module('sdk.services.injectsService', ['sdk.services.configService']);

angular
    .module('sdk.services.injectsService')
    .factory('injectsService', ['$location', 'configService', function($location, configService){

        'use strict';

        var self = {};

        var RESOURCE_URL     = configService.get('resourceUrl');

        //we build a map of the injects for faster lookups.
        var injects = configService
                        .get('injects', [])
                        .reduce(function(previous, current){
                            var key = current.url + '_' + current.target;
                            previous[key] = {
                                template: current.template,
                                target: current.target
                            };
                            return previous;
                        }, {});

        var getKey = function(injectionPoint){
            return $location.url() + '_' + injectionPoint;
        };

        self.hasInject = function(injectionPoint){
            return !cc.Util.isUndefined(injects[getKey(injectionPoint)]);
        };

        self.getTemplate = function(injectionPoint){

            if (self.hasInject(injectionPoint)){
                return RESOURCE_URL + injects[getKey(injectionPoint)].template;
            }

            return null;
        };

        return self;
}]);


