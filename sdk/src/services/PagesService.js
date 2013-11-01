angular.module('sdk.services.pagesService', ['sdk.services.configService']);

angular
    .module('sdk.services.pagesService')
    .factory('pagesService', ['$http', '$q', 'configService', function($http, $q, configService){
        return new cc.PagesService($http, $q, configService);
}]);


