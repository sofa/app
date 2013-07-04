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
    'ngRoute',
    'sdk.services.couchService',
    'sdk.services.navigationService',
    'sdk.services.basketService',
    'sdk.services.pagesService',
    'sdk.services.deviceService',
    'sdk.directives',
    'sdk.filter',
    'ui.bootstrap',
    'templates'
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
    .run(['$rootScope', '$timeout', '$window', 'slideDirectionService', 'deviceService', function($rootScope, $timeout, $window, slideDirectionService, deviceService){
        $rootScope.ln = cc.Lang;
        $rootScope.cfg = cc.Config;
        $rootScope.slideDirectionService = slideDirectionService;

        $rootScope.supportsFixed = deviceService.hasPositionFixedSupport();

        $rootScope.$on('$routeChangeSuccess', function(evt, toRoute, fromRoute){

            //we not only need that to reset the scrolling position but also because
            //otherwise in Chrome for Android the scrolling is freezed after full page
            //reload. It can be unfreezed by navigating somewhere else or through this hack. Weird!
            $timeout(function(){
                $window.scrollTo(0,1);
            },0);

        });
    }]);
