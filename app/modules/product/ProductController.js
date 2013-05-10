'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'ProductController',
    [
        '$scope', '$routeParams', '$location', 'couchService', 'productService', 'basketService', 'navigationService', 'product',
        function ProductController($scope, $routeParams, $location, couchService, productService, basketService, navigationService, product) {

            $scope.ui = {
                PRICE_INFO_AND_ADD_TO_CART: 'modules/product/price-info-and-add-to-cart.tpl.html'
            };

            $scope.productService = productService;

            $scope.product = product;

            $scope.addToBasket = function(product){
                basketService.addItem(product, 1);
                navigationService.navigateToCart();
            };
        }
    ]);
