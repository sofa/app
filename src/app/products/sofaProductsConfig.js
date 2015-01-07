angular.module('sofa.products')
    .config(function ($stateProvider, screenIndexes) {

        'use strict';

        $stateProvider
            .state('products', {
                params: {
                    category: {}
                },
                templateUrl: 'products/sofa-products-grid.tpl.html',
                controller: 'ProductsController',
                controllerAs: 'productsController',
                resolve: {
                    products: function (couchService, $stateParams) {
                        return couchService.getProducts($stateParams.category);
                    },
                    category: function (couchService, $stateParams) {
                        return couchService.getCategory($stateParams.category);
                    }
                },
                onEnter: function (metaService) {
                    metaService.set({
                        description: ''
                    });
                },
                screenIndex: screenIndexes.products
            })
            .state('oldProducts', {
                url: '/cat/:category/products',
                templateUrl: 'products/sofa-products-grid.tpl.html',
                controller: function (preRenderService, category, $location) {
                    preRenderService.setStatusMetaTag('301');
                    $location.path(category.getOriginFullUrl());
                },
                resolve: {
                    category: function (couchService, $stateParams) {
                        return couchService.getCategory($stateParams.category);
                    }
                }
            });
    });

