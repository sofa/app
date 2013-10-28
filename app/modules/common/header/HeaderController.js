

angular
    .module('CouchCommerceApp')
    .controller( 'HeaderController',
    [
        '$rootScope', '$scope', '$location', 'navigationService', 'couchService', 'basketService',
        function HeaderController($rootScope, $scope, $location, navigationService, couchService, basketService) {

            'use strict';

            $scope.basketItemCount = 0;
            $scope.navigationService = navigationService;

            var updateBasketItemCount = function(){
                $scope.basketItemCount = basketService.getSummary().quantity;
            };

            updateBasketItemCount();

            basketService
                .on('itemAdded', updateBasketItemCount)
                .on('itemRemoved', updateBasketItemCount);

            $scope.showSearch = function(){
                $rootScope.$emit('header.searchButtonClicked');
            };

        }
    ]);
