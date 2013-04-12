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

                    //guess it would make sense if we had lang on the $routeScope
                    $scope.lang = cc.Lang;
                });
        }
    ]);
