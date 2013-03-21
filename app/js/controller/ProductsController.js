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
        function ProductsController(
            $scope, 
            $routeParams, 
            $location, 
            couchService,
            productService) {
            
            $scope.productService = productService;

            $scope.goToProduct = function(product){
                $location.path('cat/' + $scope.categoryUrlId + '/product/' + product.id);
            };

            couchService
                .getProducts($routeParams.category)
                .then(function(data) {
                    $scope.products = data;
                    $scope.categoryUrlId = $routeParams.category;
                });
        }
    ]);
