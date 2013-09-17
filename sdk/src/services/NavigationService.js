angular.module('sdk.services.navigationService', []);

angular
    .module('sdk.services.navigationService')
    .factory('navigationService', ['$location', '$window', 'couchService', function($location, $window, couchService){

        'use strict';

        var self = {};

        var views = {
            product: /\/cat\/.*\/product\//i,
            products: /\/cat\/.*\/products/i,
            categories: /\/cat\//i
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

        self.navigateToProducts = function(categoryUrlId){
            $location.path('/cat/' + categoryUrlId + '/products');
        };

        self.navigateToProduct = function(product){
            $location.path('cat/' + product.categoryUrlId + '/product/' + product.urlKey);
        };

        self.navigateToCategory = function(categoryUrlId){
            $location.path('/cat/' + categoryUrlId);
        };

        self.navigateToRootCategory = function(){
            $location.path('');
        };

        self.navigateToCart = function(){
            $location.path('/cart');
        };

        self.navigateToCheckout = function(){
            $location.path('/checkout');
        };

        self.navigateToSummary = function(token){
            $location.path('/summary/' + token);
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

            //TODO fix me our regex suck and that's why we need to check here
            //in a specific order
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
            if (category.parent){
                self.navigateToCategory(category.parent.urlId);
            }
            else{
                self.navigateToRootCategory();
            }
        };

        return self;
}]);


