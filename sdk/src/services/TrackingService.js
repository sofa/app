angular.module('sdk.services.trackingService', []);

angular
    .module('sdk.services.trackingService')
    .factory('trackingService', ['$window', '$http', function($window, $http){
        return new cc.TrackingService($window, $http);
}]);