'use strict';

angular
    .module('CouchCommerceApp')
    .controller('HeaderController', function ($rootScope, $scope, basketService, snapRemote) {

            $scope.basketItemCount = 0;

            var updateBasketItemCount = function () {
                $scope.basketItemCount = basketService.getSummary().quantity;
            };

            updateBasketItemCount();

            basketService
                .on('itemAdded', updateBasketItemCount)
                .on('itemRemoved', updateBasketItemCount)
                .on('cleared', updateBasketItemCount);

            $scope.snapCart = function () {
                snapRemote.toggle('right');
            };

            $scope.showSearch = function () {
                $rootScope.$emit('header.searchButtonClicked');
            };
        }
    );
