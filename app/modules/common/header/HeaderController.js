'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'HeaderController',
    [
        '$scope', '$location', 'navigationService', 'couchService', 'basketService',
        function CategoryController($scope, $location, navigationService, couchService, basketService) {

            $scope.basketItemCount = 0;

            basketService.on('itemAdded', function(service, basketItem){
                $scope.basketItemCount = service.getSummary().quantity;
            });

            $scope.goBack = function(){
                navigationService.goUp();
            };

            $scope.goToRoot = function(){
                navigationService.navigateToRootCategory();
            };
        }
    ]);
