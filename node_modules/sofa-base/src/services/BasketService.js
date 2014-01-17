angular.module('sdk.services.basketService', [
        // TODO: Investigate. I'm not sold this should be handled on this level. 
        store.enabled ? 'sdk.services.localStorageService' : 'sdk.services.memoryStorageService',
        'sdk.services.configService'
    ]);

angular
    .module('sdk.services.basketService')
    .factory('basketService', ['storageService', 'configService', function(storageService, configService){
        return new cc.BasketService(storageService, configService);
}]);


