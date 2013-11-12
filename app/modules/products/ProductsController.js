

angular
    .module('CouchCommerceApp')
    .controller( 'ProductsController',
    [
        '$scope',
        '$stateParams',
        '$location',
        'couchService',
        'navigationService',
        'backStepHighlightService',
        'products',
        'category',
        'selectionService',
        function ProductsController(
            $scope,
            $stateParams,
            $location,
            couchService,
            navigationService,
            backStepHighlightService,
            products,
            category,
            selectionService) {

            'use strict';

            $scope.goToProduct = function(product, $event){
                selectionService.select('products_' + $stateParams.category, angular.element($event.currentTarget));
                navigationService.navigateToProduct(product);
            };

            $scope.backStepHighlightService = backStepHighlightService;
            $scope.navigationService = navigationService;
            $scope.products = products;
            $scope.categoryUrlId = $stateParams.category;
            $scope.headline = category && category.label;
        }
    ]);
