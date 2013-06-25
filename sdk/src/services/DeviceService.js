angular.module('sdk.services.deviceService', []);

angular
    .module('sdk.services.deviceService')
    .factory('deviceService', [function(){
        return new cc.DeviceService();
}]);


