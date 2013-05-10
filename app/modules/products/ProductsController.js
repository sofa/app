'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'ProductsController',
    [
        '$scope', 
        '$routeParams', 
        '$location', 
        'couchService',
        'productService',
        'navigationService',
        'products',
        function ProductsController(
            $scope, 
            $routeParams, 
            $location, 
            couchService,
            productService,
            navigationService,
            products) {
            
            $scope.productService = productService;
            $scope.navigationService = navigationService;
            $scope.products = products;
            $scope.categoryUrlId = $routeParams.category;
        }
    ]);
