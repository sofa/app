

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
        'categoryTreeViewRemote',
        function ProductsController(
            $scope,
            $stateParams,
            $location,
            couchService,
            navigationService,
            backStepHighlightService,
            products,
            category,
            selectionService,
            categoryTreeViewRemote) {

            'use strict';

            //we want to set the active category in the side menu.
            if (category){
                categoryTreeViewRemote.setActive(category);
            }

            $scope.goToProduct = function(product, $event){
                selectionService.select('products_' + $stateParams.category, angular.element($event.currentTarget));
                navigationService.navigateToProduct(product);
            };

            var sortModel = $scope.sortModel = {};
            sortModel.sortBy = null;
            sortModel.sortTypes =   [
                                        {
                                            title: $scope.ln.sortPriceAsc,
                                            key: 'price',
                                            reverse: false
                                        },
                                        {
                                            title: $scope.ln.sortPriceDesc,
                                            key: 'price',
                                            reverse: true
                                        }
                                    ];


            $scope.backStepHighlightService = backStepHighlightService;
            $scope.navigationService = navigationService;
            $scope.products = products;
            $scope.categoryUrlId = $stateParams.category;
            $scope.headline = category && category.label;
        }
    ]);
