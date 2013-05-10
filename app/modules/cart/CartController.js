'use strict'

angular
    .module('CouchCommerceApp')
    .controller('CartController',
    [
        '$scope','basketService', 'productService',
        function CartController($scope, basketService, productService) {

            $scope.basketService = basketService;
            $scope.productService = productService;

        }
    ]);
