(function(window, cc, angular, undefined){

angular.module('cc.angular.templates', ['src/directives/ccAddress/ccaddress.tpl.html', 'src/directives/ccBreadcrumbs/cc-breadcrumbs.tpl.html', 'src/directives/ccCategoryTreeView/cc-category-tree-view.tpl.html', 'src/directives/ccCheckBox/cccheckbox.tpl.html', 'src/directives/ccElasticViews/elasticViews.tpl.html', 'src/directives/ccFooter/ccfooter.tpl.html', 'src/directives/ccGoBackButton/cc-go-back-button.tpl.html', 'src/directives/ccGoUpButton/cc-go-up-button.tpl.html', 'src/directives/ccLoadingSpinner/ccloadingspinner.tpl.html', 'src/directives/ccSelectBox/ccselectbox.tpl.html', 'src/directives/ccThumbnailBar/ccthumbnailbar.tpl.html', 'src/directives/ccVariantSelector/ccvariantselector.tpl.html', 'src/directives/ccZippy/cczippy.tpl.html']);

angular.module("src/directives/ccAddress/ccaddress.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccAddress/ccaddress.tpl.html",
    "<div>\n" +
    "    <div>{{data.company}}</div>\n" +
    "    <div>{{data.name}} {{data.surname}}</div>\n" +
    "    <div>{{data.street}}</div>\n" +
    "    <div>{{data.zip}} {{data.city}}</div>\n" +
    "    <div>{{data.country.label}}</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("src/directives/ccBreadcrumbs/cc-breadcrumbs.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccBreadcrumbs/cc-breadcrumbs.tpl.html",
    "<ul>\n" +
    "    <li class=\"cc-breadcrumbs__entry\" \n" +
    "        ng-repeat=\"entry in data\">\n" +
    "        <a ng-click=\"navigateTo(entry)\" ng-bind=\"entry.title\"></a>\n" +
    "    </li>\n" +
    "</ul>");
}]);

angular.module("src/directives/ccCategoryTreeView/cc-category-tree-view.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccCategoryTreeView/cc-category-tree-view.tpl.html",
    "<div class=\"cc-category-tree-view\">\n" +
    "    <ul ng-class=\"{ 'cc-category-tree-view__list--open': item._categoryTreeView.isVisible, \n" +
    "                    'cc-category-tree-view__list--closed': !item._categoryTreeView.isVisible }\" cc-template-code>\n" +
    "           <li class=\"cc-category-tree-view__list-item-level-{{ item._categoryTreeView.level }}\" \n" +
    "               cc-nested-category-item ng-repeat=\"item in items\">\n" +
    "                <div ng-click=\"doAction(item)\" class=\"cc-category-tree-view__category-entry\">{{item.label}}\n" +
    "                    <i ng-class=\"item._categoryTreeView.isVisible ? 'fa-chevron-down' : 'fa-chevron-right'\" \n" +
    "                       class=\"cc-category-tree-view__category-entry-icon fa\"\n" +
    "                       ng-show=\"item.hasChildren\">\n" +
    "                   </i>\n" +
    "                </div>\n" +
    "           </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "");
}]);

angular.module("src/directives/ccCheckBox/cccheckbox.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccCheckBox/cccheckbox.tpl.html",
    "<label for=\"cc-check-box-{{id}}\" class=\"topcoat-checkbox\">\n" +
    "  <input ng-model=\"value\" id=\"cc-check-box-{{id}}\" aria-labelledby=\"cc-check-box-{{id}}-label\" aria-describedby=\"cc-check-box-{{id}}-description\" type=\"checkbox\">\n" +
    "  <div class=\"topcoat-checkbox__checkmark\"></div>\n" +
    "  <span id=\"cc-check-box-{{id}}-label\">{{label}}</span> \n" +
    "</label>");
}]);

angular.module("src/directives/ccElasticViews/elasticViews.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccElasticViews/elasticViews.tpl.html",
    "<div class=\"cc-elastic-views-viewport\">\n" +
    "    <div \n" +
    "        ng-repeat=\"view in views\"\n" +
    "        cc-elastic-views-notifier \n" +
    "        id=\"{{view.name}}\" \n" +
    "        class=\"cc-elastic-views-view\" \n" +
    "        ng-class=\"view.cls\" \n" +
    "        ng-include=\"view.tpl\">\n" +
    "    </div>\n" +
    "<div>");
}]);

angular.module("src/directives/ccFooter/ccfooter.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccFooter/ccfooter.tpl.html",
    "<ul class=\"cc-footer-list\">\n" +
    "    <li bindonce=\"item\" ng-repeat=\"item in items\"\n" +
    "        class=\"cc-footer-list__row\"\n" +
    "        ng-click=\"goTo(item)\" >\n" +
    "        <div class=\"cc-footer-list__row-content\">\n" +
    "            <span bo-text=\"item.title\"></span>\n" +
    "            <i class=\"cc-footer-list__row-icon fa fa-chevron-right\"></i>\n" +
    "        </div>\n" +
    "    </li>\n" +
    "</ul>");
}]);

angular.module("src/directives/ccGoBackButton/cc-go-back-button.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccGoBackButton/cc-go-back-button.tpl.html",
    "<button class=\"cc-go-back-button fa fa-arrow-circle-o-left\" ng-click=\"goBack()\"></button>");
}]);

angular.module("src/directives/ccGoUpButton/cc-go-up-button.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccGoUpButton/cc-go-up-button.tpl.html",
    "<button class=\"cc-go-up-button fa fa-level-up fa-flip-horizontal\" ng-click=\"goUp()\"></button>");
}]);

angular.module("src/directives/ccLoadingSpinner/ccloadingspinner.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccLoadingSpinner/ccloadingspinner.tpl.html",
    "<div class=\"cc-loading-spinner\">\n" +
    "    <!-- generated and tweaked from http://cssload.net/ -->\n" +
    "    <div class=\"cc-loading-spinner__circle--01\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--02\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--03\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--04\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--05\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--06\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--07\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--08\"></div>\n" +
    "</div>");
}]);

angular.module("src/directives/ccSelectBox/ccselectbox.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccSelectBox/ccselectbox.tpl.html",
    "<div class=\"cc-select-box\">\n" +
    "     <span class=\"cc-select-box__display-value\" ng-bind=\"displayFn(_selectedValue)\"></span>\n" +
    "     <span class=\"cc-select-box__display-value\" ng-hide=\"_selectedValue\">{{chooseText}} {{propertyName}}</span>\n" +
    "     <i class=\"cc-select-box__select-icon fa fa-chevron-down\"></i>\n" +
    "    <select name=\"{{propertyName}}\"\n" +
    "            class=\"cc-select-box__native-select\" \n" +
    "            ng-model=\"_selectedValue\" \n" +
    "            ng-options=\"displayFn(val) for val in data\">\n" +
    "        <option ng-if=\"!_omitNull\" value=\"\">-- {{chooseText}} {{propertyName}} --</option>\n" +
    "    </select>\n" +
    "    <span class=\"cc-validation__message--fail\">{{ failMessage }}</span>\n" +
    "</div>");
}]);

angular.module("src/directives/ccThumbnailBar/ccthumbnailbar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccThumbnailBar/ccthumbnailbar.tpl.html",
    "<div class=\"cc-thumbnail-bar\">\n" +
    "    <img \n" +
    "        class=\"cc-thumbnail-bar-image\" \n" +
    "        ng-class=\"$index === selectedImageIndex ? 'cc-thumbnail-active' : ''\"\n" +
    "        ng-click=\"setSelectedImageIndex($index)\" \n" +
    "        ng-repeat=\"image in images\" ng-src=\"{{image.url}}\"/>\n" +
    "</div>\n" +
    "");
}]);

angular.module("src/directives/ccVariantSelector/ccvariantselector.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccVariantSelector/ccvariantselector.tpl.html",
    "<div class=\"cc-variant-selector\">\n" +
    "    <div class=\"cc-select-box\"\n" +
    "         ng-repeat=\"property in properties\">\n" +
    "         <span class=\"cc-select-box__display-value\" ng-bind=\"selectedProperties[property]\"></span>\n" +
    "         <span class=\"cc-select-box__display-value\" ng-hide=\"selectedProperties[property]\">{{chooseText}} {{property}}</span>\n" +
    "         <i class=\"cc-select-box__select-icon fa fa-chevron-down\"></i>\n" +
    "        <select name=\"{{property}}\"\n" +
    "                class=\"cc-select-box__native-select\" \n" +
    "                ng-model=\"selectedProperties[property]\" \n" +
    "                ng-options=\"val for val in variants|ccVariantFilter:selectedProperties:property\">\n" +
    "            <option value=\"\">-- {{chooseText}} {{property}} --</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("src/directives/ccZippy/cczippy.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccZippy/cczippy.tpl.html",
    "<div class=\"cc-zippy\">\n" +
    "    <div class=\"cc-zippy-caption\">\n" +
    "        <span ng-bind=\"caption\"></span>\n" +
    "        <i class=\"cc-zippy-icon\"></i>\n" +
    "    </div>\n" +
    "    <div class=\"cc-zippy-content\" ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module('sdk.services.basketService', [
        // TODO: Investigate. I'm not sold this should be handled on this level. 
        store.enabled ? 'sdk.services.localStorageService' : 'sdk.services.memoryStorageService',
        'sdk.services.configService'
    ]);

angular
    .module('sdk.services.basketService')
    .factory('basketService', ['storageService', 'configService', function(storageService, configService){
        return new cc.BasketService(storageService, configService);
}]);



angular.module('sdk.services.checkoutService', ['sdk.services.basketService', 'sdk.services.loggingService']);

angular
    .module('sdk.services.checkoutService')
    .factory('checkoutService', ['$http', '$q', 'basketService', 'loggingService', 'configService', function($http, $q, basketService, loggingService, configService){
        return new cc.CheckoutService($http, $q, basketService, loggingService, configService);
}]);



angular.module('sdk.services.configService', []);

angular
    .module('sdk.services.configService')
    .factory('configService', [function(){
        return new cc.ConfigService();
}]);



angular.module('sdk.services.couchService', ['sdk.services.configService']);

angular
    .module('sdk.services.couchService')
    .factory('couchService', ['$http', '$q', 'configService', function($http, $q, configService){
        return new cc.CouchService($http, $q, configService);
}]);



angular.module('sdk.services.deviceService', []);

angular
    .module('sdk.services.deviceService')
    .factory('deviceService', ['$window', function($window){
        return new cc.DeviceService($window);
}]);



angular.module('sdk.services.injectsService', ['sdk.services.configService']);

angular
    .module('sdk.services.injectsService')
    .factory('injectsService', ['$location', 'configService', function($location, configService){

        'use strict';

        var self = {};

        var RESOURCE_URL     = configService.get('resourceUrl') + 'html/';

        //we build a map of the injects for faster lookups.
        var injects = configService
                        .get('injects', [])
                        .reduce(function(previous, current){
                            var key = current.url + '_' + current.target;
                            previous[key] = {
                                template: current.template + '.html',
                                target: current.target
                            };
                            return previous;
                        }, {});

        var getKey = function(injectionPoint, url){
            return assureUrl(url) + '_' + injectionPoint;
        };

        var assureUrl = function(url){
            return url || $location.url();
        };

        self.hasInject = function(injectionPoint, url){
            return !cc.Util.isUndefined(injects[getKey(injectionPoint, url)]);
        };

        self.getTemplate = function(injectionPoint){

            if (self.hasInject(injectionPoint)){
                return RESOURCE_URL + injects[getKey(injectionPoint)].template;
            }

            if (self.hasInject(injectionPoint, '*')){
                return RESOURCE_URL + injects[getKey(injectionPoint, '*')].template;
            }

            return null;
        };

        return self;
}]);



angular.module('sdk.services.loggingService', ['sdk.services.configService']);

angular
    .module('sdk.services.loggingService')
    .factory('loggingService', ['configService', function(configService){
        return new cc.LoggingService(configService);
}]);



angular.module('sdk.services.memoryStorageService', []);

angular
    .module('sdk.services.memoryStorageService')
    .factory('storageService', [function(){
        return new cc.MemoryStorageService();
}]);



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



angular.module('sdk.services.pagesService', ['sdk.services.configService']);

angular
    .module('sdk.services.pagesService')
    .factory('pagesService', ['$http', '$q', 'configService', function($http, $q, configService){
        return new cc.PagesService($http, $q, configService);
}]);



angular.module('sdk.services.requestAnimationFrame', []);

angular
    .module('sdk.services.requestAnimationFrame')
    .factory('requestAnimationFrame', ['$window', '$rootScope', function($window, $rootScope){
        return function(callback, invokeApply){

            //only if it's explicitly false it should not invoke apply.
            //If it's called without the parameter it should be true by default.
            invokeApply = invokeApply === false ? false : true;

            $window.requestAnimationFrame(function(){
                callback();

                if(invokeApply){
                    $rootScope.$apply();
                }
            });
        };
}]);
angular.module('sdk.services.searchService', ['sdk.services.configService']);

angular
    .module('sdk.services.searchService')
    .factory('searchService', ['configService', '$http', '$q', '$rootScope', function(configService, $http, $q, $rootScope){
        
        var applier = function(){
            $rootScope.$apply();
        };

        return new cc.SearchService(configService, $http, $q, applier);
}]);



angular.module('sdk.services.localStorageService', []);

angular
    .module('sdk.services.localStorageService')
    .factory('storageService', [function(){
        return new cc.LocalStorageService();
}]);



angular.module('sdk.services.trackingService', []);

angular
    .module('sdk.services.trackingService')
    .factory('trackingService', ['$window', '$http', 'configService', function($window, $http, configService){
        return new cc.TrackingService($window, $http, configService);
}]);
angular.module('sdk.services.urlConstructionService', [
        'sdk.services.configService'
    ]);

angular
    .module('sdk.services.urlConstructionService')
    .factory('urlConstructionService', ['configService', function(configService){
        return new cc.UrlConstructionService(configService);
}]);



angular.module('sdk.services.urlParserService', []);

angular
    .module('sdk.services.urlParserService')
    .factory('urlParserService', ['$location', function($location){
        return new cc.UrlParserService($location);
}]);



angular.module('sdk.services.userService', [
        // TODO: Investigate. I'm not sold this should be handled on this level. 
        store.enabled ? 'sdk.services.localStorageService' : 'sdk.services.memoryStorageService',
        'sdk.services.configService'
    ]);

angular
    .module('sdk.services.userService')
    .factory('userService', ['storageService', 'configService', function(storageService, configService){
        return new cc.UserService(storageService, configService);
}]);



angular.module('sdk.directives.ccAddress', ['src/directives/ccAddress/ccaddress.tpl.html']);

angular.module('sdk.directives.ccAddress')
    .directive('ccAddress', function() {

        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: {
                data: '=',
            },
            templateUrl: 'src/directives/ccAddress/ccaddress.tpl.html'
        };
    });

angular.module('sdk.directives.ccBreadcrumbs', [
        'src/directives/ccBreadcrumbs/cc-breadcrumbs.tpl.html',
        'sdk.services.urlParserService',
        'sdk.services.urlConstructionService',
        'sdk.services.couchService'
    ]);

angular.module('sdk.directives.ccBreadcrumbs')
    .directive('ccBreadcrumbs', ['$location', 'urlParserService', 'urlConstructionService', 'couchService', 'navigationService', function($location, urlParserService, urlConstructionService, couchService, navigationService) {

        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'src/directives/ccBreadcrumbs/cc-breadcrumbs.tpl.html',
            scope: {
                data: '=?'
            },
            link: function($scope, $element, attrs){

                var categoryToLinkTitleList = function(category){
                    var list = [];

                    var doIt = function(currentCategory){
                        if(currentCategory.parent){
                            list.unshift({
                                title: currentCategory.label,
                                link: urlConstructionService.createUrlForCategory(currentCategory.urlId)
                            });

                            doIt(currentCategory.parent);
                        }
                    };

                    doIt(category);

                    return list;
                };

                var prependRootLink = function(list){
                    //get rid of hardcoded stuff
                    list.unshift({
                        title: 'Startseite',
                        link: '/'
                    });

                    return list;
                };

                $scope.navigateTo = function(entry){
                    $location.path(entry.link);
                };

                $scope.$watch(function(){
                    return $location.path();
                }, function(){
                    if(!urlParserService.isRootCategory() ||
                        urlParserService.isView('categories') ||
                        urlParserService.isView('products') ||
                        urlParserService.isView('product')){

                        var categoryUrlId = urlParserService.getCategoryUrlId();

                        couchService
                            .getCategory(categoryUrlId)
                            .then(function(category){
                                var data = prependRootLink(
                                                categoryToLinkTitleList(category));

                                if (urlParserService.isView('products')){
                                    data.pop();
                                }

                                $scope.data = data;
                            });
                    }
                });
            }
        };
    }]);
angular.module('sdk.directives.ccCategoryTreeView', [
        'sdk.directives.ccTemplateCode',
        'src/directives/ccCategoryTreeView/cc-category-tree-view.tpl.html'
    ]);
angular.module('sdk.directives.ccCategoryTreeView')
    .directive('ccCategoryTreeView', ['couchService', 'categoryTreeViewRemote', function(couchService, categoryTreeViewRemote) {

        'use strict';

        return {
            restrict: 'EA',
            scope:{},
            replace: true,
            templateUrl: 'src/directives/ccCategoryTreeView/cc-category-tree-view.tpl.html',
            link: function($scope, $element, attributes, controller){
                couchService
                    .getCategory()
                    .then(function(rootCategory){
                        $scope.items = rootCategory && rootCategory.children ? rootCategory.children : [];
                        $scope.item = rootCategory;
                        categoryTreeViewRemote.toggleVisibility(rootCategory);


                        $scope.items.forEach(function(item){
                            categoryTreeViewRemote.setItemLevel(item, 1);
                        });

                    });
            }
        };
    }]);
angular.module('sdk.directives.ccCategoryTreeView')
    .factory('categoryTreeViewRemote', [function() {

        'use strict';

        var self = {};

        self.toggleVisibility = function(item){
            asurePrivateStore(item);
            item._categoryTreeView.isVisible = !item._categoryTreeView.isVisible;
        };

        self.setItemLevel = function(item, level){
            asurePrivateStore(item);
            item._categoryTreeView.level = level;
        };

        var asurePrivateStore = function(item){
            if (!item._categoryTreeView){
                item._categoryTreeView = { isVisible: false };
            }
        };

        return self;
    }]);
angular.module('sdk.directives.ccCategoryTreeView')
    .directive('ccNestedCategoryItem', ['$compile', 'categoryTreeViewRemote', 'navigationService', 'snapRemote', function($compile, categoryTreeViewRemote, navigationService, snapRemote) {

        'use strict';

        return {
            restrict: 'A',
            require: '^ccTemplateCode',
            link: function($scope, $element, attributes, controller){
                if ($scope.item.children){
                    $scope.items = $scope.item.children;
                    var html = $compile(controller.templateCode)($scope);
                    $element.append(html);
                }
                $scope.remoteControl = categoryTreeViewRemote;

                $scope.doAction = function(item){
                    if (!item.hasChildren){
                        snapRemote.close();
                        navigationService.navigateToProducts(item.urlId);
                    }
                    else{
                        categoryTreeViewRemote.toggleVisibility(item);
                    }
                };
            }
        };
    }]);

angular.module('sdk.directives.ccCheckBox', ['src/directives/ccCheckBox/cccheckbox.tpl.html']);

angular.module('sdk.directives.ccCheckBox')
    .directive('ccCheckBox', function() {

        'use strict';

        var instanceCount = 0;

        return {
            restrict: 'E',
            replace: true,
            scope: {
                label: '=?',
                value: '=?'
            },
            templateUrl: 'src/directives/ccCheckBox/cccheckbox.tpl.html',
            link: function(scope, $element, attrs){
                instanceCount++;
                scope.id = instanceCount;
            }
        };
    });
angular.module('sdk.directives.ccElasticViews', [
    'src/directives/ccElasticViews/elasticViews.tpl.html',
    /*ccElasticViews.domPos.left, */
    'sdk.directives.ccElasticViews.domPos.transform']);
angular
    .module('sdk.directives.ccElasticViews.domPos.left', []);

angular
    .module('sdk.directives.ccElasticViews.domPos.left')
    .factory('domPos', function(){

        var self = {};

        self.getLeft = function(element){
            //we can't use getBoundingClientRect() here since this returns the left
            //distance relative to the screen, not to the parent. That in turn means,
            //that it won't work if the directive is used somewhere centered on the screen.
            return (element.offsetLeft || 0);
        };

        self.setLeft = function(element, px){
            element.style.left = px + 'px';
        };

        return self;
    });

angular
    .module('sdk.directives.ccElasticViews.domPos.transform', []);

angular
    .module('sdk.directives.ccElasticViews.domPos.transform')
    .factory('domPos', function(){

        var self = {},
            TRANSLATE3D_REGEX = /translate3d\((-?\d+(?:px)?),\s*(-?\d+(?:px)?),\s*(-?\d+(?:px)?)\)/;

        self.getLeft = function(element){
            var elementStyle    = element.style,
                matrix          = elementStyle.transform          ||
                                  elementStyle.webkitTransform    ||
                                  elementStyle.mozTransform       ||
                                  elementStyle.msTransform        ||
                                  elementStyle.oTransform,

                results         = matrix.match(TRANSLATE3D_REGEX);

            return !results ? 0 : parseFloat(results[1]);
        };

        self.setLeft = function(element, px){
            var transform = 'translate3d(' + px + 'px,0,0)';
            element.style.transform = transform;
            element.style.oTransform = transform;
            element.style.msTransform = transform;
            element.style.mozTransform = transform;
            element.style.webkitTransform = transform;
        };

        return self;
    });
angular
    .module('sdk.directives.ccElasticViews')
    .factory('dragInfoService', function(){
        //not sure if we really end up with this abstraction.
        //However, as an interim step it's better to put the code here
        //as putting everything into the directive

        var self = {};

        self.createViewPortDragInfo = function(){
            return  {
                        posX:       0,
                        snapPoints: [{
                                        snapArea: '*',
                                        bound: 'left',
                                        snapTo: 0
                                    }]
                    };
        };

        self.getXOfARelativeToB = function(aDragInfo, bDragInfo){
            return aDragInfo.posX - bDragInfo.posX;
        };

        //This method gives information about whether:
        //  - the xRelative is within the area specified by the snapPoint
        //  - the xRelative is exactly at the point where the snapPoint defines to snap to
        //  - the snap should be done

        //in an earlier version this method just reported a boolean back whether it should
        //snap or not. However, if we have an exact match, it should *NOT* snap, still
        //it's benefitial to consider the snapPoint as being fulfiled because otherwise
        //other (wildcard) snappoints will catch it.
        var shouldSnapToSnapPoint = function(aDragInfo, bDragInfo, snapPoint){

            var xRelative = self.getXOfARelativeToB(aDragInfo, bDragInfo),
                xRightRelative = bDragInfo.width - xRelative,
                info = {};

            //WARNING: Lot's of duplicated code ahead. CLEAN THE MESS UP!
            if (snapPoint.bound === 'left'){
                info.exactMatch = xRelative === snapPoint.snapTo;
                info.inSnapRange = snapPoint.snapArea === '*' || (xRelative >= snapPoint.snapArea.from) && (xRelative <= snapPoint.snapArea.to);
                info.shouldSnap = info.inSnapRange && !info.exactMatch;

                if (info.shouldSnap){
                    snapPoint.snapDelta = snapPoint.snapTo - xRelative;
                }
            }
            else if (snapPoint.bound === 'right'){
                info.exactMatch = xRightRelative === snapPoint.snapTo;
                info.inSnapRange = snapPoint.snapArea === '*' || (xRightRelative >= snapPoint.snapArea.from) && (xRightRelative <= snapPoint.snapArea.to);
                info.shouldSnap = info.inSnapRange && !info.exactMatch;

                if(info.shouldSnap){
                    snapPoint.snapDelta = xRightRelative - snapPoint.snapTo;
                }
            }

            return info;
        };

        self.shouldASnapToB = function(aDragInfo, bDragInfo){
            var snapInfo =  {
                                snap: false,
                                snapPoint: null
                            };

            if (!angular.isArray(bDragInfo.snapPoints)){
                return snapInfo;
            }

            var matchedSnapPoint;
            for (var i = 0; i < bDragInfo.snapPoints.length; i++) {
                var snapPoint = bDragInfo.snapPoints[i];

                var shouldSnap = shouldSnapToSnapPoint(aDragInfo, bDragInfo, snapPoint);

                if(shouldSnap.shouldSnap){
                    matchedSnapPoint = snapPoint;
                    break;
                }
                else if(shouldSnap.exactMatch){
                    //that's the point where we want to break the cascade but still nothing should be
                    //snaped since we are already at the *exact* position where the snap would end.
                    break;
                }
            }

            if (matchedSnapPoint){
                snapInfo.snap = true;
                snapInfo.snapPoint = matchedSnapPoint;
            }

            return snapInfo;
        };

        return self;
    });
angular
    .module('sdk.directives.ccElasticViews')
    .factory('elasticModel', function(){

        var DragInfo = function(){

            var self = {};

            self.posX = 0;
            self.posY = 0;
            self.lastX = null;
            self.lastY = 0;
            self.abandoned = '';
            self.abandonedDelta = 0;
            self.movement = 'none';
            self.posXOnMovementChange = 0;
            self.domNode = null;

            self.setMovement = function(type, posX){
                if (self.movement !== type){
                    //we don't rely on that information anymore. Let's keep it until
                    //we gain more confidence for our approach
                    self.posXOnMovementChange = posX;
                }

                if(type === 'none'){
                    self.posXOnMovementChange = 0;
                }

                self.movement = type;
            };

            return self;
        };

        return function(obj){
            obj  = obj || {};
            obj.dragInfo = obj.dragInfo ? angular.extend(new DragInfo(), obj.dragInfo) : new DragInfo();
            return obj;
        };
    });
angular
    .module('sdk.directives.ccElasticViews')
    .value('elasticViewConfig', {
        SNAP_OFFSET_PX: 5,
        VIEW_CLS: 'cc-elastic-views-view',
        SNAP_ROOT_VIEW_TO_VIEWPORT: true
    });
angular
    .module('sdk.directives.ccElasticViews')
    .factory('elasticViewControllerFactory', ['elasticViewConfig', 'dragInfoService', 'domPos', function(elasticViewConfig, dragInfoService, domPos){

        var ElasticViewController = function($element, viewCollection){

            var SNAP_OFFSET_PX = elasticViewConfig.SNAP_OFFSET_PX,
                snapBackInProgress = false,
                //Each view snaps according to the snapPoints of it's bottom sibling.
                //However, the root view does not have a bottom sibling. If we want it to snap,
                //then the snap would happen accordingly to the snapPoints of the viewPort.
                //Hence we fake a dragInfo for the viewPort.
                viewPortDragInfo = dragInfoService.createViewPortDragInfo();

            var dragPanel = function(event){
                var target = event.target;
                var $target = angular.element(target);
                if (!$target.hasClass(elasticViewConfig.VIEW_CLS)){
                    return;
                }
                snapBackInProgress = false;
                dragWithSiblings(event);
            };

            var stopDrag = function(){

                var snapBack = null;
                var snapBackQueue = [];

                viewCollection.views.forEach(function(view, index, collection){
                    view.dragInfo.lastX = view.dragInfo.posX;
                    view.dragInfo.lastY = view.dragInfo.posY;

                    //we don't want to cause snapBacks to cause further snapBack checks                        
                    if (!snapBackInProgress){
                        if (index > 0 || elasticViewConfig.SNAP_ROOT_VIEW_TO_VIEWPORT){
                            var bottomViewDragInfo = index > 0 ? collection[index -1].dragInfo : viewPortDragInfo;
                                snapInfo = dragInfoService.shouldASnapToB(view.dragInfo, bottomViewDragInfo);

                            if(snapInfo.snap){
                                snapBackQueue.push({
                                    view: view,
                                    snapDelta: snapInfo.snapPoint.snapDelta
                                });
                            }
                        }
                    }
                });

                /* There are two approaches (that I know of) for cascading snapbacks:
                 *
                 * 1. always just perform one snap back and let a snap back trigger other snap backs
                 * until the system stabilizes and no further snap backs are triggered
                 *
                 * 2. Hold snapbacks in a queue and perform all of them sequentially directly from this
                 * method call. This means that snapbacks are not allowed to trigger further snapbacks.
                 * Otherwise we would have snapback-ception
                 *
                 * We are currently going for the second approach since the first one lead to invinite loops
                 * that I couldn't manage to track down yet.
                 */

                if (!snapBackInProgress){
                    snapBackInProgress = true;

                    for (var i = snapBackQueue.length - 1; i >= 0; i--) {
                        var snap = snapBackQueue[i];
                        performManualDrag(snap.view.name, snap.snapDelta);
                    }

                }
            };

            var shouldPullBottomSibling = function(bottomSibling, element){
                //ATTENTION: We use getBoundingClientRect() here for performance.
                //Be aware that this returns the left coord relative to the screen (!) not to the
                //parent. This only works here because all we are interested in is the difference between
                //the elements. But we can't use this value to manipulate the position
                var xLeftElement = element.getBoundingClientRect().left;
                var xRightBottomSibling = getXofRightBoundary(bottomSibling);

                var diff = xLeftElement - xRightBottomSibling;

                return diff > (SNAP_OFFSET_PX * -1);
            };

            var shouldPushBottomSibling = function(bottomSibling, element){
                var xLeftElement = element.getBoundingClientRect().left;
                var xLeftBottomSibling = bottomSibling.getBoundingClientRect().left;

                var diff = xLeftElement - xLeftBottomSibling;

                return diff < SNAP_OFFSET_PX;
            };

            var setLastXIfEmpty = function(view, element){
                if (view.dragInfo.lastX === null){
                    view.dragInfo.lastX = domPos.getLeft(element);
                }
            };

            var getXofRightBoundary = function(element){
                return element.getBoundingClientRect().left + element.offsetWidth;
            };

            var dragWithSiblings = function(event){

                if (event.gesture.interimDirection !== 'left' && event.gesture.interimDirection !== 'right'){
                    return;
                }

                var currentView = viewCollection.getViewFromStack(event.target.id);
                var dragInfo = currentView.dragInfo;

                setLastXIfEmpty(currentView, event.target);

                dragInfo.posX = event.gesture.deltaX + dragInfo.lastX;
                domPos.setLeft(event.target, dragInfo.posX);

                //move all bottom siblings
                moveSiblings(event.gesture.deltaX, currentView, event.target, dragInfo, event.gesture.interimDirection, viewCollection.getBottomSibling, moveBottomSibling);
                //move all top siblings
                moveSiblings(event.gesture.deltaX, currentView, event.target, dragInfo, event.gesture.interimDirection, viewCollection.getTopSibling, moveTopSibling);
            };

            var performManualDrag = function(name, deltaX){
                var view = viewCollection.getViewFromStack(name),
                    direction = deltaX > 0 ? 'right' : 'left';

                dragWithSiblings({
                    gesture: {
                        interimDirection: direction,
                        deltaX: deltaX
                    },
                    target: view.dragInfo.domNode
                });
                stopDrag();
            };

            var moveSiblings = function(deltaX, startView, startElement, startElementDragInfo, direction, siblingLocatorFn, siblingMoverFn){
                var currentBottomSibling = siblingLocatorFn(startView);
                var currentElement = startElement;
                var bottomSiblingEl;
                while(currentBottomSibling){

                    if (currentBottomSibling){
                        bottomSiblingEl = currentBottomSibling.dragInfo.domNode;
                        startElementDragInfo = siblingMoverFn(deltaX, currentBottomSibling, bottomSiblingEl, currentElement, startElementDragInfo, direction);
                    }

                    currentBottomSibling = siblingLocatorFn(currentBottomSibling);
                    currentElement = bottomSiblingEl;
                }
            };

            /**
             * Moves the bottomSibling according to the movement of the topSibling if the bottomSibling
             * hit's the specific "glue points" of it's topSibling
             *
             * Options:
             * 
             *   - `deltaX` the total delta of the current drag (can probably be removed later)
             *   - `bottomSibling` the bottomSibling of the item being moved
             *   - `bottomSiblingEl` the DOM element of the bottomSibling
             *   - `topSibling` the element sitting on top of the bottomSibling
             *   - `topSiblingDragInfo` the drag info of the topSibling
             *   - `direction` the direction of the current drag
             */
            var moveBottomSibling = function(deltaX, bottomSibling, bottomSiblingEl, topSibling, topSiblingDragInfo, direction){
                //transform = "translate3d("+bottomSibling.posX+"px,0px, 0) ";
                var dragInfo = bottomSibling.dragInfo;

                //I'm not sure if this is needed anymore. Investigate!
                setLastXIfEmpty(bottomSibling, bottomSiblingEl);

                if (direction === 'right'){
                    if (shouldPullBottomSibling(bottomSiblingEl, topSibling)){
                        //we need to remember the value of the deltaX at the moment when the sibling is starting to get pulled.
                        //So that we can move the sibling by the actual distance since being pulled and not by the distance that the actor
                        //has already moved on the screen. In plain english: The sibling moves: allDistance - distanceWhenPullingOfSibling began
                        dragInfo.setMovement('pull', deltaX);
                    }
                    else{
                        return dragInfo;
                    }
                }
                else if (direction === 'left'){
                    if (shouldPushBottomSibling(bottomSiblingEl, topSibling)){
                        dragInfo.setMovement('push', deltaX);
                    }
                    else {
                        return dragInfo;
                    }
                }

                monitor.innerHTML = dragInfo.posXOnMovementChange + "-" + dragInfo.abandonedDelta;

                if (direction === 'right' && dragInfo.movement === 'pull'){
                    dragInfo.posX = topSiblingDragInfo.posX - dragInfo.width + SNAP_OFFSET_PX;
                }
                else if (direction === 'left' && dragInfo.movement === 'push'){
                    dragInfo.posX = topSiblingDragInfo.posX - SNAP_OFFSET_PX;
                }

                domPos.setLeft(bottomSiblingEl, dragInfo.posX);

                return dragInfo;
            };

            var moveTopSibling = function(deltaX, topSibling, topSiblingEl, bottomSibling, bottomSiblingDragInfo, direction){
                var dragInfo = topSibling.dragInfo;
                setLastXIfEmpty(topSibling, topSiblingEl);
                dragInfo.posX = deltaX + dragInfo.lastX;

                domPos.setLeft(topSiblingEl, dragInfo.posX);

                return dragInfo;
            };

            var element = $element[0];

            Hammer(element).on('drag', dragPanel);
            Hammer(element).on('dragend', stopDrag);

            return {
                drag: performManualDrag
            };
        };


        var self = {},
            instances = {};

        self.create = function(id, $element, viewCollection){
            instances[id] = instance = new ElasticViewController($element, viewCollection);
            return instance;
        };

        self.get = function(id){
            return instances[id];
        };

        self.remove = function(id) {
            delete instances[id];
        };

        return self;
    }]);
angular
    .module('sdk.directives.ccElasticViews')
    .directive('ccElasticViewsNotifier', function(){

        return {
            restrict: 'A',
            require: '?^ccElasticViews',
            link: function($scope, $element, attrs, controller) {
                if(!controller){
                    return;
                }
                controller.onViewCreated($scope.$index, $element[0]);
            }
        };
    });

angular
    .module('sdk.directives.ccElasticViews')
    .directive('ccElasticViews', ['elasticViewConfig', 'dragInfoService', 'domPos', 'viewCollectionFactory', 'elasticViewControllerFactory', function(elasticViewConfig, dragInfoService, domPos, viewCollectionFactory, elasticViewControllerFactory){

        return {
            restrict: 'E',
            templateUrl: 'src/directives/ccElasticViews/elasticViews.tpl.html',
            replace: true,
            scope: {
                views: '='
            },
            controller: ['$scope', 'domPos', function($scope, domPos){
                this.onViewCreated = function(index, domNode){
                    //reconsider if we want to use the viewCollection here?
                    $scope.views[index].dragInfo.domNode = domNode;
                    $scope.views[index].dragInfo.width = domNode.offsetWidth;
                    domPos.setLeft(domNode, $scope.views[index].dragInfo.posX);
                };
            }],
            link: function($scope, $element, attrs){

                if (!attrs.id){
                    throw new Error("An id is mandatory for the elastic-views directive. Read about the reasoning behind in the documentation.");
                }

                $scope.$on("$destroy",function(){
                    //we need to be aware here that we only remove the controller from the factory.
                    //However, we can't control if instances still exist elsewhere (hint, on a regular controller!)
                    //We need to look into how to best leverage the event system to get notified elsewhere to perform cleanups
                    elasticViewControllerFactory.remove(attrs.id);
                });

                var viewCollection = viewCollectionFactory($scope.views);
                //we delegate all work to an elasticViewController retrieved by a factory
                //this way we can also get a handle on such a controller from within a regular controller
                //this is an essential point as it might be important to perform drags programatically.
                //This is exactly the reason why we need to have an id for the elastic-views directive.
                //Otherwise it wouldn't be possible to get a handle on the controller later
                var controller = elasticViewControllerFactory.create(attrs.id, $element, viewCollection);
            }
        };
    }]);
/*! Hammer.JS - v1.0.6dev - 2013-07-31
 * http://eightmedia.github.com/hammer.js
 *
 * Copyright (c) 2013 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */

(function(window, undefined) {
    'use strict';

/**
 * Hammer
 * use this to create instances
 * @param   {HTMLElement}   element
 * @param   {Object}        options
 * @returns {Hammer.Instance}
 * @constructor
 */
var Hammer = function(element, options) {
    return new Hammer.Instance(element, options || {});
};

// default settings
Hammer.defaults = {
    // add styles and attributes to the element to prevent the browser from doing
    // its native behavior. this doesnt prevent the scrolling, but cancels
    // the contextmenu, tap highlighting etc
    // set to false to disable this
    stop_browser_behavior: {
		// this also triggers onselectstart=false for IE
        userSelect: 'none',
		// this makes the element blocking in IE10 >, you could experiment with the value
		// see for more options this issue; https://github.com/EightMedia/hammer.js/issues/241
        touchAction: 'none',
		touchCallout: 'none',
        contentZooming: 'none',
        userDrag: 'none',
        tapHighlightColor: 'rgba(0,0,0,0)'
    }

    // more settings are defined per gesture at gestures.js
};

// detect touchevents
Hammer.HAS_POINTEREVENTS = window.navigator.pointerEnabled || window.navigator.msPointerEnabled;
Hammer.HAS_TOUCHEVENTS = ('ontouchstart' in window);

// dont use mouseevents on mobile devices
Hammer.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android|silk/i;
Hammer.NO_MOUSEEVENTS = Hammer.HAS_TOUCHEVENTS && window.navigator.userAgent.match(Hammer.MOBILE_REGEX);

// eventtypes per touchevent (start, move, end)
// are filled by Hammer.event.determineEventTypes on setup
Hammer.EVENT_TYPES = {};

// direction defines
Hammer.DIRECTION_DOWN = 'down';
Hammer.DIRECTION_LEFT = 'left';
Hammer.DIRECTION_UP = 'up';
Hammer.DIRECTION_RIGHT = 'right';

// pointer type
Hammer.POINTER_MOUSE = 'mouse';
Hammer.POINTER_TOUCH = 'touch';
Hammer.POINTER_PEN = 'pen';

// touch event defines
Hammer.EVENT_START = 'start';
Hammer.EVENT_MOVE = 'move';
Hammer.EVENT_END = 'end';

// hammer document where the base events are added at
Hammer.DOCUMENT = window.document;

// plugins namespace
Hammer.plugins = {};

// if the window events are set...
Hammer.READY = false;

/**
 * setup events to detect gestures on the document
 */
function setup() {
    if(Hammer.READY) {
        return;
    }

    // find what eventtypes we add listeners to
    Hammer.event.determineEventTypes();

    // Register all gestures inside Hammer.gestures
    for(var name in Hammer.gestures) {
        if(Hammer.gestures.hasOwnProperty(name)) {
            Hammer.detection.register(Hammer.gestures[name]);
        }
    }

    // Add touch events on the document
    Hammer.event.onTouch(Hammer.DOCUMENT, Hammer.EVENT_MOVE, Hammer.detection.detect);
    Hammer.event.onTouch(Hammer.DOCUMENT, Hammer.EVENT_END, Hammer.detection.detect);

    // Hammer is ready...!
    Hammer.READY = true;
}

/**
 * create new hammer instance
 * all methods should return the instance itself, so it is chainable.
 * @param   {HTMLElement}       element
 * @param   {Object}            [options={}]
 * @returns {Hammer.Instance}
 * @constructor
 */
Hammer.Instance = function(element, options) {
    var self = this;

    // setup HammerJS window events and register all gestures
    // this also sets up the default options
    setup();

    this.element = element;

    // start/stop detection option
    this.enabled = true;

    // merge options
    this.options = Hammer.utils.extend(
        Hammer.utils.extend({}, Hammer.defaults),
        options || {});

    // add some css to the element to prevent the browser from doing its native behavoir
    if(this.options.stop_browser_behavior) {
        Hammer.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior);
    }

    // start detection on touchstart
    Hammer.event.onTouch(element, Hammer.EVENT_START, function(ev) {
        if(self.enabled) {
            Hammer.detection.startDetect(self, ev);
        }
    });

    // return instance
    return this;
};


Hammer.Instance.prototype = {
    /**
     * bind events to the instance
     * @param   {String}      gesture
     * @param   {Function}    handler
     * @returns {Hammer.Instance}
     */
    on: function onEvent(gesture, handler){
        var gestures = gesture.split(' ');
        for(var t=0; t<gestures.length; t++) {
            this.element.addEventListener(gestures[t], handler, false);
        }
        return this;
    },


    /**
     * unbind events to the instance
     * @param   {String}      gesture
     * @param   {Function}    handler
     * @returns {Hammer.Instance}
     */
    off: function offEvent(gesture, handler){
        var gestures = gesture.split(' ');
        for(var t=0; t<gestures.length; t++) {
            this.element.removeEventListener(gestures[t], handler, false);
        }
        return this;
    },


    /**
     * trigger gesture event
     * @param   {String}      gesture
     * @param   {Object}      eventData
     * @returns {Hammer.Instance}
     */
    trigger: function triggerEvent(gesture, eventData){
        // create DOM event
        var event = Hammer.DOCUMENT.createEvent('Event');
		event.initEvent(gesture, true, true);
		event.gesture = eventData;

        // trigger on the target if it is in the instance element,
        // this is for event delegation tricks
        var element = this.element;
        if(Hammer.utils.hasParent(eventData.target, element)) {
            element = eventData.target;
        }

        element.dispatchEvent(event);
        return this;
    },


    /**
     * enable of disable hammer.js detection
     * @param   {Boolean}   state
     * @returns {Hammer.Instance}
     */
    enable: function enable(state) {
        this.enabled = state;
        return this;
    }
};

/**
 * this holds the last move event,
 * used to fix empty touchend issue
 * see the onTouch event for an explanation
 * @type {Object}
 */
var last_move_event = null;


/**
 * when the mouse is hold down, this is true
 * @type {Boolean}
 */
var enable_detect = false;


/**
 * when touch events have been fired, this is true
 * @type {Boolean}
 */
var touch_triggered = false;


Hammer.event = {
    /**
     * simple addEventListener
     * @param   {HTMLElement}   element
     * @param   {String}        type
     * @param   {Function}      handler
     */
    bindDom: function(element, type, handler) {
        var types = type.split(' ');
        for(var t=0; t<types.length; t++) {
            element.addEventListener(types[t], handler, false);
        }
    },


    /**
     * touch events with mouse fallback
     * @param   {HTMLElement}   element
     * @param   {String}        eventType        like Hammer.EVENT_MOVE
     * @param   {Function}      handler
     */
    onTouch: function onTouch(element, eventType, handler) {
		var self = this;

        this.bindDom(element, Hammer.EVENT_TYPES[eventType], function bindDomOnTouch(ev) {
            var sourceEventType = ev.type.toLowerCase();

            // onmouseup, but when touchend has been fired we do nothing.
            // this is for touchdevices which also fire a mouseup on touchend
            if(sourceEventType.match(/mouse/) && touch_triggered) {
                return;
            }

            // mousebutton must be down or a touch event
            else if( sourceEventType.match(/touch/) ||   // touch events are always on screen
                sourceEventType.match(/pointerdown/) || // pointerevents touch
                (sourceEventType.match(/mouse/) && ev.which === 1)   // mouse is pressed
            ){
                enable_detect = true;
            }

            // mouse isn't pressed
            else if(sourceEventType.match(/mouse/) && ev.which !== 1) {
                enable_detect = false;
            }


            // we are in a touch event, set the touch triggered bool to true,
            // this for the conflicts that may occur on ios and android
            if(sourceEventType.match(/touch|pointer/)) {
                touch_triggered = true;
            }

            // count the total touches on the screen
            var count_touches = 0;

            // when touch has been triggered in this detection session
            // and we are now handling a mouse event, we stop that to prevent conflicts
            if(enable_detect) {
                // update pointerevent
                if(Hammer.HAS_POINTEREVENTS && eventType != Hammer.EVENT_END) {
                    count_touches = Hammer.PointerEvent.updatePointer(eventType, ev);
                }
                // touch
                else if(sourceEventType.match(/touch/)) {
                    count_touches = ev.touches.length;
                }
                // mouse
                else if(!touch_triggered) {
                    count_touches = sourceEventType.match(/up/) ? 0 : 1;
                }

                // if we are in a end event, but when we remove one touch and
                // we still have enough, set eventType to move
                if(count_touches > 0 && eventType == Hammer.EVENT_END) {
                    eventType = Hammer.EVENT_MOVE;
                }
                // no touches, force the end event
                else if(!count_touches) {
                    eventType = Hammer.EVENT_END;
                }

                // store the last move event
                if(count_touches || last_move_event === null) {
                    last_move_event = ev;
                }

                // trigger the handler
                handler.call(Hammer.detection, self.collectEventData(element, eventType, self.getTouchList(last_move_event, eventType), ev));

                // remove pointerevent from list
                if(Hammer.HAS_POINTEREVENTS && eventType == Hammer.EVENT_END) {
                    count_touches = Hammer.PointerEvent.updatePointer(eventType, ev);
                }
            }

            //debug(sourceEventType +" "+ eventType);

            // on the end we reset everything
            if(!count_touches) {
                last_move_event = null;
                enable_detect = false;
                touch_triggered = false;
                Hammer.PointerEvent.reset();
            }
        });
    },


    /**
     * we have different events for each device/browser
     * determine what we need and set them in the Hammer.EVENT_TYPES constant
     */
    determineEventTypes: function determineEventTypes() {
        // determine the eventtype we want to set
        var types;

        // pointerEvents magic
        if(Hammer.HAS_POINTEREVENTS) {
            types = Hammer.PointerEvent.getEvents();
        }
        // on Android, iOS, blackberry, windows mobile we dont want any mouseevents
        else if(Hammer.NO_MOUSEEVENTS) {
            types = [
                'touchstart',
                'touchmove',
                'touchend touchcancel'];
        }
        // for non pointer events browsers and mixed browsers,
        // like chrome on windows8 touch laptop
        else {
            types = [
                'touchstart mousedown',
                'touchmove mousemove',
                'touchend touchcancel mouseup'];
        }

        Hammer.EVENT_TYPES[Hammer.EVENT_START]  = types[0];
        Hammer.EVENT_TYPES[Hammer.EVENT_MOVE]   = types[1];
        Hammer.EVENT_TYPES[Hammer.EVENT_END]    = types[2];
    },


    /**
     * create touchlist depending on the event
     * @param   {Object}    ev
     * @param   {String}    eventType   used by the fakemultitouch plugin
     */
    getTouchList: function getTouchList(ev/*, eventType*/) {
        // get the fake pointerEvent touchlist
        if(Hammer.HAS_POINTEREVENTS) {
            return Hammer.PointerEvent.getTouchList();
        }
        // get the touchlist
        else if(ev.touches) {
            return ev.touches;
        }
        // make fake touchlist from mouse position
        else {
            ev.indentifier = 1;
            return [ev];
        }
    },


    /**
     * collect event data for Hammer js
     * @param   {HTMLElement}   element
     * @param   {String}        eventType        like Hammer.EVENT_MOVE
     * @param   {Object}        eventData
     */
    collectEventData: function collectEventData(element, eventType, touches, ev) {

        // find out pointerType
        var pointerType = Hammer.POINTER_TOUCH;
        if(ev.type.match(/mouse/) || Hammer.PointerEvent.matchType(Hammer.POINTER_MOUSE, ev)) {
            pointerType = Hammer.POINTER_MOUSE;
        }

        return {
            center      : Hammer.utils.getCenter(touches),
            timeStamp   : new Date().getTime(),
            target      : ev.target,
            touches     : touches,
            eventType   : eventType,
            pointerType : pointerType,
            srcEvent    : ev,

            /**
             * prevent the browser default actions
             * mostly used to disable scrolling of the browser
             */
            preventDefault: function() {
                if(this.srcEvent.preventManipulation) {
                    this.srcEvent.preventManipulation();
                }

                if(this.srcEvent.preventDefault) {
                    this.srcEvent.preventDefault();
                }
            },

            /**
             * stop bubbling the event up to its parents
             */
            stopPropagation: function() {
                this.srcEvent.stopPropagation();
            },

            /**
             * immediately stop gesture detection
             * might be useful after a swipe was detected
             * @return {*}
             */
            stopDetect: function() {
                return Hammer.detection.stopDetect();
            }
        };
    }
};

Hammer.PointerEvent = {
    /**
     * holds all pointers
     * @type {Object}
     */
    pointers: {},

    /**
     * get a list of pointers
     * @returns {Array}     touchlist
     */
    getTouchList: function() {
        var self = this;
        var touchlist = [];

        // we can use forEach since pointerEvents only is in IE10
        Object.keys(self.pointers).sort().forEach(function(id) {
            touchlist.push(self.pointers[id]);
        });
        return touchlist;
    },

    /**
     * update the position of a pointer
     * @param   {String}   type             Hammer.EVENT_END
     * @param   {Object}   pointerEvent
     */
    updatePointer: function(type, pointerEvent) {
        if(type == Hammer.EVENT_END) {
            this.pointers = {};
        }
        else {
            pointerEvent.identifier = pointerEvent.pointerId;
            this.pointers[pointerEvent.pointerId] = pointerEvent;
        }

        return Object.keys(this.pointers).length;
    },

    /**
     * check if ev matches pointertype
     * @param   {String}        pointerType     Hammer.POINTER_MOUSE
     * @param   {PointerEvent}  ev
     */
    matchType: function(pointerType, ev) {
        if(!ev.pointerType) {
            return false;
        }

        var types = {};
        types[Hammer.POINTER_MOUSE] = (ev.pointerType == ev.MSPOINTER_TYPE_MOUSE || ev.pointerType == Hammer.POINTER_MOUSE);
        types[Hammer.POINTER_TOUCH] = (ev.pointerType == ev.MSPOINTER_TYPE_TOUCH || ev.pointerType == Hammer.POINTER_TOUCH);
        types[Hammer.POINTER_PEN] = (ev.pointerType == ev.MSPOINTER_TYPE_PEN || ev.pointerType == Hammer.POINTER_PEN);
        return types[pointerType];
    },


    /**
     * get events
     */
    getEvents: function() {
        return [
            'pointerdown MSPointerDown',
            'pointermove MSPointerMove',
            'pointerup pointercancel MSPointerUp MSPointerCancel'
        ];
    },

    /**
     * reset the list
     */
    reset: function() {
        this.pointers = {};
    }
};


Hammer.utils = {
    /**
     * extend method,
     * also used for cloning when dest is an empty object
     * @param   {Object}    dest
     * @param   {Object}    src
	 * @parm	{Boolean}	merge		do a merge
     * @returns {Object}    dest
     */
    extend: function extend(dest, src, merge) {
        for (var key in src) {
			if(dest[key] !== undefined && merge) {
				continue;
			}
            dest[key] = src[key];
        }
        return dest;
    },


    /**
     * find if a node is in the given parent
     * used for event delegation tricks
     * @param   {HTMLElement}   node
     * @param   {HTMLElement}   parent
     * @returns {boolean}       has_parent
     */
    hasParent: function(node, parent) {
        while(node){
            if(node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    },


    /**
     * get the center of all the touches
     * @param   {Array}     touches
     * @returns {Object}    center
     */
    getCenter: function getCenter(touches) {
        var valuesX = [], valuesY = [];

        for(var t= 0,len=touches.length; t<len; t++) {
            valuesX.push(touches[t].pageX);
            valuesY.push(touches[t].pageY);
        }

        return {
            pageX: ((Math.min.apply(Math, valuesX) + Math.max.apply(Math, valuesX)) / 2),
            pageY: ((Math.min.apply(Math, valuesY) + Math.max.apply(Math, valuesY)) / 2)
        };
    },


    /**
     * calculate the velocity between two points
     * @param   {Number}    delta_time
     * @param   {Number}    delta_x
     * @param   {Number}    delta_y
     * @returns {Object}    velocity
     */
    getVelocity: function getVelocity(delta_time, delta_x, delta_y) {
        return {
            x: Math.abs(delta_x / delta_time) || 0,
            y: Math.abs(delta_y / delta_time) || 0
        };
    },


    /**
     * calculate the angle between two coordinates
     * @param   {Touch}     touch1
     * @param   {Touch}     touch2
     * @returns {Number}    angle
     */
    getAngle: function getAngle(touch1, touch2) {
        var y = touch2.pageY - touch1.pageY,
            x = touch2.pageX - touch1.pageX;
        return Math.atan2(y, x) * 180 / Math.PI;
    },


    /**
     * angle to direction define
     * @param   {Touch}     touch1
     * @param   {Touch}     touch2
     * @returns {String}    direction constant, like Hammer.DIRECTION_LEFT
     */
    getDirection: function getDirection(touch1, touch2) {
        var x = Math.abs(touch1.pageX - touch2.pageX),
            y = Math.abs(touch1.pageY - touch2.pageY);

        if(x >= y) {
            return touch1.pageX - touch2.pageX > 0 ? Hammer.DIRECTION_LEFT : Hammer.DIRECTION_RIGHT;
        }
        else {
            return touch1.pageY - touch2.pageY > 0 ? Hammer.DIRECTION_UP : Hammer.DIRECTION_DOWN;
        }
    },


    /**
     * calculate the distance between two touches
     * @param   {Touch}     touch1
     * @param   {Touch}     touch2
     * @returns {Number}    distance
     */
    getDistance: function getDistance(touch1, touch2) {
        var x = touch2.pageX - touch1.pageX,
            y = touch2.pageY - touch1.pageY;
        return Math.sqrt((x*x) + (y*y));
    },


    /**
     * calculate the scale factor between two touchLists (fingers)
     * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
     * @param   {Array}     start
     * @param   {Array}     end
     * @returns {Number}    scale
     */
    getScale: function getScale(start, end) {
        // need two fingers...
        if(start.length >= 2 && end.length >= 2) {
            return this.getDistance(end[0], end[1]) /
                this.getDistance(start[0], start[1]);
        }
        return 1;
    },


    /**
     * calculate the rotation degrees between two touchLists (fingers)
     * @param   {Array}     start
     * @param   {Array}     end
     * @returns {Number}    rotation
     */
    getRotation: function getRotation(start, end) {
        // need two fingers
        if(start.length >= 2 && end.length >= 2) {
            return this.getAngle(end[1], end[0]) -
                this.getAngle(start[1], start[0]);
        }
        return 0;
    },


    /**
     * boolean if the direction is vertical
     * @param    {String}    direction
     * @returns  {Boolean}   is_vertical
     */
    isVertical: function isVertical(direction) {
        return (direction == Hammer.DIRECTION_UP || direction == Hammer.DIRECTION_DOWN);
    },


    /**
     * stop browser default behavior with css props
     * @param   {HtmlElement}   element
     * @param   {Object}        css_props
     */
    stopDefaultBrowserBehavior: function stopDefaultBrowserBehavior(element, css_props) {
        var prop,
            vendors = ['webkit','khtml','moz','Moz','ms','o',''];

        if(!css_props || !element.style) {
            return;
        }

        // with css properties for modern browsers
        for(var i = 0; i < vendors.length; i++) {
            for(var p in css_props) {
                if(css_props.hasOwnProperty(p)) {
                    prop = p;

                    // vender prefix at the property
                    if(vendors[i]) {
                        prop = vendors[i] + prop.substring(0, 1).toUpperCase() + prop.substring(1);
                    }

                    // set the style
                    element.style[prop] = css_props[p];
                }
            }
        }

        // also the disable onselectstart
        if(css_props.userSelect == 'none') {
            element.onselectstart = function() {
                return false;
            };
        }
    }
};


Hammer.detection = {
    // contains all registred Hammer.gestures in the correct order
    gestures: [],

    // data of the current Hammer.gesture detection session
    current: null,

    // the previous Hammer.gesture session data
    // is a full clone of the previous gesture.current object
    previous: null,

    // when this becomes true, no gestures are fired
    stopped: false,


    /**
     * start Hammer.gesture detection
     * @param   {Hammer.Instance}   inst
     * @param   {Object}            eventData
     */
    startDetect: function startDetect(inst, eventData) {
        // already busy with a Hammer.gesture detection on an element
        if(this.current) {
            return;
        }

        this.stopped = false;

        this.current = {
            inst        : inst, // reference to HammerInstance we're working for
            startEvent  : Hammer.utils.extend({}, eventData), // start eventData for distances, timing etc
            lastEvent   : false, // last eventData
            name        : '' // current gesture we're in/detected, can be 'tap', 'hold' etc
        };

        this.detect(eventData);
    },


    /**
     * Hammer.gesture detection
     * @param   {Object}    eventData
     */
    detect: function detect(eventData) {
        if(!this.current || this.stopped) {
            return;
        }

        // extend event data with calculations about scale, distance etc
        eventData = this.extendEventData(eventData);

        // instance options
        var inst_options = this.current.inst.options;

        // call Hammer.gesture handlers
        for(var g=0,len=this.gestures.length; g<len; g++) {
            var gesture = this.gestures[g];

            // only when the instance options have enabled this gesture
            if(!this.stopped && inst_options[gesture.name] !== false) {
                // if a handler returns false, we stop with the detection
                if(gesture.handler.call(gesture, eventData, this.current.inst) === false) {
                    this.stopDetect();
                    break;
                }
            }
        }

        // store as previous event event
        if(this.current) {
            this.current.lastEvent = eventData;
        }

        // endevent, but not the last touch, so dont stop
        if(eventData.eventType == Hammer.EVENT_END && !eventData.touches.length-1) {
            this.stopDetect();
        }

        return eventData;
    },


    /**
     * clear the Hammer.gesture vars
     * this is called on endDetect, but can also be used when a final Hammer.gesture has been detected
     * to stop other Hammer.gestures from being fired
     */
    stopDetect: function stopDetect() {
        // clone current data to the store as the previous gesture
        // used for the double tap gesture, since this is an other gesture detect session
        this.previous = Hammer.utils.extend({}, this.current);

        // reset the current
        this.current = null;

        // stopped!
        this.stopped = true;
    },


    /**
     * extend eventData for Hammer.gestures
     * @param   {Object}   ev
     * @returns {Object}   ev
     */
    extendEventData: function extendEventData(ev) {
        var startEv = this.current.startEvent;

        // if the touches change, set the new touches over the startEvent touches
        // this because touchevents don't have all the touches on touchstart, or the
        // user must place his fingers at the EXACT same time on the screen, which is not realistic
        // but, sometimes it happens that both fingers are touching at the EXACT same time
        if(startEv && (ev.touches.length != startEv.touches.length || ev.touches === startEv.touches)) {
            // extend 1 level deep to get the touchlist with the touch objects
            startEv.touches = [];
            for(var i=0,len=ev.touches.length; i<len; i++) {
                startEv.touches.push(Hammer.utils.extend({}, ev.touches[i]));
            }
        }

        var delta_time = ev.timeStamp - startEv.timeStamp,
            delta_x = ev.center.pageX - startEv.center.pageX,
            delta_y = ev.center.pageY - startEv.center.pageY,
            velocity = Hammer.utils.getVelocity(delta_time, delta_x, delta_y);

        Hammer.utils.extend(ev, {
            deltaTime   : delta_time,

            deltaX      : delta_x,
            deltaY      : delta_y,

            velocityX   : velocity.x,
            velocityY   : velocity.y,

            distance    : Hammer.utils.getDistance(startEv.center, ev.center),
            angle       : Hammer.utils.getAngle(startEv.center, ev.center),
            interimAngle: this.current.lastEvent && Hammer.utils.getAngle(this.current.lastEvent.center, ev.center),
            direction   : Hammer.utils.getDirection(startEv.center, ev.center),
            interimDirection: this.current.lastEvent && Hammer.utils.getDirection(this.current.lastEvent.center, ev.center),

            scale       : Hammer.utils.getScale(startEv.touches, ev.touches),
            rotation    : Hammer.utils.getRotation(startEv.touches, ev.touches),

            startEvent  : startEv
        });

        return ev;
    },


    /**
     * register new gesture
     * @param   {Object}    gesture object, see gestures.js for documentation
     * @returns {Array}     gestures
     */
    register: function register(gesture) {
        // add an enable gesture options if there is no given
        var options = gesture.defaults || {};
        if(options[gesture.name] === undefined) {
            options[gesture.name] = true;
        }

        // extend Hammer default options with the Hammer.gesture options
        Hammer.utils.extend(Hammer.defaults, options, true);

        // set its index
        gesture.index = gesture.index || 1000;

        // add Hammer.gesture to the list
        this.gestures.push(gesture);

        // sort the list by index
        this.gestures.sort(function(a, b) {
            if (a.index < b.index) {
                return -1;
            }
            if (a.index > b.index) {
                return 1;
            }
            return 0;
        });

        return this.gestures;
    }
};


Hammer.gestures = Hammer.gestures || {};

/**
 * Custom gestures
 * ==============================
 *
 * Gesture object
 * --------------------
 * The object structure of a gesture:
 *
 * { name: 'mygesture',
 *   index: 1337,
 *   defaults: {
 *     mygesture_option: true
 *   }
 *   handler: function(type, ev, inst) {
 *     // trigger gesture event
 *     inst.trigger(this.name, ev);
 *   }
 * }

 * @param   {String}    name
 * this should be the name of the gesture, lowercase
 * it is also being used to disable/enable the gesture per instance config.
 *
 * @param   {Number}    [index=1000]
 * the index of the gesture, where it is going to be in the stack of gestures detection
 * like when you build an gesture that depends on the drag gesture, it is a good
 * idea to place it after the index of the drag gesture.
 *
 * @param   {Object}    [defaults={}]
 * the default settings of the gesture. these are added to the instance settings,
 * and can be overruled per instance. you can also add the name of the gesture,
 * but this is also added by default (and set to true).
 *
 * @param   {Function}  handler
 * this handles the gesture detection of your custom gesture and receives the
 * following arguments:
 *
 *      @param  {Object}    eventData
 *      event data containing the following properties:
 *          timeStamp   {Number}        time the event occurred
 *          target      {HTMLElement}   target element
 *          touches     {Array}         touches (fingers, pointers, mouse) on the screen
 *          pointerType {String}        kind of pointer that was used. matches Hammer.POINTER_MOUSE|TOUCH
 *          center      {Object}        center position of the touches. contains pageX and pageY
 *          deltaTime   {Number}        the total time of the touches in the screen
 *          deltaX      {Number}        the delta on x axis we haved moved
 *          deltaY      {Number}        the delta on y axis we haved moved
 *          velocityX   {Number}        the velocity on the x
 *          velocityY   {Number}        the velocity on y
 *          angle       {Number}        the angle we are moving
 *          direction   {String}        the direction we are moving. matches Hammer.DIRECTION_UP|DOWN|LEFT|RIGHT
 *          distance    {Number}        the distance we haved moved
 *          scale       {Number}        scaling of the touches, needs 2 touches
 *          rotation    {Number}        rotation of the touches, needs 2 touches *
 *          eventType   {String}        matches Hammer.EVENT_START|MOVE|END
 *          srcEvent    {Object}        the source event, like TouchStart or MouseDown *
 *          startEvent  {Object}        contains the same properties as above,
 *                                      but from the first touch. this is used to calculate
 *                                      distances, deltaTime, scaling etc
 *
 *      @param  {Hammer.Instance}    inst
 *      the instance we are doing the detection for. you can get the options from
 *      the inst.options object and trigger the gesture event by calling inst.trigger
 *
 *
 * Handle gestures
 * --------------------
 * inside the handler you can get/set Hammer.detection.current. This is the current
 * detection session. It has the following properties
 *      @param  {String}    name
 *      contains the name of the gesture we have detected. it has not a real function,
 *      only to check in other gestures if something is detected.
 *      like in the drag gesture we set it to 'drag' and in the swipe gesture we can
 *      check if the current gesture is 'drag' by accessing Hammer.detection.current.name
 *
 *      @readonly
 *      @param  {Hammer.Instance}    inst
 *      the instance we do the detection for
 *
 *      @readonly
 *      @param  {Object}    startEvent
 *      contains the properties of the first gesture detection in this session.
 *      Used for calculations about timing, distance, etc.
 *
 *      @readonly
 *      @param  {Object}    lastEvent
 *      contains all the properties of the last gesture detect in this session.
 *
 * after the gesture detection session has been completed (user has released the screen)
 * the Hammer.detection.current object is copied into Hammer.detection.previous,
 * this is usefull for gestures like doubletap, where you need to know if the
 * previous gesture was a tap
 *
 * options that have been set by the instance can be received by calling inst.options
 *
 * You can trigger a gesture event by calling inst.trigger("mygesture", event).
 * The first param is the name of your gesture, the second the event argument
 *
 *
 * Register gestures
 * --------------------
 * When an gesture is added to the Hammer.gestures object, it is auto registered
 * at the setup of the first Hammer instance. You can also call Hammer.detection.register
 * manually and pass your gesture object as a param
 *
 */

/**
 * Hold
 * Touch stays at the same place for x time
 * @events  hold
 */
Hammer.gestures.Hold = {
    name: 'hold',
    index: 10,
    defaults: {
        hold_timeout	: 500,
        hold_threshold	: 1
    },
    timer: null,
    handler: function holdGesture(ev, inst) {
        switch(ev.eventType) {
            case Hammer.EVENT_START:
                // clear any running timers
                clearTimeout(this.timer);

                // set the gesture so we can check in the timeout if it still is
                Hammer.detection.current.name = this.name;

                // set timer and if after the timeout it still is hold,
                // we trigger the hold event
                this.timer = setTimeout(function() {
                    if(Hammer.detection.current.name == 'hold') {
                        inst.trigger('hold', ev);
                    }
                }, inst.options.hold_timeout);
                break;

            // when you move or end we clear the timer
            case Hammer.EVENT_MOVE:
                if(ev.distance > inst.options.hold_threshold) {
                    clearTimeout(this.timer);
                }
                break;

            case Hammer.EVENT_END:
                clearTimeout(this.timer);
                break;
        }
    }
};


/**
 * Tap/DoubleTap
 * Quick touch at a place or double at the same place
 * @events  tap, doubletap
 */
Hammer.gestures.Tap = {
    name: 'tap',
    index: 100,
    defaults: {
        tap_max_touchtime	: 250,
        tap_max_distance	: 10,
		tap_always			: true,
        doubletap_distance	: 20,
        doubletap_interval	: 300
    },
    handler: function tapGesture(ev, inst) {
        if(ev.eventType == Hammer.EVENT_END) {
            // previous gesture, for the double tap since these are two different gesture detections
            var prev = Hammer.detection.previous,
				did_doubletap = false;

            // when the touchtime is higher then the max touch time
            // or when the moving distance is too much
            if(ev.deltaTime > inst.options.tap_max_touchtime ||
                ev.distance > inst.options.tap_max_distance) {
                return;
            }

            // check if double tap
            if(prev && prev.name == 'tap' &&
                (ev.timeStamp - prev.lastEvent.timeStamp) < inst.options.doubletap_interval &&
                ev.distance < inst.options.doubletap_distance) {
				inst.trigger('doubletap', ev);
				did_doubletap = true;
            }

			// do a single tap
			if(!did_doubletap || inst.options.tap_always) {
				Hammer.detection.current.name = 'tap';
				inst.trigger(Hammer.detection.current.name, ev);
			}
        }
    }
};


/**
 * Swipe
 * triggers swipe events when the end velocity is above the threshold
 * @events  swipe, swipeleft, swiperight, swipeup, swipedown
 */
Hammer.gestures.Swipe = {
    name: 'swipe',
    index: 40,
    defaults: {
        // set 0 for unlimited, but this can conflict with transform
        swipe_max_touches  : 1,
        swipe_velocity     : 0.7
    },
    handler: function swipeGesture(ev, inst) {
        if(ev.eventType == Hammer.EVENT_END) {
            // max touches
            if(inst.options.swipe_max_touches > 0 &&
                ev.touches.length > inst.options.swipe_max_touches) {
                return;
            }

            // when the distance we moved is too small we skip this gesture
            // or we can be already in dragging
            if(ev.velocityX > inst.options.swipe_velocity ||
                ev.velocityY > inst.options.swipe_velocity) {
                // trigger swipe events
                inst.trigger(this.name, ev);
                inst.trigger(this.name + ev.direction, ev);
            }
        }
    }
};


/**
 * Drag
 * Move with x fingers (default 1) around on the page. Blocking the scrolling when
 * moving left and right is a good practice. When all the drag events are blocking
 * you disable scrolling on that area.
 * @events  drag, drapleft, dragright, dragup, dragdown
 */
Hammer.gestures.Drag = {
    name: 'drag',
    index: 50,
    defaults: {
        drag_min_distance : 10,
        // Set correct_for_drag_min_distance to true to make the starting point of the drag
        // be calculated from where the drag was triggered, not from where the touch started.
        // Useful to avoid a jerk-starting drag, which can make fine-adjustments
        // through dragging difficult, and be visually unappealing.
        correct_for_drag_min_distance : true,
        // set 0 for unlimited, but this can conflict with transform
        drag_max_touches  : 1,
        // prevent default browser behavior when dragging occurs
        // be careful with it, it makes the element a blocking element
        // when you are using the drag gesture, it is a good practice to set this true
        drag_block_horizontal   : false,
        drag_block_vertical     : false,
        // drag_lock_to_axis keeps the drag gesture on the axis that it started on,
        // It disallows vertical directions if the initial direction was horizontal, and vice versa.
        drag_lock_to_axis       : false,
        // drag lock only kicks in when distance > drag_lock_min_distance
        // This way, locking occurs only when the distance has become large enough to reliably determine the direction
        drag_lock_min_distance : 25
    },
    triggered: false,
    handler: function dragGesture(ev, inst) {
        // current gesture isnt drag, but dragged is true
        // this means an other gesture is busy. now call dragend
        if(Hammer.detection.current.name != this.name && this.triggered) {
            inst.trigger(this.name +'end', ev);
            this.triggered = false;
            return;
        }

        // max touches
        if(inst.options.drag_max_touches > 0 &&
            ev.touches.length > inst.options.drag_max_touches) {
            return;
        }

        switch(ev.eventType) {
            case Hammer.EVENT_START:
                this.triggered = false;
                break;

            case Hammer.EVENT_MOVE:
                // when the distance we moved is too small we skip this gesture
                // or we can be already in dragging
                if(ev.distance < inst.options.drag_min_distance &&
                    Hammer.detection.current.name != this.name) {
                    return;
                }

                // we are dragging!
                if(Hammer.detection.current.name != this.name) {
                    Hammer.detection.current.name = this.name;
                    if (inst.options.correct_for_drag_min_distance) {
                        // When a drag is triggered, set the event center to drag_min_distance pixels from the original event center.
                        // Without this correction, the dragged distance would jumpstart at drag_min_distance pixels instead of at 0.
                        // It might be useful to save the original start point somewhere
                        var factor = Math.abs(inst.options.drag_min_distance/ev.distance);
                        Hammer.detection.current.startEvent.center.pageX += ev.deltaX * factor;
                        Hammer.detection.current.startEvent.center.pageY += ev.deltaY * factor;

                        // recalculate event data using new start point
                        ev = Hammer.detection.extendEventData(ev);
                    }
                }

                // lock drag to axis?
                if(Hammer.detection.current.lastEvent.drag_locked_to_axis || (inst.options.drag_lock_to_axis && inst.options.drag_lock_min_distance<=ev.distance)) {
                    ev.drag_locked_to_axis = true;
                }
                var last_direction = Hammer.detection.current.lastEvent.direction;
                if(ev.drag_locked_to_axis && last_direction !== ev.direction) {
                    // keep direction on the axis that the drag gesture started on
                    if(Hammer.utils.isVertical(last_direction)) {
                        ev.direction = (ev.deltaY < 0) ? Hammer.DIRECTION_UP : Hammer.DIRECTION_DOWN;
                    }
                    else {
                        ev.direction = (ev.deltaX < 0) ? Hammer.DIRECTION_LEFT : Hammer.DIRECTION_RIGHT;
                    }
                }

                // first time, trigger dragstart event
                if(!this.triggered) {
                    inst.trigger(this.name +'start', ev);
                    this.triggered = true;
                }

                // trigger normal event
                inst.trigger(this.name, ev);

                // direction event, like dragdown
                inst.trigger(this.name + ev.direction, ev);

                // block the browser events
                if( (inst.options.drag_block_vertical && Hammer.utils.isVertical(ev.direction)) ||
                    (inst.options.drag_block_horizontal && !Hammer.utils.isVertical(ev.direction))) {
                    ev.preventDefault();
                }
                break;

            case Hammer.EVENT_END:
                // trigger dragend
                if(this.triggered) {
                    inst.trigger(this.name +'end', ev);
                }

                this.triggered = false;
                break;
        }
    }
};


/**
 * Transform
 * User want to scale or rotate with 2 fingers
 * @events  transform, pinch, pinchin, pinchout, rotate
 */
Hammer.gestures.Transform = {
    name: 'transform',
    index: 45,
    defaults: {
        // factor, no scale is 1, zoomin is to 0 and zoomout until higher then 1
        transform_min_scale     : 0.01,
        // rotation in degrees
        transform_min_rotation  : 1,
        // prevent default browser behavior when two touches are on the screen
        // but it makes the element a blocking element
        // when you are using the transform gesture, it is a good practice to set this true
        transform_always_block  : false
    },
    triggered: false,
    handler: function transformGesture(ev, inst) {
        // current gesture isnt drag, but dragged is true
        // this means an other gesture is busy. now call dragend
        if(Hammer.detection.current.name != this.name && this.triggered) {
            inst.trigger(this.name +'end', ev);
            this.triggered = false;
            return;
        }

        // atleast multitouch
        if(ev.touches.length < 2) {
            return;
        }

        // prevent default when two fingers are on the screen
        if(inst.options.transform_always_block) {
            ev.preventDefault();
        }

        switch(ev.eventType) {
            case Hammer.EVENT_START:
                this.triggered = false;
                break;

            case Hammer.EVENT_MOVE:
                var scale_threshold = Math.abs(1-ev.scale);
                var rotation_threshold = Math.abs(ev.rotation);

                // when the distance we moved is too small we skip this gesture
                // or we can be already in dragging
                if(scale_threshold < inst.options.transform_min_scale &&
                    rotation_threshold < inst.options.transform_min_rotation) {
                    return;
                }

                // we are transforming!
                Hammer.detection.current.name = this.name;

                // first time, trigger dragstart event
                if(!this.triggered) {
                    inst.trigger(this.name +'start', ev);
                    this.triggered = true;
                }

                inst.trigger(this.name, ev); // basic transform event

                // trigger rotate event
                if(rotation_threshold > inst.options.transform_min_rotation) {
                    inst.trigger('rotate', ev);
                }

                // trigger pinch event
                if(scale_threshold > inst.options.transform_min_scale) {
                    inst.trigger('pinch', ev);
                    inst.trigger('pinch'+ ((ev.scale < 1) ? 'in' : 'out'), ev);
                }
                break;

            case Hammer.EVENT_END:
                // trigger dragend
                if(this.triggered) {
                    inst.trigger(this.name +'end', ev);
                }

                this.triggered = false;
                break;
        }
    }
};


/**
 * Touch
 * Called as first, tells the user has touched the screen
 * @events  touch
 */
Hammer.gestures.Touch = {
    name: 'touch',
    index: -Infinity,
    defaults: {
        // call preventDefault at touchstart, and makes the element blocking by
        // disabling the scrolling of the page, but it improves gestures like
        // transforming and dragging.
        // be careful with using this, it can be very annoying for users to be stuck
        // on the page
        prevent_default: false,

        // disable mouse events, so only touch (or pen!) input triggers events
        prevent_mouseevents: false
    },
    handler: function touchGesture(ev, inst) {
        if(inst.options.prevent_mouseevents && ev.pointerType == Hammer.POINTER_MOUSE) {
            ev.stopDetect();
            return;
        }

        if(inst.options.prevent_default) {
            ev.preventDefault();
        }

        if(ev.eventType ==  Hammer.EVENT_START) {
            inst.trigger(this.name, ev);
        }
    }
};


/**
 * Release
 * Called as last, tells the user has released the screen
 * @events  release
 */
Hammer.gestures.Release = {
    name: 'release',
    index: Infinity,
    handler: function releaseGesture(ev, inst) {
        if(ev.eventType ==  Hammer.EVENT_END) {
            inst.trigger(this.name, ev);
        }
    }
};

// Based off Lo-Dash's excellent UMD wrapper (slightly modified) - https://github.com/bestiejs/lodash/blob/master/lodash.js#L5515-L5543
// some AMD build optimizers, like r.js, check for specific condition patterns like the following:
if(typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // define as an anonymous module
    define(function() {
        return Hammer;
    });
}
// check for `exports` after `define` in case a build optimizer adds an `exports` object
else if(typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = Hammer;
}
else {
    window.Hammer = Hammer;
}
})(this);

angular
    .module('sdk.directives.ccElasticViews')
    .factory('viewCollectionFactory', function(){

        var ViewCollectionFactory = function(views){

                //reconsider, that's because we need to iterate them from outside
                //we probably just want to expose an each function?
                this.views = views;

                this.getViewFromStack = function(id){
                    var result = views.filter(function(view){
                        return view.name === id;
                    });

                    return result.length > 0 ? result[0] : null;
                };

                this.getTopSibling = function(view){
                    var index = views.indexOf(view);
                    var reachedEnd = index === views.length -1;
                    return index === -1 || reachedEnd ? null : views[index + 1];
                };

                this.getBottomSibling = function(view){
                    var index = views.indexOf(view);
                    return index === -1 || index === 0 ? null : views[index - 1];
                };

        };

        return function(views){
            return new ViewCollectionFactory(views);
        };
    });



angular.module('sdk.directives.ccFixedToolbarsView', []);

//this is a generic directive that creates an view with optional fixed
//header and toolbars
angular.module('sdk.directives.ccFixedToolbarsView')
    .directive('ccFixedToolbarsView', function() {

        'use strict';

        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                header: '=',
                footer: '='
            },
            templateUrl: 'src/directives/ccFixedToolbarsView/fixedtoolbarsview.html'
        };
    });
angular.module('sdk.directives.ccFooter', [
    'src/directives/ccFooter/ccfooter.tpl.html',
    'sdk.services.configService'
]);

angular
    .module('sdk.directives.ccFooter')
    .directive('ccFooter', ['configService', function(configService) {

        'use strict';

        var defaultIfUndefined = function(scope, property, defaultVal){
            scope[property] = scope[property] === undefined ? defaultVal : scope[property];
        };

        var ABOUT_PAGES = configService.get('aboutPages');

        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                items: '=?'
            },
            templateUrl: 'src/directives/ccFooter/ccfooter.tpl.html',
            link: function(scope, element, attrs){
                defaultIfUndefined(scope, 'items', ABOUT_PAGES);

                scope.goTo = function(item){
                    window.location.href = '#/pages/' + item.id;
                };
            }
        };
    }]);
angular.module('sdk.directives.ccGoBackButton', ['src/directives/ccGoBackButton/cc-go-back-button.tpl.html']);

angular.module('sdk.directives.ccGoBackButton')
    .directive('ccGoBackButton', ['$window', function($window) {

        'use strict';

        return {
            restrict: 'EA',
            templateUrl: 'src/directives/ccGoBackButton/cc-go-back-button.tpl.html',
            scope: {},
            replace: true,
            link: function($scope, element, attributes, controller){

                $scope.goBack = function(){
                    $window.history.back();
                };
            }
        };
    }]);
angular.module('sdk.directives.ccGoUpButton', ['src/directives/ccGoUpButton/cc-go-up-button.tpl.html']);

angular.module('sdk.directives.ccGoUpButton')
    .directive('ccGoUpButton', ['navigationService', function(navigationService) {

        'use strict';

        return {
            restrict: 'EA',
            templateUrl: 'src/directives/ccGoUpButton/cc-go-up-button.tpl.html',
            scope: {},
            replace: true,
            link: function($scope, element, attributes, controller){

                $scope.goUp = function(){
                    navigationService.goUp();
                };
            }
        };
    }]);
angular.module('sdk.directives.ccInclude', []);

angular.module('sdk.directives.ccInclude')
    .directive('ccInclude', ['$http', '$templateCache', '$compile', function($http, $templateCache, $compile) {

        'use strict';

        return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    var templateUrl = scope.$eval(attributes.ccInclude);
                    $http
                        .get(templateUrl, {cache: $templateCache})
                        .success(function (tplContent) {
                            element.replaceWith($compile(tplContent.trim())(scope));
                        });
                }
            };
    }]);
angular.module('sdk.directives.ccInject', []);

angular
    .module('sdk.directives.ccInject')
    .directive('ccInject', ['$templateCache', '$http', '$compile', 'injectsService', 'deviceService', function($templateCache, $http, $compile, injectsService, deviceService) {

        'use strict';

        return {
            restrict: 'EA',
            replace: true,
            scope: {
                target: '@'
            },
            link: function(scope, element, attrs){
                scope.injectsService = injectsService;
                scope.deviceService = deviceService;

                //if it's an inject on the product page, automatically expose
                //the product to the inject
                if (scope.$parent.product){
                    scope.product = scope.$parent.product;
                }

                var templateUrl = injectsService.getTemplate(scope.target);

                if (templateUrl === null){
                    element.remove();
                }
                else{
                    $http
                        .get(templateUrl, {cache: $templateCache})
                        .success(function (tplContent) {
                            element.replaceWith($compile(tplContent)(scope));
                        });
                }
            }
        };
    }]);
angular.module('sdk.directives.ccIosInputFocusFix', []);
// On iOS, when you focus an input and then rotate the screen, the layout
// tends to mess up. To fix it we force a DOM refresh on orientation change.

angular.module('sdk.directives.ccIosInputFocusFix')
    .directive('ccIosInputFocusFix', ['inputFocusFixConfigService', 'deviceService',
        function(inputFocusFixConfigService, deviceService) {

        'use strict';

        return {
                restrict: 'A',
                link: function (scope, element, attributes, controllers) {
                    window.addEventListener('orientationchange', function() {
                        if ( inputFocusFixConfigService.enabled && deviceService.getOs() === "iOS" ) {
                            setTimeout(function() {
                                document.body.style.display = "none";
                                setTimeout(function() {
                                    document.body.style.display = "block";
                                }, 1);
                            }, 1000);
                            // The number 1000 here is magic, because this hack needs to happen somewhere after the orientationchange.
                            // It is unlikely that orientationchanges will ever exceed 1000ms since devices only get faster and
                            // this is only targeted towards iOS devices which react in a consistent way.
                        }
                    });
                }
            };
    }]);
angular
    .module('sdk.directives.ccIosInputFocusFix')
    .factory('inputFocusFixConfigService', [function(){
        'use strict';

        var self = {};

        self.enabled = false;

        return self;
}]);
angular.module('sdk.directives.ccIosPositionFixedInputFix', []);

//This fixes a pretty well known bug in iOS where elements with fixed positioning
//don't stay fixed if they contain an input element which gets focus, causing the
//virtual keyboard to appear.
//The fix is to toggle between absolute and fixed positioning on focus/blur to cause
//the browser to fixup the broken position:fixed.

//It's inspired by the answers here
//http://stackoverflow.com/questions/7970389/ios-5-fixed-positioning-and-virtual-keyboard

//However, we also had to bind to touchstart to  to cause a blur when the user starts
//scrolling.
angular.module('sdk.directives.ccIosPositionFixedInputFix')
    .directive('ccIosPositionFixedInputFix', ['deviceService', function(deviceService) {

        'use strict';

        var FIXED_ELEMENT_CLASS     = 'cc-fixed-element',
            FIXED_ELEMENT_SELECTOR  = '.' + FIXED_ELEMENT_CLASS;

        return {
                restrict: 'A',
                link: function (scope, element, attributes, controllers) {

                    if(!deviceService.hasPositionFixedSupport()){
                        return;
                    }

                    var fixedElements = document.querySelectorAll(FIXED_ELEMENT_SELECTOR);
                    var $fixedElements = angular.element(fixedElements);
                    var $document = angular.element(document);

                    var makeItAbsolute = function(){
                        $fixedElements.css('position', 'absolute');
                    };

                    var makeItFixed = function(){
                        $fixedElements.css('position', 'fixed');
                    };

                    element.on('focus', function(){
                        makeItAbsolute();
                        
                        var bind = function(){
                            document.activeElement.blur();
                            $document.off('touchstart',bind);
                        };

                        $document.on('touchstart', bind);
                    });

                    element.on('blur', function(){
                        makeItFixed();
                    });
                }
            };
    }]);
angular.module('sdk.directives.ccLazyValidation', []);

angular.module('sdk.directives.ccLazyValidation')
    .directive('ccLazyValidation', function() {

        'use strict';

        var DEBOUNCE_MS     = 2000,
            VALID_CLS       = 'cc-valid',
            INVAID_CLS      = 'cc-invalid';

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function($scope, element, attributes, controller){

                //there are situations where the VALID_CLS/INVALID_CLS needs to be set on the parent
                //rather than directly on the element.
                var notifyElement = attributes.ccLazyValidation === 'parent' ? element.parent() : element;


                var validate = function(){
                    return controller.$valid ? setValid() : setInvalid();
                };

                var debouncedKeyUp = cc.Util.debounce(function(){
                    //if the user deletes all text from the box but
                    //still hasn't moved focus to somewhere else,
                    //don't bother him with complains
                    if (element.val().length > 0){
                        validate();
                    }
                }, DEBOUNCE_MS);

                var setValid = function(){
                    notifyElement.removeClass(INVAID_CLS);
                    notifyElement.addClass(VALID_CLS);
                };

                var setInvalid = function(){
                    notifyElement.removeClass(VALID_CLS);
                    notifyElement.addClass(INVAID_CLS);
                };

                var resetState = function(){
                    notifyElement.removeClass(VALID_CLS);
                    notifyElement.removeClass(INVAID_CLS);
                };

                element.bind('keydown', resetState);
                element.bind('keyup', debouncedKeyUp);
                element.bind('blur', validate);
            }
        };
    });

angular.module('sdk.directives.ccLoadingSpinner', ['src/directives/ccLoadingSpinner/ccloadingspinner.tpl.html']);

angular.module('sdk.directives.ccLoadingSpinner')
    .directive('ccLoadingSpinner', function() {

        'use strict';

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'src/directives/ccLoadingSpinner/ccloadingspinner.tpl.html'
        };
    });
angular.module('sdk.directives.ccScrollFix', []);

angular.module('sdk.directives.ccScrollFix')
    .directive('ccScrollFix', function() {

        'use strict';
        //This code is inspired by https://github.com/joelambert/ScrollFix
        //but was turned into a angular directive

        //It partly works around scrolling issues on iOS where the elastic
        //scrolling comes into our way when using overflow:scroll sub elements

        return {
            restrict: 'A',
            link: function(scope, $element, attrs){

                var startY, 
                    startTopScroll,
                    element = $element[0];

                $element.bind('touchstart', function(event){
                    startY = event.touches[0].pageY;
                    startTopScroll = element.scrollTop;

                    if(startTopScroll <= 0)
                        element.scrollTop = 1;

                    if(startTopScroll + element.offsetHeight >= element.scrollHeight)
                        element.scrollTop = element.scrollHeight - element.offsetHeight - 1;
                });
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
                    return ('scrollTop' in element) ? element.scrollTop : element.scrollY;
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

angular.module('sdk.directives.ccSelectBox', ['src/directives/ccSelectBox/ccselectbox.tpl.html']);

/**
* Creates a mobile friendly select box that delegates to the native picker
* 
* Options:
* 
*   -   `displayValueExp` optional expression that maps values to display values.
*       Can either be a string (e.g. 'some.nested.property') or a function 
*       (e.g. function(value){ return value.some.nested.property; })
*/
angular.module('sdk.directives.ccSelectBox')
    .directive('ccSelectBox', function() {

        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: {
                data: '=',
                propertyName: '=',
                chooseText: '=?',
                failMessage: '=?',
                displayValueExp: '&',
                _selectedValue: '=ngModel'
            },
            require: '?ngModel',
            templateUrl: 'src/directives/ccSelectBox/ccselectbox.tpl.html',
            link: function(scope, element, attrs, ngModelController){

                if (!attrs.ngModel){
                    return;
                }

                var allowNull = attrs.allowNull !== undefined;

                //defines if an empty value should be omitted
                scope._omitNull = attrs.omitNull !== undefined;


                //Not sure, if we are doing the right thing here concerning ngModel.
                //However, it seems to work quite well for now and it's not that much work.

                //What we do is:

                //1. we set up a bi directional binding between the expression provided to ngMode
                //and a isolated scope property called _selectedValue. This way we don't have to
                //use $parent in our template.

                //2. we listen on scope._selectedValue manually and control the ngModelController
                //accordingly

                var unwatch = scope.$watchCollection('data', function(data){
                    
                    //this is the case where we need to set the selectedValue to the first value because it 
                    //previously was null and now we are getting data values and omitNull forces us to set
                    //a non null value
                    if (data.length > 0 && scope._selectedValue === null && scope._omitNull){
                        scope._selectedValue = data[0];
                    }
                    //this is the case where we had a value but it's been removed from the datasource
                    //in that case we either need to set it to null or the first value from the datasource
                    //depending on whether omitNull is true or not
                    else if(data.length > 0){
                        var tempValue = cc.Util.find(data, function(item){
                            return angular.equals(item, scope._selectedValue);
                        });

                        //this is the case where we had a value but it's been removed from the datasource
                        //in that case we either need to set it to null or the first value from the datasource
                        //depending on whether omitNull is true or not
                        if (!tempValue){
                            scope._selectedValue = scope._omitNull ? data[0] : null;
                        }
                        //this is the case where the datasource was changed and an equal value to the previous
                        //selected exists but it's not the same reference
                        else if(tempValue && tempValue !== scope._selectedValue){
                            scope._selectedValue = tempValue;
                        }
                    }
                });

                //we would move this to cc.Util but first it needs to be decoupled from angular.equals()
                var contains = function(arr, obj){
                    for (var i = 0; i < arr.length; i++) {
                        var element = arr[i];
                        if (angular.equals(obj, element)){
                            return true;
                        }
                    }

                    return false;
                };

                var displayValueFormatter = scope.displayValueExp();

                var firstRun = true;
                if (ngModelController){
                    scope.$watch('_selectedValue', function(newValue){
                        ngModelController.$setViewValue(newValue);

                        if (!allowNull && newValue === null){
                            ngModelController.$setValidity('value', false);
                        }
                        else{
                            ngModelController.$setValidity('value', true);
                        }

                        if(firstRun){
                            ngModelController.$setPristine();
                        }

                        firstRun = false;
                    });
                }


                //default display function that will be used if no
                //displayValueExp is given
                scope.displayFn = function(value){ return value; };

                if (angular.isFunction(displayValueFormatter)){
                    scope.displayFn = displayValueFormatter;
                }
                else if (angular.isString(displayValueFormatter)){

                    var properties = displayValueFormatter.split('.');

                    scope.displayFn = function(value){

                        if (!value){
                            return value;
                        }
                        var tempValue = value;
                        properties.forEach(function(node){
                            tempValue = tempValue[node];
                        });

                        return tempValue;
                    };
                }
            }
        };
    });

angular.module('sdk.directives.ccTemplateCode', []);

angular.module('sdk.directives.ccTemplateCode')
    .directive('ccTemplateCode', function() {

        'use strict';

        return {
            restrict: 'A',
            controller: function(){},
            compile: function($element){
                $element.removeAttr('cc-template-code');
                //ATTENTION: We need to trim() here. Otherwise AngularJS raises an exception
                //later when we want to use the templateCode in a $compile function. 
                //Be aware that we assume a modern browser 
                //that already ships with a trim function.
                //It's easy to secure that with a polyfill.
                var templateCode = $element.parent().html().trim();
                return function(scope, iElement, iAttrs, controller){
                    controller.templateCode = templateCode;
                };
            }
        };
    });
angular.module('sdk.directives.ccThumbnailBar', ['src/directives/ccThumbnailBar/ccthumbnailbar.tpl.html']);

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

                $scope.$watch('images', function(newValue, oldValue) {
                    // reset the image index when images ref changes
                    if (angular.isArray(newValue)) {
                        $scope.setSelectedImageIndex(0);
                    }
                });
            }],
            templateUrl: 'src/directives/ccThumbnailBar/ccthumbnailbar.tpl.html'
        };
    });

angular.module('sdk.directives.ccVariantSelector', ['src/directives/ccVariantSelector/ccvariantselector.tpl.html']);

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
            templateUrl: 'src/directives/ccVariantSelector/ccvariantselector.tpl.html',
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
                        }
                    }
                });
                

                var findVariant = function(variants, selectedProperties){
                    var filteredVariants = variants.filter(function(variant){
                        for (var property in variant.properties){
                            if (variant.properties[property] !== selectedProperties[property]){
                                return false;
                            }
                        }

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


angular.module('sdk.directives.ccZippy', ['src/directives/ccZippy/cczippy.tpl.html']);

angular.module('sdk.directives.ccZippy')
    .directive('ccZippy', function() {

        'use strict';

        var defaultIfUndefined = function(scope, property, defaultVal){
            scope[property] = scope[property] === undefined ? defaultVal : scope[property];
        };

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                caption: '=?',
                opened: '=?'
            },
            templateUrl: 'src/directives/ccZippy/cczippy.tpl.html',
            link: function(scope, $element, attrs){
                var element = $element[0],
                    $caption = angular.element(element.querySelectorAll('.cc-zippy-caption')[0]),
                    $icon = angular.element(element.querySelectorAll('.cc-zippy-icon')[0]),
                    openedIconClass = 'fa fa-chevron-up',
                    closedIconClass = 'fa fa-chevron-down';

                defaultIfUndefined(scope, 'caption', 'default');

                scope.opened = attrs.initOpened === undefined ? false : (attrs.initOpened === "true");

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
    'sdk.directives.ccSelectBox',
    'sdk.directives.ccCheckBox',
    'sdk.directives.ccAddress',
    'sdk.directives.ccLazyValidation',
    'sdk.directives.ccVariantSelector',
    'sdk.directives.ccThumbnailBar',
    'sdk.directives.ccScrollingShadow',
    'sdk.directives.ccScrollFix',
    'sdk.directives.ccElasticViews',
    'sdk.directives.ccLoadingSpinner',
    'sdk.directives.ccInclude',
    'sdk.directives.ccIosPositionFixedInputFix',
    'sdk.directives.ccIosInputFocusFix',
    'sdk.directives.ccInject',
    'sdk.directives.ccBreadcrumbs',
    'sdk.directives.ccTemplateCode',
    'sdk.directives.ccCategoryTreeView',
    'sdk.directives.ccGoUpButton',
    'sdk.directives.ccGoBackButton'
]);
angular.module('sdk.decorators.$rootScope', []);

    angular
        .module('sdk.decorators.$rootScope')
        .config(['$provide', function($provide){
            $provide.decorator('$rootScope', ['$delegate', function($delegate){


                // we monkey patch the $rootScope to provide a $onRootScope method that
                // just works like the $on method but subscribes to events directly emitted
                // on the $rootScope.
                // While one can directly bind to events emitted on the $rootScope even without
                // such a `$onRootScope` method, this method makes sure that events are automatically
                // unbound when the local scope gets destroyed.
                // This comes in handy when the $rootScope is treated as EventBus
                // and is used for all inter app communication.
                
                // Read this for more info:
                // http://stackoverflow.com/questions/11252780/whats-the-correct-way-to-communicate-between-controllers-in-angularjs/19498009#19498009

                Object.defineProperty($delegate.constructor.prototype, '$onRootScope', {
                    value: function(name, listener){
                        var unsubscribe = $delegate.$on(name, listener);
                        this.$on('$destroy', unsubscribe);
                    },
                    enumerable: false
                });


                return $delegate;
            }]);
        }]);



angular
    .module('sdk.filter.currency', ['sdk.services.configService'])
    .filter('currency', ['configService', function(configService){


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

        var CURRENCY_SIGN = configService.get('currencySign');

        return function(val){

            var currency = CURRENCY_SIGN || '&euro;';

            var currencyKey = cc.Util.findKey(currencyMap, function(item){
                                    return item.synonyms.indexOf(currency) > -1; 
                                }) || 'EUR';

            var currencyChar = currencyMap[currencyKey].character;

            var fixedVal = parseFloat(val).toFixed(2);

            if (currencyKey === 'EUR' ){
                return fixedVal.replace('.', ',') + ' ' + currencyChar;
            }
            else if (currencyKey === 'USD' || currencyKey === 'GBP'){
                return currencyChar + ' ' + fixedVal;
            }
            else{
                return fixedVal;
            }
        };
    }]);

angular.module('sdk.filter',    [
                                    'sdk.filter.currency'
                                ]);

}).call(this, window, window.cc, window.angular);