'use strict';

angular.module('CouchCommerceApp')
.controller('ProductsController', function ($scope, $stateParams, $location, couchService, navigationService, backStepHighlightService, products, category, selectionService, categoryTreeViewRemote, productService, titleService) {

    //we want to set the active category in the side menu.
    if (category) {
        categoryTreeViewRemote.setActive(category);
        $scope.category = category;
    }

    $scope.goToProduct = function (product, $event) {
        $event.preventDefault();
        selectionService.select('products_' + $stateParams.category, angular.element($event.currentTarget));
        navigationService.navigateToUrl(product.getOriginFullUrl());
    };

    var sortModel = $scope.sortModel = {};
    sortModel.sortBy = null;
    sortModel.sortTypes = [
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

    $scope.productService = productService;
    $scope.backStepHighlightService = backStepHighlightService;
    $scope.navigationService = navigationService;
    $scope.products = products;
    $scope.categoryUrlId = $stateParams.category;
    $scope.headline = category && category.label;

    titleService.setTitleWithSuffix(category.label);
});
