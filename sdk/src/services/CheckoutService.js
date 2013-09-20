angular.module('sdk.services.checkoutService', ['sdk.services.basketService', 'sdk.services.loggingService']);

angular
    .module('sdk.services.checkoutService')
    .factory('checkoutService', ['$http', '$q', 'basketService', 'loggingService', function($http, $q, basketService, loggingService){
        return new cc.CheckoutService($http, $q, basketService, loggingService);
}]);


