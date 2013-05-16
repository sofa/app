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

            //to keep compatibility to our current language file we need to
            //deal with the {tax} marker in the language value and replage it with the
            //products tax.
            $scope.productTaxText = $scope.ln.productTaxText.replace(/{\s*tax\s*}/, $scope.product.tax);

            $scope.addToBasket = function(product){
                basketService.addItem(product, 1);
                navigationService.navigateToCart();
            };
        }
    ]);
