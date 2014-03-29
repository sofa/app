'use strict';

angular.module('CouchCommerceApp')
.controller('HeaderController', function ($rootScope, $scope, $location, navigationService, couchService, basketService, urlParserService, deviceService, snapRemote) {

    $scope.basketItemCount = 0;
    $scope.navigationService = navigationService;
    $scope.urlParserService = urlParserService;
    $scope.deviceService = deviceService;
    $scope.snapRemote = snapRemote;

    var updateBasketItemCount = function () {
        $scope.basketItemCount = basketService.getSummary().quantity;
    };

    updateBasketItemCount();

    basketService
        .on('itemAdded', updateBasketItemCount)
        .on('itemRemoved', updateBasketItemCount)
        .on('cleared', updateBasketItemCount);

    $scope.snapCart = function () {
        snapRemote.toggle('right');
    };

    $scope.showSearch = function () {
        $rootScope.$emit('header.searchButtonClicked');
    };
});
