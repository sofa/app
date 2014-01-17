angular.module('sdk.services.urlParserService', []);

angular
    .module('sdk.services.urlParserService')
    .factory('urlParserService', ['$location', function($location){
        return new cc.UrlParserService($location);
}]);


