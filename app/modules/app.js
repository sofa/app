

//we need this to be available in the Angular config phase
//since Angular does not allow access to services in the config
//phase, we need to access it as non angular service for now
cc.deviceService = new cc.DeviceService(window);
//shortHand
cc.isTabletSize = cc.deviceService.isTabletSize();

// Declare app level module which depends on filters, and services
angular.module('CouchCommerceApp', [
    'ngSanitize',
    'ui.state',
    'sdk.decorators.$rootScope',
    'sdk.services.couchService',
    'sdk.services.navigationService',
    'sdk.services.basketService',
    'sdk.services.pagesService',
    'sdk.services.deviceService',
    'sdk.services.checkoutService',
    'sdk.services.userService',
    'sdk.services.configService',
    'sdk.services.searchService',
    'sdk.services.injectsService',
    'sdk.services.trackingService',
    'sdk.services.requestAnimationFrame',
    'sdk.directives',
    'sdk.filter',
    'ui.bootstrap',
    // 'angular-carousel',
    'pasvaz.bindonce',
    'templates'
    ])
    .config(['$stateProvider', '$urlRouterProvider', 'screenIndexes', function($stateProvider, $urlRouterProvider, screenIndexes){

        'use strict';

        var categoryStateConfig = {
                url: '/',
                templateUrl: 'modules/categories/categorylisting_phone.tpl.html',
                controller: 'CategoryController',
                screenIndex: screenIndexes.category,
                resolve: {
                    category: ['couchService', '$stateParams', function(couchService, $stateParams){
                        return couchService.getCategory($stateParams.category);
                    }]
                }
            };

        $stateProvider
            .state('categoryempty', categoryStateConfig);

        $stateProvider
            .state('category', angular.extend({}, categoryStateConfig, { url: '/cat/:category' }));

        $stateProvider
            .state('products', {
                url: '/cat/:category/products',
                templateUrl: 'modules/products/productlisting.tpl.html',
                controller: 'ProductsController',
                resolve: {
                    products: ['couchService', '$stateParams', function(couchService, $stateParams){
                        return couchService.getProducts($stateParams.category);
                    }],
                    category: ['couchService', '$stateParams', function(couchService, $stateParams){
                        return couchService.getCategory($stateParams.category);
                    }]
                },
                screenIndex: screenIndexes.products
            });

        $stateProvider
            .state('product', {
                url: '/cat/:category/product/:productUrlKey',
                templateUrl: 'modules/product/product.tpl.html',
                controller: 'ProductController',
                resolve: {
                    product: ['couchService', '$stateParams', function(couchService, $stateParams){
                        return couchService.getProduct($stateParams.category, $stateParams.productUrlKey);
                    }]
                },
                screenIndex: screenIndexes.product
            });

        $stateProvider
            .state('cart', {
                url: '/cart',
                templateUrl: 'modules/cart/cart.tpl.html',
                controller: 'CartController',
                screenIndex: screenIndexes.cart
            });

        $stateProvider
            .state('checkout', {
                url: '/checkout',
                templateUrl: 'modules/checkout/checkout.tpl.html',
                controller: 'CheckoutController',
                screenIndex: screenIndexes.checkout
            });

        $stateProvider
            .state('summary', {
                url: '/summary/:token',
                templateUrl: 'modules/summary/summary.tpl.html',
                controller: 'SummaryController',
                screenIndex: screenIndexes.summary
            });

        var thankyouStateConfig = {
            templateUrl: 'modules/thankyou/thankyou.tpl.html',
            controller: 'ThankyouController',
            screenIndex: screenIndexes.thankyou,
            resolve: {
                summaryResponse: ['checkoutService', function(checkoutService){
                    return checkoutService.getLastSummary();
                }]
            }
        };

        $stateProvider
            .state('thankyou', thankyouStateConfig);

        $stateProvider
            .state('thankyouWithToken', angular.extend({}, thankyouStateConfig, {
                url: '/thankyou/:token',
                resolve: {
                    summaryResponse: ['checkoutService', '$stateParams', function(checkoutService, $stateParams){
                        return checkoutService.getSummary($stateParams.token);
                    }]
                }
            }));


        $stateProvider
            .state('pages', {
                url: '/pages/:pageId',
                templateUrl: 'modules/pages/pages.tpl.html',
                controller: 'PagesController as pagesVm',
                screenIndex: screenIndexes.pages
            });

        $urlRouterProvider.otherwise('/');
    }])
    //just to kick off the services
    .run(['stateChangeService', 'viewClassService', function(){}])
    .run(['$rootScope', '$timeout', '$window', 'slideDirectionService', 'deviceService', 'templateService', 'scrollPositionService', function($rootScope, $timeout, $window, slideDirectionService, deviceService, templateService, scrollPositionService){

        //Todo: Check what can be moved over to the MainController
        //Most things can, but things like language keys, when used from within
        //an isolated scope, directly turn to the $rootScope (as isolated scopes
        //don't inherit from a parent scope). We can fix this by providing a
        //languageService similar to the configService and then use this for such
        //cases.
        $rootScope.ln = cc.Lang;
        $rootScope.cfg = cc.Config;
        $rootScope.slideDirectionService = slideDirectionService;
        $rootScope.tpl = templateService;

        $rootScope.isTabletSize = cc.isTabletSize;

        //no need to add bindings for things that are unlikely to change over a session;
        deviceService.flagOs();
        deviceService.flagPositionFixedSupport();
        deviceService.flagModernFlexboxSupport();
    }])
    .run(['trackingService', 'configService', function(trackingService, configService){
        trackingService.addTracker(new cc.tracker.GoogleAnalyticsTracker({
            accountNumber: configService.get('googleAnalytics'),
            domainName: configService.get('googleAnalyticsSetDomain'),
            conversionId: configService.get('googleConversionId'),
            conversionLabel: configService.get('googleConversionLabel')
        }));
    }]);
