angular
    .module('CouchCommerceApp')
    .controller( 'ProductController',
    [
        '$scope', '$location', 'couchService', 'basketService', 'navigationService', 'product', '$dialog',
        function ProductController($scope, $location, couchService, basketService, navigationService, product, $dialog) {

            'use strict';

            $scope.product = product;

            $scope.variants = {
                selectedVariant : null,
                selectedProperties: null
            };

            $scope.onThumbnailSelected = function(product, image){
                product.selectedImage = image;
            };

            //keep that in for debugging variants
            // $scope.product.variants = [

            // {
            //     variantID: 1,
            //     stock: 1,
            //     properties: {
            //         color: 'red',
            //         size: 'XL',
            //         zipside: 'left'
            //     }
            // },
            // {
            //     variantID: 2,
            //     stock: 1,
            //     properties: {
            //         color: 'green',
            //         size: 'XL',
            //         zipside: 'right'
            //     }
            // },
            // {
            //     variantID: 3,
            //     stock: 1,
            //     properties: {
            //         color: 'green',
            //         size: 'L',
            //         zipside: 'left'
            //     }
            // }

            // ];

            var cycleProducts = true;
            $scope.getPrevProduct = function(product) {
                var prev = couchService.getPreviousProduct(product, cycleProducts);
                //console.log('getPrevProduct', prev);
                return prev;
            };

            $scope.getNextProduct = function(product) {
                var next = couchService.getNextProduct(product, cycleProducts);
                //console.log('getNextProduct', next);
                return next;
            };

            //to keep compatibility to our current language file we need to
            //deal with the {tax} marker in the language value and replace it with the
            //products tax.
            $scope.productTaxText = $scope.ln.productTaxText.replace(/{\s*tax\s*}/, $scope.product.tax);

            $scope.addToBasket = function(product){

                if (product.hasVariants() && !$scope.variants.selectedVariant){

                    var missingProperties = '';

                    for (var key in $scope.variants.selectedProperties){
                        if (!$scope.variants.selectedProperties[key]){
                            missingProperties += key + ", ";
                        }
                    }

                    $dialog
                        .messageBox(
                            $scope.ln.btnWarning,
                            cc.Lang.missingVariantAttributeText + missingProperties,
                            [{result: 'ok', label: $scope.ln.btnOk}]
                        )
                        .open();

                    return;
                }

                basketService.addItem(product, 1, $scope.variants.selectedVariant);
                navigationService.navigateToCart();
            };
        }
    ]);
