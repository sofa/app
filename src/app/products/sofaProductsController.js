'use strict';

angular
    .module('CouchCommerceApp')
    .controller('ProductsController', function ProductsController($scope, $stateParams, navigationService, backStepHighlightService, products, category, selectionService, categoryTreeViewRemote, productService, titleService) {

        var self = this;

        if (category) {
            categoryTreeViewRemote.setActive(category);
            titleService.setTitleWithSuffix(category.label);
            self.category = category;
        }

        self.products = products;
        self.headline = category && category.label;

        self.sortModel = {
            sortBy: null,
            sortTypes: [
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
            ]
        };

        self.goToProduct = function (product, $event) {
            $event.preventDefault();
            selectionService.select('products_' + $stateParams.category, angular.element($event.currentTarget));
            navigationService.navigateToUrl(product.getOriginFullUrl());
        };

        self.getBasePriceInfo = function (product) {
            return productService.getBasePriceInfo(product);
        };

        self.isHighlighted = function (product) {
            return backStepHighlightService.isHighlighted(product);
        };

    });
