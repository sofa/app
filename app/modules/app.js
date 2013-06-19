'use strict';


var categoryRouteConfig = {
            templateUrl: 'modules/categories/categorylisting.tpl.html',
            controller: 'CategoryController',
            screenIndex: 0,
            resolve: {
                category: ['couchService', '$route', function(couchService, $route){
                    var params = $route.current.params;
                    return couchService.getCategory(params.category);
                }]
            }
        };

// Declare app level module which depends on filters, and services
angular.module('CouchCommerceApp', [
    'ngMobile',
    'sdk.services.couchService',
    'sdk.services.navigationService',
    'sdk.services.basketService',
    'sdk.services.pagesService',
    'sdk.directives',
    'sdk.filter',
    'ui.bootstrap'
    ])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', categoryRouteConfig);
        $routeProvider.when('/cat/:category', categoryRouteConfig);
        $routeProvider.when('/cat/:category/products', {
            templateUrl: 'modules/products/productlisting.tpl.html', 
            controller: 'ProductsController',
            resolve: {
                products: ['couchService', '$route', function(couchService, $route){
                    var params = $route.current.params;
                    return couchService.getProducts(params.category)
                }]
            },
            screenIndex: 1
        });
        $routeProvider.when('/cat/:category/product/:productUrlKey', {
            templateUrl: 'modules/product/product.tpl.html', 
            controller: 'ProductController',
            screenIndex: 2,
            resolve: {
                product: ['couchService', '$route', function(couchService, $route){
                    var params = $route.current.params;
                    return couchService.getProduct(params.category, params.productUrlKey);
                }]
            }
        });

        $routeProvider.when('/cart', {templateUrl: 'modules/cart/cart.tpl.html', controller: 'CartController', screenIndex: 3});

        $routeProvider.when('/pages/:pageId', { templateUrl: 'modules/pages/pages.tpl.html', controller: 'PagesController as pagesVm', screenIndex: -1 });

        $routeProvider.otherwise({redirectTo: '/'});
    }])
    .run(['$rootScope', 'slideDirectionService', function($rootScope, slideDirectionService){
        $rootScope.ln = cc.Lang;
        $rootScope.cfg = cc.Config;
        $rootScope.slideDirectionService = slideDirectionService;
    }]);
