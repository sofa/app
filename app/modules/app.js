'use strict';

// Declare app level module which depends on filters, and services
angular.module('CouchCommerceApp', [
    'ngMobile',
    'sdk.services.couchService',
    'sdk.services.navigationService',
    'sdk.services.productService',
    'sdk.services.basketService',
    'sdk.directives',
    'sdk.filter',
    'ui.bootstrap'
    ])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'modules/categories/categorylisting.tpl.html', controller: 'CategoryController'});
        $routeProvider.when('/cart', {templateUrl: 'modules/cart/cart.tpl.html', controller: 'CartController'});
        $routeProvider.when('/cat/:category', {templateUrl: 'modules/categories/categorylisting.tpl.html', controller: 'CategoryController'});
        
        $routeProvider.when('/cat/:category/products', {
            templateUrl: 'modules/products/productlisting.tpl.html', 
            controller: 'ProductsController',
            resolve: {
                products: ['couchService', '$route', function(couchService, $route){
                    var params = $route.current.params;
                    return couchService.getProducts(params.category)
                }]
            }
        });
        
        $routeProvider.when('/cat/:category/product/:productUrlKey', {
            templateUrl: 'modules/product/product.tpl.html', 
            controller: 'ProductController',
            resolve: {
                product: ['couchService', '$route', function(couchService, $route){
                    var params = $route.current.params;
                    return couchService.getProduct(params.category, params.productUrlKey);
                }]
            }
        });
        
        $routeProvider.otherwise({redirectTo: '/'});
    }])
    .run(['$rootScope', function($rootScope){
        $rootScope.ln = cc.Lang;
        $rootScope.cfg = cc.Config;
    }]);
