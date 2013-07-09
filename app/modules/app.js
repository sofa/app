'use strict';

var categoryStateConfig = {
                url: '/',
                templateUrl: 'modules/categories/categorylisting.tpl.html',
                controller: 'CategoryController',
                screenIndex: 0,
                resolve: {
                    category: ['couchService', '$stateParams', function(couchService, $stateParams){
                        return couchService.getCategory($stateParams.category);
                    }]
                }
            };

// Declare app level module which depends on filters, and services
angular.module('CouchCommerceApp', [
    'ngMobile',
    'ui.state',
    'sdk.services.couchService',
    'sdk.services.navigationService',
    'sdk.services.basketService',
    'sdk.services.pagesService',
    'sdk.services.deviceService',
    'sdk.directives',
    'sdk.filter',
    'ui.bootstrap',
    'angular-carousel',
    'templates'
    ])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        $stateProvider
            .state('categoryempty', categoryStateConfig);

        $stateProvider
            .state('category', angular.extend({}, categoryStateConfig, { url: '/cat/:category' }));

        $stateProvider
            .state('products', {
                url: '/cat/:category/products',
                templateUrl: 'modules/products/productlisting.tpl.html',
                controller: 'ProductsController',
                resolve: {
                    products: ['couchService', '$stateParams', function(couchService, $stateParams){
                        return couchService.getProducts($stateParams.category);
                    }]
                },
                screenIndex: 1
            });

        $stateProvider
            .state('product', {
                url: '/cat/:category/product/:productUrlKey',
                templateUrl: 'modules/product/product.tpl.html',
                controller: 'ProductController',
                resolve: {
                    product: ['couchService', '$stateParams', function(couchService, $stateParams){
                        return couchService.getProduct($stateParams.category, $stateParams.productUrlKey);
                    }]
                },
                screenIndex: 2
            });

        $stateProvider
            .state('cart', {
                url: '/cart',
                templateUrl: 'modules/cart/cart.tpl.html',
                controller: 'CartController',
                screenIndex: 3
            });

        $stateProvider
            .state('pages', {
                url: '/pages/:pageId',
                templateUrl: 'modules/pages/pages.tpl.html',
                controller: 'PagesController as pagesVm',
                screenIndex: -1
            });

        $urlRouterProvider.otherwise('/');
    }])
    .run(['$rootScope', '$timeout', '$window', 'slideDirectionService', 'deviceService', function($rootScope, $timeout, $window, slideDirectionService, deviceService){
        $rootScope.ln = cc.Lang;
        $rootScope.cfg = cc.Config;
        $rootScope.slideDirectionService = slideDirectionService;

        $rootScope.supportsFixed = deviceService.hasPositionFixedSupport();

        $rootScope.$on('$stateChangeSuccess', function(evt, toRoute, fromRoute){

            //we not only need that to reset the scrolling position but also because
            //otherwise in Chrome for Android the scrolling is freezed after full page
            //reload. It can be unfreezed by navigating somewhere else or through this hack. Weird!
            $timeout(function(){
                $window.scrollTo(0,1);
            },0);

        });
    }]);
