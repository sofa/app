'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'ProductsController',
    [
        '$scope', 
        '$routeParams', 
        '$location', 
        'couchService',
        'navigationService',
        'products',
        function ProductsController(
            $scope, 
            $routeParams, 
            $location, 
            couchService,
            navigationService,
            products) {

            $scope.navigationService = navigationService;
            $scope.products = products;
            $scope.categoryUrlId = $routeParams.category;
        }
    ]);
