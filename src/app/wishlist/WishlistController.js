'use strict';

angular.module('CouchCommerceApp')
    .controller('WishlistController', function ($scope, wishlistService, navigationService) {

        $scope.navigationService = navigationService;

        $scope.wishlist = wishlistService.getItems();

        $scope.isEmpty = wishlistService.isEmpty();

        var updateWishlist = function () {
            $scope.wishlist = wishlistService.getItems();
            $scope.isEmpty = wishlistService.isEmpty();
        };

        updateWishlist();
        wishlistService.on('itemsUpdated', updateWishlist);

        $scope.removeItem = function (item) {
            wishlistService.removeItem(item);
        };

    });
