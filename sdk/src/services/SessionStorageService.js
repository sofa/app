angular.module('sdk.services.sessionStorageService', []);

angular
    .module('sdk.services.sessionStorageService')
    .factory('storageService', [function(){
        return new cc.SessionStorageService();
}]);


