angular.module('sdk.services.trackingService', []);

angular
    .module('sdk.services.trackingService')
    .factory('trackingService', ['$window', '$http', 'configService', function($window, $http, configService){
        return new cc.TrackingService($window, $http, configService);
}]);