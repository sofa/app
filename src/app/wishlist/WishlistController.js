'use strict';

angular.module('CouchCommerceApp')
    .controller('WishlistController', function ($scope, $location, storageService, wishlistService, navigationService, urlConstructionService, sidemenuUiState) {

        $scope.isFirstUse        = !(!!storageService.get('wishlist_used'));
        $scope.showFirstUseInfo  = false;
        $scope.navigationService = navigationService;
        $scope.wishlist          = wishlistService.getItems();
        $scope.isEmpty           = wishlistService.isEmpty();

        var openWishlist = function () {
            sidemenuUiState.setActiveTab('wishlist');
            sidemenuUiState.openSidemenu('left');
        };

        var closeWishlist = function () {
            sidemenuUiState.closeSidemenu();
        };

        var updateWishlist = function () {
            $scope.wishlist = wishlistService.getItems();
            $scope.isEmpty  = wishlistService.isEmpty();

            // Automatically show wish list on first use.
            if ($scope.isFirstUse) {
                // Show "where-is-my-wish-list" hint only when the wish list was opened automatically.
                $scope.showFirstUseInfo = true;
                openWishlist();
                var off = $scope.$onRootScope('sidemenuClosed', function () {
                    $scope.isFirstUse       = false;
                    $scope.showFirstUseInfo = false;
                    off();
                });
                storageService.set('wishlist_used', true);
            }
        };

        wishlistService.on('itemsUpdated', updateWishlist);

        $scope.removeItem = function (item) {
            wishlistService.removeItem(item);
        };

        $scope.navigateToProduct = function (product) {
            if ($location.path().indexOf(product.getOriginFullUrl()) > -1) {
                closeWishlist();
            } else {
                navigationService.navigateToUrl(product.getOriginFullUrl());
            }
        };

    });
