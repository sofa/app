angular.module('sdk.services.localStorageService', []);

angular
    .module('sdk.services.localStorageService')
    .factory('storageService', [function(){
        return new cc.LocalStorageService();
}]);


