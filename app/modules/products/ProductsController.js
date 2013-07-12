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

            $scope.goToProduct = function(product, $event){
                //this doesn't feel right. Can't we have a tap-highlight directive that
                //hooks into the ng-click somehow?
                angular.element($event.currentTarget).addClass('cc-static-highlight');
                navigationService.navigateToProduct(product);
            };

            $scope.backStepHighlightService = backStepHighlightService;
            $scope.navigationService = navigationService;
            $scope.products = products;
            $scope.categoryUrlId = $routeParams.category;
        }
    ]);
