angular.module('sdk.services.deviceService', []);

angular
    .module('sdk.services.deviceService')
    .factory('deviceService', ['$window', function($window){
        return new cc.DeviceService($window);
}]);


