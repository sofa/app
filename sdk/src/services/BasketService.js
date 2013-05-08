'use strict';

angular.module('sdk.services.basketService', []);

angular
    .module('sdk.services.basketService')
    .factory('basketService', [function(){
        return new cc.BasketService();
}]);


