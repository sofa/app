angular.module('sdk.services.configService', []);

angular
    .module('sdk.services.configService')
    .factory('configService', [function(){
        return new cc.ConfigService();
}]);


