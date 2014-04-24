'use strict';

angular.module('CouchCommerceApp')
    .controller('WishlistController', function ($scope, $location, wishlistService, navigationService, urlConstructionService, snapRemote) {

        $scope.navigationService = navigationService;

        $scope.wishlist = wishlistService.getItems();

        $scope.isEmpty = wishlistService.isEmpty();

        var updateWishlist = function () {
            $scope.wishlist = wishlistService.getItems();
            $scope.isEmpty = wishlistService.isEmpty();
        };

        var closeSidemenu = function () {
            snapRemote.close();
        };

        updateWishlist();
        wishlistService.on('itemsUpdated', updateWishlist);

        $scope.removeItem = function (item) {
            wishlistService.removeItem(item);
        };

        $scope.navigateToProduct = function (product) {
            if (urlConstructionService.createUrlForProduct(product) === $location.$$path) {
                closeSidemenu();
            } else {
                navigationService.navigateToProduct(product);
            }
        };

    });
