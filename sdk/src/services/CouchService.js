angular.module('sdk.services.couchService', ['sdk.services.configService']);

angular
    .module('sdk.services.couchService')
    .factory('couchService', ['$http', '$q', 'configService', function($http, $q, configService){
        return new cc.CouchService($http, $q, configService);
}]);


