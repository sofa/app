'use strict';

angular
    .module('CouchCommerceApp')
    .controller('SearchResultController', function (searchUiState, navigationService, stateResolverService, configService) {

        var highlightSearchPhrase = function (text, phrase) {
            var highlightedText = text;
            var regex;

            if (phrase.length > 2) {
                regex = new RegExp('(' + phrase + ')', 'i');
                highlightedText = text.replace(regex, '<b>$1</b>');
            }

            return highlightedText;
        };

        var vm = this;

        var useShopUrls = configService.get('useShopUrls', false);

        vm.searchUiState = searchUiState;
        vm.navigationService = navigationService;

        vm.createGroupText = function (grouping) {
            return grouping.groupText;
        };

        vm.getItemText = function (text) {
            var html = highlightSearchPhrase(text, searchUiState.searchTerm);
            return html;
        };

        vm.getItemCount = function (grouping) {
            return grouping.items.length;
        };

        vm.closeOnClick = function () {
            if (!searchUiState.hasResults() || searchUiState.isRunningSearch) {
                searchUiState.abort();
            }
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
