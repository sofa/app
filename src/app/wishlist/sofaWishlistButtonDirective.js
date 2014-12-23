'use strict';

/**
 * This Directive creates a button that adds/removes an item to/from the wishlist
 */

angular
    .module('sofa.wishList')
    .directive('sofaWishListButton', function (wishlistService, localeService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                product: '=',
                selectedVariant: '=?'
            },
            templateUrl: 'wishlist/sofa-wishlist-button.tpl.html',
            link: function (scope, element, attrs) {

                scope.ln = localeService.getTranslation('sofaWishList');

                scope.hasLabel = attrs.labeled;

                scope.isListed = function (key) {
                    return wishlistService.exists(key);
                };

                scope.toggleItem = function () {
                    if (wishlistService.exists(scope.product.urlKey)) {
                        scope.removeFromWishlist();
                    } else {
                        scope.addToWishlist();
                    }
                };

                scope.addToWishlist = function () {
                    wishlistService.addItem(scope.product, 1, scope.selectedVariant || '');
                };

                scope.removeFromWishlist = function () {
                    wishlistService.removeItem(scope.product.urlKey);
                };

            }
        };
    });
