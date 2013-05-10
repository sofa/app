'use strict';

angular.module('sdk.services.basketService', []);

angular
    .module('sdk.services.basketService')
    .factory('basketService', [function(){
        return new cc.BasketService();
}]);



'use strict';

angular.module('sdk.services.couchService', []);

angular
    .module('sdk.services.couchService')
    .factory('couchService', ['$http', '$q', function($http, $q){
        return new cc.CouchService($http, $q);
}]);



'use strict';

angular.module('sdk.services.navigationService', []);

angular
    .module('sdk.services.navigationService')
    .factory('navigationService', ['$location', 'couchService', function($location, couchService){
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

        self.navigateToCategory = function(categoryUrlId){
            $location.path('/cat/' + categoryUrlId);
        };

        self.navigateToRootCategory = function(){
            $location.path('');
        };

        self.navigateToCart = function(){
            $location.path('/cart')
        };

        self.getCategoryUrlId = function(){
            return $location.path()
                .replace(utilityRegex.urlBeforeCategory,'')
                .replace(utilityRegex.urlRightFromSlash, '');
        };

        self.goUp = function(){
            var currentCategoryUrlId,
                currentCategory;

            //TODO fix me our regex suck and that's why we need to check here
            //in a specific order
            if(self.isView('product')){
                currentCategoryUrlId = self.getCategoryUrlId();
                self.navigateToCategory(currentCategoryUrlId);
            }
            else if (self.isView('products')){
                currentCategoryUrlId = self.getCategoryUrlId();
                couchService.getCategories(currentCategoryUrlId)
                    .then(function(category){
                        navigateToParentCategory(category);
                    });
            }
            else if(self.isView('categories')){
                currentCategory = couchService.getCurrentCategory();
                navigateToParentCategory(currentCategory);
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



'use strict';

angular.module('sdk.services.productService', []);

angular
    .module('sdk.services.productService')
    .factory('productService', [function(){
        var self = {};

        self.getImage = function(product, size){
            for (var i = 0; i < product.images.length; i++) {
                if (product.images[i].sizeName.toLowerCase() === size){
                    return product.images[i].url;
                }
            };

            return cc.Config.mediaPlaceholder;
        }

        return self;
}]);



'use strict';

angular.module('sdk.directives.ccFixedToolbarsView', []);

//this is a generic directive that creates an view with optional fixed
//header and toolbars
angular.module('sdk.directives.ccFixedToolbarsView')
    .directive('ccFixedToolbarsView', function() {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                header: '=',
                footer: '='
            },
            templateUrl: '../sdk/src/directives/ccFixedToolbarsView/fixedtoolbarsview.html'
        };
    });
'use strict';

angular.module('sdk.directives.ccZippy', []);

angular.module('sdk.directives.ccZippy')
    .directive('ccZippy', function() {

        var defaultIfUndefined = function(scope, property, defaultVal){
            return scope[property] = scope[property] === undefined ? defaultVal : scope[property];
        };

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                caption: '=?',
                opened: '=?'
            },
            templateUrl: '../sdk/src/directives/ccZippy/cczippy.tpl.html',
            link: function(scope, element, attrs){
                var $element = $(element[0]),
                    $caption = $element.children('.cc-zippy-caption').first(),
                    $icon = $element.find('.cc-zippy-icon').first(),
                    openedIconClass = 'icon-chevron-up',
                    closedIconClass = 'icon-chevron-down';

                defaultIfUndefined(scope, 'caption', 'default');
                defaultIfUndefined(scope, 'opened', false);

                var setOpen = function(opened){
                    $element.removeClass(opened ? 'cc-zippy-closed' : 'cc-zippy-opened');
                    $element.addClass(opened ? 'cc-zippy-opened' : 'cc-zippy-closed');
                    $icon.removeClass(opened ? closedIconClass : openedIconClass);
                    $icon.addClass(opened ? openedIconClass : closedIconClass);
                };

                var toggle = function(){
                    scope.opened = !scope.opened;
                    setOpen(scope.opened);
                };

                $caption.bind('click', toggle);

                scope.$watch('opened', setOpen);

                setOpen(scope.opened);
            }
        };
    });
angular.module('sdk.directives', [
    'sdk.directives.ccFixedToolbarsView',
    'sdk.directives.ccZippy'
    ]);