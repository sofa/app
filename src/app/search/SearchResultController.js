'use strict';

angular.module('CouchCommerceApp').controller('SearchResultController', function ($scope, searchService, searchUiState, navigationService, stateResolverService, configService) {

    var vm = this;

    var useShopUrls = configService.get('useShopUrls', false);

    vm.searchUiState = searchUiState;
    vm.navigationService = navigationService;

    vm.createGroupText = function (grouping) {
        return grouping.items.length === 1 ?
            '1 ' + $scope.ln.searchProductFoundIn + ' ' + grouping.groupText :
            grouping.items.length + ' ' + $scope.ln.searchProductsFoundIn + ' ' + grouping.groupText;
    };

    vm.goToCategory = function (result) {
        searchUiState.closeSearch();
        var groupUrl = useShopUrls ? result.groupOriginFullUrl : result.groupKey;
        navigationService.navigateToUrl(groupUrl);
    };

    vm.goToProduct = function (item) {
        searchUiState.closeSearch();
        var productUrl = useShopUrls ? item.productOriginFullUrl : item.productUrlKey;
        stateResolverService.registerState({
            url: productUrl,
            stateName: 'product',
            stateParams: {
                category: item.categoryUrlKey,
                productUrlKey: item.productUrlKey
            }
        });

        navigationService.navigateToUrl(productUrl);
    };
});
