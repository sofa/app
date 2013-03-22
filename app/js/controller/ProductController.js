'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'ProductController',
    [
        '$scope', '$routeParams', '$location', 'couchService', 'productService',
        function ProductController($scope, $routeParams, $location, couchService, productService) {
            $scope.productService = productService;

            couchService
                .getProduct($routeParams.category, $routeParams.productUrlKey)
                .then(function(product){
                    $scope.product = product;
                });
        }
    ]);
