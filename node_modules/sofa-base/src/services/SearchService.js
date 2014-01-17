angular.module('sdk.services.searchService', ['sdk.services.configService']);

angular
    .module('sdk.services.searchService')
    .factory('searchService', ['configService', '$http', '$q', '$rootScope', function(configService, $http, $q, $rootScope){
        
        var applier = function(){
            $rootScope.$apply();
        };

        return new cc.SearchService(configService, $http, $q, applier);
}]);


