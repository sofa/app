'use strict'

angular
    .module('CouchCommerceApp')
    .controller('CartController',
    [
        '$scope','basketService', 'productService', 'navigationService',
        function CartController($scope, basketService, productService, navigationService) {

            $scope.basketService = basketService;
            $scope.productService = productService;
            $scope.navigationService = navigationService;

        }
    ]);
