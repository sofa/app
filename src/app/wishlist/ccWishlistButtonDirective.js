'use strict';

/**
 * This Directive creates a button that adds/removes an item to/from the wishlist
 */

angular.module('CouchCommerceApp')
    .directive('ccWishlistButton', function (wishlistService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                product: '=',
                buttonTextAdd: '=?',
                buttonTextRemove: '=?',
                selectedVariant: '=?'
            },
            templateUrl: 'wishlist/cc-wishlist-button.tpl.html',
            link: function ($scope) {

                $scope.wishlistService = wishlistService;

                $scope.toggleItem = function () {
                    if (wishlistService.exists($scope.product.urlKey)) {
                        $scope.removeFromWishlist();
                    } else {
                        $scope.addToWishlist();
                    }
                };

                $scope.addToWishlist = function () {
                    wishlistService.addItem($scope.product, 1, $scope.selectedVariant || '');
                };

                $scope.removeFromWishlist = function () {
                    wishlistService.removeItem($scope.product.urlKey);
                };

            }
        };
    });
