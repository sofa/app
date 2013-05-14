angular.module('sdk.services.memoryStorageService', []);

angular
    .module('sdk.services.memoryStorageService')
    .factory('storageService', [function(){
        return new cc.MemoryStorageService();
}]);


