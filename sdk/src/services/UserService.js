angular.module('sdk.services.userService', [
        // TODO: Investigate. I'm not sold this should be handled on this level. 
        store.enabled ? 'sdk.services.localStorageService' : 'sdk.services.memoryStorageService',
        'sdk.services.configService'
    ]);

angular
    .module('sdk.services.userService')
    .factory('userService', ['storageService', 'configService', function(storageService, configService){
        return new cc.UserService(storageService, configService);
}]);


