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

            var updateModels = function(){
                $scope.summary = basketService.getSummary();
                $scope.items = basketService.getItems();
            };

            updateModels();

            basketService
                .on('cleared', updateModels)
                .on('itemAdded', updateModels)
                .on('itemRemoved', updateModels);

        }
    ]);
