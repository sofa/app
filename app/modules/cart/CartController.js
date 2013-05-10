'use strict'

angular
    .module('CouchCommerceApp')
    .controller('CartController',
    [
        '$scope','basketService',
        function CartController($scope, basketService) {

            $scope.basketService = basketService;

        }
    ]);
