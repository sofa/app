angular.module('sofa.category')
    .config(function ($stateProvider, screenIndexes) {

        'use strict';

        var categoryStateConfig = {
            templateUrl: function () {
                // TODO: how to make sure the deviceService is available?
                return cc.deviceService.isTabletSize() ? 'category/sofa-category-grid.tpl.html' : 'category/sofa-category-list.tpl.html';
            },
            controller: 'CategoryController',
            controllerAs: 'categoryController',
            screenIndex: screenIndexes.category,
            resolve: {
                category: [
                    'couchService', '$stateParams', 'navigationService', '$q', '$state',
                    function (couchService, $stateParams, navigationService, $q, $state) {

                        return couchService
                            .getCategory($stateParams.category)
                            .then(function (category) {
                                //we need to make that check here *before* the CategoryController
                                //is initialized. Otherwise we will have double transitions in such
                                //cases.
                                if (category && (!category.children || !category.children.length)) {
                                    // the server side states API does not differentiate between `category` and `products` state. It
                                    // always returns `category` states. It's currently easier for us to just redirect on the client side
                                    $state.transitionTo('products', { category: category.id }, { location: false });
                                    return $q.reject();
                                }
                                return category;
                            });
                    }
                ]
            },
            onEnter: [
                'metaService', 'category', function (metaService, category) {
                    if (category.isRoot) {
                        metaService.reset();
                    } else {
                        metaService.set({
                            description: ''
                        });
                    }
                }
            ]
        };

        $stateProvider
            .state('categoryempty', categoryStateConfig)
            .state('rootcategory', angular.extend({}, categoryStateConfig, {
                url: '/'
            }))
            .state('categories', angular.extend({}, categoryStateConfig, {
                params: {
                    category: {}
                }
            }))
            // Fallback for old API
            .state('oldCategories', angular.extend({}, categoryStateConfig, {
                url: '/cat/:category',
                resolve: {
                    category: function (couchService, $stateParams) {
                        return couchService.getCategory($stateParams.category);
                    }
                },
                controller: function (preRenderService, $location, category) {
                    preRenderService.setStatusMetaTag('301');
                    $location.path(category.getOriginFullUrl());
                }
            }));
    });
