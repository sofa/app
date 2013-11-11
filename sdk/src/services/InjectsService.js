angular.module('sdk.services.injectsService', ['sdk.services.configService']);

angular
    .module('sdk.services.injectsService')
    .factory('injectsService', ['$location', 'configService', function($location, configService){

        'use strict';

        var self = {};

        var RESOURCE_URL     = configService.get('resourceUrl') + 'html/';

        //we build a map of the injects for faster lookups.
        var injects = configService
                        .get('injects', [])
                        .reduce(function(previous, current){
                            var key = current.url + '_' + current.target;
                            previous[key] = {
                                template: current.template + '.html',
                                target: current.target
                            };
                            return previous;
                        }, {});

        var getKey = function(injectionPoint, url){
            return assureUrl(url) + '_' + injectionPoint;
        };

        var assureUrl = function(url){
            return url || $location.url();
        };

        self.hasInject = function(injectionPoint, url){
            return !cc.Util.isUndefined(injects[getKey(injectionPoint, url)]);
        };

        self.getTemplate = function(injectionPoint){

            if (self.hasInject(injectionPoint)){
                return RESOURCE_URL + injects[getKey(injectionPoint)].template;
            }

            if (self.hasInject(injectionPoint, '*')){
                return RESOURCE_URL + injects[getKey(injectionPoint, '*')].template;
            }

            return null;
        };

        return self;
}]);


