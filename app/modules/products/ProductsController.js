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
        'backStepHighlightService',
        'products',
        function ProductsController(
            $scope,
            $routeParams,
            $location,
            couchService,
            navigationService,
            backStepHighlightService,
            products) {

            $scope.backStepHighlightService = backStepHighlightService;
            $scope.navigationService = navigationService;
            $scope.products = products;
            $scope.categoryUrlId = $routeParams.category;
        }
    ]);
