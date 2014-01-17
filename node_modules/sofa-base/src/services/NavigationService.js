angular.module('sdk.services.navigationService', [
        'sdk.services.navigationService',
        'sdk.services.couchService',
        'sdk.services.trackingService',
        'sdk.services.urlConstructionService',
        'sdk.services.urlParserService'
    ]);

angular
    .module('sdk.services.navigationService')
    .factory('navigationService', ['$location', '$window', 'couchService', 'trackingService', 'urlConstructionService', 'urlParserService',
        function($location, $window, couchService, trackingService, urlConstructionService, urlParserService){

        'use strict';

        var self = {};

        var navigateToUrl = function(url) {
            trackingService.trackEvent({
                category: 'pageView',
                label: url
            });
            $location.path(url);
        };

        self.navigateToProducts = function(categoryUrlId){
            navigateToUrl(urlConstructionService.createUrlForProducts(categoryUrlId));
        };

        self.navigateToProduct = function(product){
            navigateToUrl(urlConstructionService.createUrlForProduct(product));
        };

        self.navigateToCategory = function(categoryUrlId){
            navigateToUrl(urlConstructionService.createUrlForCategory(categoryUrlId));
        };

        self.navigateToRootCategory = function(){
            navigateToUrl(urlConstructionService.createUrlForRootCategory());
        };

        self.navigateToCart = function(){
            navigateToUrl(urlConstructionService.createUrlForCart());
        };

        self.navigateToCheckout = function(){
            navigateToUrl(urlConstructionService.createUrlForCheckout());
        };

        self.navigateToSummary = function(token){
            $location.path(urlConstructionService.createUrlForSummary(token));
            trackingService.trackEvent({
                category: 'pageView',
                // No token here as it would flood the analytics
                label: "/summary"
            });
        };

        self.navigateToShippingCostsPage = function(){
            navigateToUrl(urlConstructionService.createUrlForShippingCostsPage());
        };

        var navigateToParentCategory = function(){
            var currentCategoryUrlId = urlParserService.getCategoryUrlId();
            couchService.getCategory(currentCategoryUrlId)
                .then(function(category){
                    if (category.parent && category.parent.parent){
                        self.navigateToCategory(category.parent.urlId);
                    }
                    else{
                        self.navigateToRootCategory();
                    }
                });
        };

        self.goUp = function(){
            var currentCategoryUrlId,
                currentCategory;

            if(urlParserService.isView('product')){
                currentCategoryUrlId = urlParserService.getCategoryUrlId();
                self.navigateToProducts(currentCategoryUrlId);
            }
            else if (urlParserService.isView('products')){
                navigateToParentCategory();
            }
            else if(urlParserService.isView('categories')){
                navigateToParentCategory();
            }
            else{
                //TODO: The method is actually designed to go up in the tree
                //structure of a category/product tree. However, this is as a
                //here as a fallback so that e.g. when the user is on the
                //shopping cart the back button works as a history back.
                //We should overthink our whole approach here. And almost
                //cetainly we should move the whole service out of the SDK
                //as it's not generic enough to be useful for others.
                $window.history.back();
            }

        };

        trackingService.trackEvent({
            category: 'pageView',
            label: $location.path()
        });

        return self;
}]);


