'use strict';

// Declare app level module which depends on filters, and services
angular.module('CouchCommerceApp', [
    'sdk.services.couchService',
    'sdk.services.navigationService',
    'sdk.services.productService',
    'sdk.directives'
    ]).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'modules/categories/categorylisting.html', controller: 'CategoryController'});
    $routeProvider.when('/cat/:category', {templateUrl: 'modules/categories/categorylisting.html', controller: 'CategoryController'});
    $routeProvider.when('/cat/:category/products', {templateUrl: 'modules/products/productlisting.html', controller: 'ProductsController'});
    
    $routeProvider.when('/cat/:category/product/:productUrlKey', {
        templateUrl: 'modules/product/product.html', 
        controller: 'ProductController',
        resolve: {
            product: ['couchService', '$route', function(couchService, $route){
                var params = $route.current.params;
                return couchService.getProduct(params.category, params.productUrlKey);
            }]
        }
    });
    
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
