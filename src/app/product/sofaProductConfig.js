angular.module('sofa.product')
    .config(function ($stateProvider, screenIndexes) {

        'use strict';

        $stateProvider
            .state('product', {
                params: {
                    category: {},
                    productUrlKey: ''
                },
                templateUrl: function () {
                    return cc.deviceService.isTabletSize() ? 'product/sofa-product-wide.tpl.html' : 'product/sofa-product.tpl.html';
                },
                controller: 'ProductController',
                controllerAs: 'productController',
                resolve: {
                    product: ['couchService', '$stateParams', function (couchService, $stateParams) {
                        return couchService.getProduct($stateParams.productUrlKey);
                    }],
                    category: ['couchService', '$stateParams', function (couchService, $stateParams) {
                        return couchService
                            .getCategory($stateParams.category)
                            .then(function (category) {
                                return category;
                            });
                    }]
                },
                onEnter: function (product, metaService) {
                    if (product) {
                        metaService.set({
                            description: product.description
                        });
                    }
                },
                screenIndex: screenIndexes.product
            })
            .state('oldProduct', {
                url: '/cat/:category/product/:productUrlKey',
                templateUrl: function () {
                    return cc.deviceService.isTabletSize() ? 'product/cc-product-wide.tpl.html' : 'product/cc-product.tpl.html';
                },
                controller: function (preRenderService, product, $location) {
                    preRenderService.setStatusMetaTag('301');
                    $location.path(product.getOriginFullUrl());
                },
                resolve: {
                    product: function (couchService, $stateParams) {
                        return couchService.getProduct($stateParams.category, $stateParams.productUrlKey);
                    }
                }
            });

    });
