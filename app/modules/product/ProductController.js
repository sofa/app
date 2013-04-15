'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'ProductController',
    [
        '$scope', '$routeParams', '$location', 'couchService', 'productService', 'product',
        function ProductController($scope, $routeParams, $location, couchService, productService, product) {

            $scope.productService = productService;

            $scope.product = product;

            //guess it would make sense if we had lang on the $routeScope
            $scope.lang = cc.Lang;
        }
    ]);
