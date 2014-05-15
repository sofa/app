'use strict';

angular.module('CouchCommerceApp')
.factory('metaService', ['$rootScope', 'configService', function ($rootScope, configService) {

    var meta = configService.get('meta');

    $rootScope.meta = {
        robots: meta.robots,
        description: meta.description
    };

    return {
        set: function (data) {
            $rootScope.meta = {
                robots: data.robots || meta.robots,
                description: (function () {
                    var description = data.description;
                    if (data.description === '') {
                        return description;
                    }
                    return (data.description || meta.description).replace(/<\/?[^>]+(>|$)/g, '');
                }())
            };
        },
        reset: function () {
            $rootScope.meta = {
                robots: meta.robots,
                description: meta.description
            };
        }
    };
}]);
