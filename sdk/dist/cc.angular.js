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



angular.module('sdk.services.pagesService', []);

angular
    .module('sdk.services.pagesService')
    .factory('pagesService', ['$http', '$q', function($http, $q){
        return new cc.PagesService($http, $q);
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
angular.module('sdk.directives.ccScrollingShadow', []);

angular.module('sdk.directives.ccScrollingShadow')
    .directive('ccScrollingShadow', function() {

        'use strict';

        return {
            restrict: 'A',
            link: function(scope, $element, attr){

                var $topShadow          = angular.element('<div class="cc-scrolling-shadow-top"></div>'),
                    $bottomShadow       = angular.element('<div class="cc-scrolling-shadow-bottom"></div>'),
                    $parent             = $element.parent();

                $parent
                    .append($topShadow)
                    .append($bottomShadow);

                var topShadowHeight     = $topShadow[0].clientHeight,
                    bottomShadowHeight  = $bottomShadow[0].clientHeight;


                //IE uses scrollTop instead of scrollY
                var getScrollTop = function(element){
                    return ('scrollTop' in element) ? element.scrollTop : element.scrollY
                };

                var updateShadows = function(){

                    var element                     = $element[0],
                        scrollTop                   = getScrollTop(element),
                        clientHeight                = element.clientHeight,
                        scrollHeight                = element.scrollHeight,
                        bottomTopVal                = (scrollTop - bottomShadowHeight) + clientHeight,
                        scrollBottom                = scrollHeight - scrollTop - clientHeight,
                        rollingShadowOffsetTop      = 0,
                        rollingShadowOffsetBottom   = 0;

                    if (scrollTop < topShadowHeight){
                        rollingShadowOffsetTop      = (topShadowHeight - scrollTop) * -1;
                    }

                    if (scrollBottom < bottomShadowHeight){
                        rollingShadowOffsetBottom = (bottomShadowHeight - scrollBottom) * -1;
                    }

                    $topShadow.css('top', rollingShadowOffsetTop + 'px');
                    $bottomShadow.css('bottom', rollingShadowOffsetBottom + 'px');
                };

                setTimeout(updateShadows, 1);

                $element.bind('scroll', updateShadows);
            }
        };
    });

angular.module('sdk.directives.ccThumbnailBar', []);

angular.module('sdk.directives.ccThumbnailBar')
    .directive('ccThumbnailBar', function() {

        'use strict';

        return {
            restrict: 'EA',
            replace: true,
            scope: {
                images: '=',
                onChange: '&'
            },
            controller: ['$scope', function($scope){
                $scope.setSelectedImageIndex = function(index){

                    $scope.selectedImageIndex = index;

                    var image = {
                        index: index,
                        url: $scope.images[index].url
                    };

                    $scope.onChange({ image: image });
                };

                if($scope.images.length > 0 && !$scope.selectedImageIndex){
                    $scope.selectedImageIndex = 0;
                }

                $scope.setSelectedImageIndex($scope.selectedImageIndex);
            }],
            templateUrl: '../sdk/src/directives/ccThumbnailBar/ccthumbnailbar.tpl.html'
        };
    });

angular.module('sdk.directives.ccVariantSelector', []);

angular.module('sdk.directives.ccVariantSelector')
    .filter('ccVariantFilter', ['$filter', function($filter) {

        'use strict';

        return function(values, selectedValues, key) {
            var selected = {},
                applyFilters = false;

            // reformat for built in filter and exclude current property
            for (var property in selectedValues){
                if (key!==property && selectedValues[property]!==null && selectedValues[property]!==undefined) {
                   selected['properties.' + property] = selectedValues[property];
                   applyFilters = true;
                }
            }

            // extract available variants
            var variants = applyFilters ? $filter('filter')(values, selected, true) : values;

            // extract flat values for the curent property
            var result = [];
            variants.forEach(function(variant){
                if (result.indexOf(variant.properties[key]) === -1 && variant.stock > 0){
                    result.push(variant.properties[key]);
                }
            });
            return result;
        };
    }])

    .directive('ccVariantSelector', function() {

        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: {
                variants: '=',
                variant : '=?',
                selectedProperties: '=?',
                chooseText: '=?'
            },
            templateUrl: '../sdk/src/directives/ccVariantSelector/ccvariantselector.tpl.html',
            link: function(scope, element, attrs){

                // extract flat list of available properties
                // maybe iterating on the first variant is enough ?
                scope.properties = [];
                scope.selectedProperties = {};

                scope.variants.forEach(function(variant){
                    for (var property in variant.properties){
                        //create a placeholder value on the selectedProperties hash
                        //for each available property. So we can later figure out
                        //which are missing.
                        scope.selectedProperties[property] = null;
                        if (scope.properties.indexOf(property) === -1){
                            scope.properties.push(property);
                        };
                    };
                });
                

                var findVariant = function(variants, selectedProperties){
                    var filteredVariants = variants.filter(function(variant){
                        for (var property in variant.properties){
                            if (variant.properties[property] !== selectedProperties[property]){
                                return false;
                            }
                        };

                        return true;
                    });

                    return filteredVariants.length > 0 ? filteredVariants[0] : null;
                };

                scope.$watch('selectedProperties', function(val){
                    var variant = findVariant(scope.variants, val);
                    scope.variant = variant;
                }, true);
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
            link: function(scope, $element, attrs){
                var element = $element[0],
                    $caption = angular.element(element.querySelectorAll('.cc-zippy-caption')[0]),
                    $icon = angular.element(element.querySelectorAll('.cc-zippy-icon')[0]),
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
    'sdk.directives.ccFooter',
    'sdk.directives.ccVariantSelector',
    'sdk.directives.ccThumbnailBar',
    'sdk.directives.ccScrollingShadow'
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
