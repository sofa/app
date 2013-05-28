angular.module('sdk.services.basketService', [
        // TODO: Investigate. I'm not sold this should be handled on this level. 
        store.enabled ? 'sdk.services.sessionStorageService' : 'sdk.services.memoryStorageService'
    ]);

angular
    .module('sdk.services.basketService')
    .factory('basketService', ['storageService', function(storageService){
        return new cc.BasketService(storageService);
}]);



angular.module('sdk.services.couchService', []);

angular
    .module('sdk.services.couchService')
    .factory('couchService', ['$http', '$q', function($http, $q){
        return new cc.CouchService($http, $q);
}]);



angular.module('sdk.services.memoryStorageService', []);

angular
    .module('sdk.services.memoryStorageService')
    .factory('storageService', [function(){
        return new cc.MemoryStorageService();
}]);



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



angular.module('sdk.services.productService', []);

angular
    .module('sdk.services.productService')
    .factory('productService', [function(){

        'use strict';

        var self = {};

        self.getImage = function(product, size){
            for (var i = 0; i < product.images.length; i++) {
                if (product.images[i].sizeName.toLowerCase() === size){
                    return product.images[i].url;
                }
            }

            return cc.Config.mediaPlaceholder;
        };

        //TODO: This is pure shit. I need to talk to Felix got get that clean
        //It's only in here to keep some German clients happy that rely on it.
        //We need to make it more flexibile & localizable
        self.getBasePriceInfo = function(product){
            if (product.custom1 > 0){
                if (product.custom3 === 'kg'){
                    return 'entspricht ' + cc.Util.toFixed(product.custom1, 2) + ' € pro 1 Kilogramm (kg)';
                }
                else if (product.custom3 === 'St'){
                    return 'entpricht ' + cc.Util.toFixed(product.custom1, 2) + ' € pro 1 Stück (St)';
                }
                else if (product.custom3 === 'L'){
                    return 'entpricht ' + cc.Util.toFixed(product.custom1, 2) + ' € pro 1 Liter (l)';
                }
                else if (cc.Util.isString(product.custom3) && product.custom3.length > 0){
                    return 'entpricht ' + cc.Util.toFixed(product.custom1, 2) + ' € pro '  + product.custom3;
                }
            }

            return '';
        };

        return self;
}]);



angular.module('sdk.services.sessionStorageService', []);

angular
    .module('sdk.services.sessionStorageService')
    .factory('storageService', [function(){
        return new cc.SessionStorageService();
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
angular.module('sdk.directives.ccFooter', []);
angular
    .module('sdk.directives.ccFooter')
    .directive('ccFooter', function() {

        'use strict';

        var defaultIfUndefined = function(scope, property, defaultVal){
            scope[property] = scope[property] === undefined ? defaultVal : scope[property];
        };

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                items: '=?'
            },
            templateUrl: '../sdk/src/directives/ccFooter/ccfooter.tpl.html',
            link: function(scope, element, attrs){
                defaultIfUndefined(scope, 'items', cc.Config.aboutPages);
            }
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
    'sdk.directives.ccZippy',
    'sdk.directives.ccFooter'
    ]);
angular
    .module('sdk.filter.currency', [])
    .filter('currency', function(){


        //the currency can be specified by either the html entity,
        //the symbol or the shorthand name
        var currencyMap = {
            EUR: {
                synonyms: ['&euro;', '€', 'EUR'],
                character: '\u20AC'
            },
            USD: { 
                synonyms: ['&&#36;', '$', 'USD'],
                character: '\u0024'
            },
            GBP: {
                synonyms: ['&pound;', '£', 'GBP'],
                character: '\u00A3'
            }
        };

        return function(val){

            var currency = cc.Config.currencySign || '&euro;';

            var currencyKey = _.findKey(currencyMap, function(item){
                                    return item.synonyms.indexOf(currency) > -1; 
                                }) || 'EUR';

            var currencyChar = currencyMap[currencyKey].character;

            var fixedVal = parseFloat(val).toFixed(2);

            if (currencyKey === 'EUR' ){
                return fixedVal.replace('.', ',') + ' ' + currencyChar;
            }
            else if (currencyKey === 'USD' || currencyKey == 'GBP'){
                return currencyChar + ' ' + fixedVal;
            }
            else{
                return fixedVal;
            }
        };
    });

angular.module('sdk.filter',    [
                                    'sdk.filter.currency'
                                ]);
