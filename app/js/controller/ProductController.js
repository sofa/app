'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'ProductController',
    [
        '$scope', '$routeParams', '$location', 'couchService',
        function ProductController($scope, $routeParams, $location, couchService) {
            couchService
                .getProduct($routeParams.category, $routeParams.productUrlKey)
                .then(function(product){
                    $scope.product = product;
                });
        }
    ]);
