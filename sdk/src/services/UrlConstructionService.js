angular.module('sdk.services.urlConstructionService', [
        'sdk.services.configService'
    ]);

angular
    .module('sdk.services.urlConstructionService')
    .factory('urlConstructionService', ['configService', function(configService){
        return new cc.UrlConstructionService(configService);
}]);


