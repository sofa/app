angular.module('sdk.services.loggingService', ['sdk.services.configService']);

angular
    .module('sdk.services.loggingService')
    .factory('loggingService', ['configService', function(configService){
        return new cc.LoggingService(configService);
}]);


