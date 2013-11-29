angular.module('sdk.services.navigationService', [
        'sdk.services.navigationService',
        'sdk.services.couchService',
        'sdk.services.trackingService'
    ]);

angular
    .module('sdk.services.navigationService')
    .factory('navigationService', ['$location', '$window', 'configService', 'couchService', 'trackingService',
        function($location, $window, configService, couchService, trackingService){

        'use strict';

        var self = {};

        var views = {
            product: /\/cat\/.*\/product\//i,
            products: /\/cat\/.*\/products/i,
            categories: /\/cat\/[^/]+$/i
        };

        var utilityRegex = {
            urlBeforeCategory: /.*cat\//,
            urlRightFromSlash: /\/.*/
        };

        self.isView = function(viewName){
            var regex = views[viewName];

            if(!regex){
                throw new Error(viewName + "unknown");
            }

            return regex.test($location.path());
        };

        var navigateToUrl = function(url) {
            trackingService.trackEvent({
                category: 'pageView',
                label: url
            });
            $location.path(url);
        };

        self.navigateToProducts = function(categoryUrlId){
            navigateToUrl('/cat/' + categoryUrlId + '/products');
        };

        self.navigateToProduct = function(product){
            navigateToUrl('/cat/' + product.categoryUrlId + '/product/' + product.urlKey);
        };

        self.navigateToCategory = function(categoryUrlId){
            navigateToUrl('/cat/' + categoryUrlId);
        };

        self.navigateToRootCategory = function(){
            navigateToUrl('');
        };

        self.navigateToCart = function(){
            navigateToUrl('/cart');
        };

        self.navigateToCheckout = function(){
            navigateToUrl('/checkout');
        };

        self.navigateToSummary = function(token){
            $location.path('/summary/' + token);
            trackingService.trackEvent({
                category: 'pageView',
                // No token here as it would flood the analytics
                label: "/summary"
            });
        };

        self.navigateToShippingCostsPage = function(){
            navigateToUrl('/pages/' + configService.get('linkShippingCosts', ''));
        };

        self.getCategoryUrlId = function(){
            return $location.path()
                .replace(utilityRegex.urlBeforeCategory,'')
                .replace(utilityRegex.urlRightFromSlash, '');
        };

        self.isRootCategory = function(){
            var path = $location.path();
            return path === '/' || path === '/cat/' ;
        };

        self.goUp = function(){
            var currentCategoryUrlId,
                currentCategory;

            if(self.isView('product')){
                currentCategoryUrlId = self.getCategoryUrlId();
                self.navigateToProducts(currentCategoryUrlId);
            }
            else if (self.isView('products')){
                currentCategoryUrlId = self.getCategoryUrlId();
                couchService.getCategory(currentCategoryUrlId)
                    .then(function(category){
                        navigateToParentCategory(category);
                    });
            }
            else if(self.isView('categories')){
                currentCategory = couchService.getCurrentCategory();
                navigateToParentCategory(currentCategory);
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

        var navigateToParentCategory = function(category){
            if (category.parent && category.parent.parent){
                self.navigateToCategory(category.parent.urlId);
            }
            else{
                self.navigateToRootCategory();
            }
        };

        trackingService.trackEvent({
            category: 'pageView',
            label: $location.path()
        });

        return self;
}]);


