'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'ProductController',
    [
        '$scope', '$routeParams', '$location', 'couchService', 'productService', 'basketService', 'product',
        function ProductController($scope, $routeParams, $location, couchService, productService, basketService, product) {

            $scope.ui = {
                PRICE_INFO_AND_ADD_TO_CART: 'modules/product/price-info-and-add-to-cart.tpl.html'
            };

            $scope.productService = productService;

            $scope.product = product;

            //guess it would make sense if we had lang on the $routeScope
            $scope.lang = cc.Lang;

            $scope.addToBasket = function(product){
                basketService.addItem(product, 1);
            };
        }
    ]);
