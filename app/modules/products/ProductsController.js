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
        'products',
        function ProductsController(
            $scope, 
            $routeParams, 
            $location, 
            couchService,
            productService,
            products) {
            
            $scope.productService = productService;

            $scope.goToProduct = function(product){
                $location.path('cat/' + $scope.categoryUrlId + '/product/' + product.urlKey);
            };

            $scope.products = products;
            $scope.categoryUrlId = $routeParams.category;
        }
    ]);
