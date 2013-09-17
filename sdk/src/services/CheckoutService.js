angular.module('sdk.services.checkoutService', ['sdk.services.basketService']);

angular
    .module('sdk.services.checkoutService')
    .factory('checkoutService', ['$http', '$q', 'basketService', function($http, $q, basketService){
        return new cc.CheckoutService($http, $q, basketService);
}]);


