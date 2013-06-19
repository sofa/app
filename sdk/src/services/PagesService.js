angular.module('sdk.services.pagesService', []);

angular
    .module('sdk.services.pagesService')
    .factory('pagesService', ['$http', '$q', function($http, $q){
        return new cc.PagesService($http, $q);
}]);


