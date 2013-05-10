'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'HeaderController',
    [
        '$scope', '$location', 'navigationService', 'couchService', 'basketService',
        function CategoryController($scope, $location, navigationService, couchService, basketService) {

            $scope.basketItemCount = 0;
            $scope.navigationService = navigationService;

            basketService.on('itemAdded', function(service, basketItem){
                $scope.basketItemCount = service.getSummary().quantity;
            });
        }
    ]);
