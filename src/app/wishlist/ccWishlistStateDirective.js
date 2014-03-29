'use strict';

/**
 *  Adding wish list's state to elements outside of wishlistController (e.g., side menu navigation icon).
 */

angular.module('CouchCommerceApp')
    .directive('ccWishlistState', function (wishlistService) {
        return {
            link: function ($scope) {

                var updateState = function () {
                    $scope.isEmpty = wishlistService.isEmpty();
                };

                $scope.isEmpty = wishlistService.isEmpty();

                wishlistService.on('itemsUpdated', updateState);

                $scope.$on('$destroy', function () {
                    wishlistService.off('itemsUpdated', updateState);
                });

            }
        };
    });
