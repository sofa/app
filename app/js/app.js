'use strict';

// Declare app level module which depends on filters, and services
angular.module('CouchCommerceApp', []).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'views/categorylisting.html', controller: 'CategoryController'});
    $routeProvider.when('/cat/:category', {templateUrl: 'views/categorylisting.html', controller: 'CategoryController'});
    $routeProvider.when('/cat/:category/products', {templateUrl: 'views/productlisting.html', controller: 'ProductsController'});
    $routeProvider.when('/cat/:category/product/:productUrlKey', {templateUrl: 'views/product.html', controller: 'ProductController'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
