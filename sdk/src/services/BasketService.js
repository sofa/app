angular.module('sdk.services.basketService', [
        // TODO: Investigate. I'm not sold this should be handled on this level. 
        store.enabled ? 'sdk.services.sessionStorageService' : 'sdk.services.memoryStorageService'
    ]);

angular
    .module('sdk.services.basketService')
    .factory('basketService', ['storageService', function(storageService){
        return new cc.BasketService(storageService);
}]);


