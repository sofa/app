'use strict';
/* global sofa */
/* global FastClick */
/* global document */

//we need this to be available in the Angular config phase
//since Angular does not allow access to services in the config
//phase, we need to access it as non angular service for now
cc.deviceService = new cc.DeviceService(window);
//shortHand
cc.isTabletSize = cc.deviceService.isTabletSize();

// this is an empty dummy package. It can be overwritten by simply
// pasting customer specific code through the admin UI
angular.module('CouchCommerceApp.plugins', []);

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
    'pasvaz.bindonce',
    'templates',
    'snap',
    'chayns',
    'CouchCommerceApp.plugins'
])
.config(function ($stateProvider, $urlRouterProvider, screenIndexes, snapRemoteProvider) {

    snapRemoteProvider.globalOptions.disable = 'right';
    snapRemoteProvider.globalOptions.addBodyClasses = true;

    var categoryStateConfig = {
        url: '/',
        templateUrl: cc.isTabletSize ? 'categories/cc-category-grid.tpl.html' : 'categories/cc-category-list.tpl.html',
        controller: 'CategoryController',
        screenIndex: screenIndexes.category,
        resolve: {
            category: ['couchService', '$stateParams', 'navigationService', '$q', function (couchService, $stateParams, navigationService, $q) {

                return couchService
                        .getCategory($stateParams.category)
                        .then(function (category) {
                            //we need to make that check here *before* the CategoryController
                            //is intialized. Otherwise we will have double transitions in such
                            //cases.
                            if (category && !category.children) {
                                navigationService.navigateToProducts(category.urlId);
                                return $q.reject();
                            }
                            return category;
                        });
            }]
        }
    };

    $stateProvider
        .state('categoryempty', categoryStateConfig)
        .state('category', angular.extend({}, categoryStateConfig, { url: '/cat/:category' }))

        .state('products', {
            url: '/cat/:category/products',
            templateUrl: 'products/cc-product-grid.tpl.html',
            controller: 'ProductsController',
            resolve: {
                products: ['couchService', '$stateParams', function (couchService, $stateParams) {
                    return couchService.getProducts($stateParams.category);
                }],
                category: ['couchService', '$stateParams', function (couchService, $stateParams) {
                    return couchService.getCategory($stateParams.category);
                }]
            },
            screenIndex: screenIndexes.products
        })

        .state('product', {
            url: '/cat/:category/product/:productUrlKey',
            templateUrl: 'product/cc-product.tpl.html',
            controller: 'ProductController',
            resolve: {
                product: ['couchService', '$stateParams', function (couchService, $stateParams) {
                    return couchService.getProduct($stateParams.category, $stateParams.productUrlKey);
                }],
                category: ['couchService', '$stateParams', function (couchService, $stateParams) {
                    return couchService.getCategory($stateParams.category);
                }]
            },
            screenIndex: screenIndexes.product
        })

        .state('cart', {
            url: '/cart',
            templateUrl: 'cart/cc-cart.tpl.html',
            controller: 'CartController',
            screenIndex: screenIndexes.cart
        })

        .state('checkout', {
            url: '/checkout',
            templateUrl: 'checkout/cc-checkout.tpl.html',
            controller: 'CheckoutController',
            screenIndex: screenIndexes.checkout
        })

        .state('summary', {
            url: '/summary/:token',
            templateUrl: 'summary/cc-summary.tpl.html',
            controller: 'SummaryController',
            screenIndex: screenIndexes.summary
        });

    var thankyouStateConfig = {
        templateUrl: 'thankyou/cc-thankyou.tpl.html',
        controller: 'ThankyouController',
        screenIndex: screenIndexes.thankyou,
        resolve: {
            summaryResponse: ['checkoutService', function (checkoutService) {
                return checkoutService.getLastSummary();
            }]
        }
    };

    $stateProvider
        .state('thankyou', thankyouStateConfig)

        .state('thankyouWithToken', angular.extend({}, thankyouStateConfig, {
            url: '/thankyou/:token',
            resolve: {
                summaryResponse: ['checkoutService', '$stateParams', function (checkoutService, $stateParams) {
                    return checkoutService.getSummary($stateParams.token);
                }]
            }
        }))

        .state('pages', {
            url: '/pages/:pageId',
            templateUrl: 'pages/pages.tpl.html',
            controller: 'PagesController as pagesVm',
            screenIndex: screenIndexes.pages
        });

    $urlRouterProvider.otherwise('/');
})
//just to kick off the services
.run(['stateChangeService', 'viewClassService', function () { } ])
.run(['$rootScope', '$timeout', '$window', 'slideDirectionService', 'deviceService', 'templateService', function ($rootScope, $timeout, $window, slideDirectionService, deviceService, templateService) {

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
    deviceService.flagOverflowSupport();
    deviceService.flagModernFlexboxSupport();

    $window.addEventListener('orientationchange', $rootScope.$apply, false);

}])
.run(['$rootScope', 'snapRemote', function ($rootScope, snapRemote) {
    $rootScope.$on('$stateChangeStart', function () {
        snapRemote.close();
    });
}])
.run(['deviceService', 'ccImageFullScreenService', 'ccImageZoomSettings', function (deviceService, ccImageFullScreenService, ccImageZoomSettings) {

    //by default, we enable the real zoom. We just disable it for low budget devices
    ccImageZoomSettings.enabled = true;
    ccImageFullScreenService.enabled = false;

    if (deviceService.isStockAndroidBrowser() || !deviceService.hasOverflowSupport()) {
        ccImageFullScreenService.enabled = true;
        ccImageZoomSettings.enabled = false;
    }
}])
.run(function () {
    sofa.Util.domReady(function () {
        FastClick.attach(document.body);
    });
})
.run(['trackingService', 'configService', function (trackingService, configService) {
    trackingService.addTracker(new cc.tracker.GoogleAnalyticsTracker({
        accountNumber: configService.get('googleAnalytics'),
        domainName: configService.get('googleAnalyticsSetDomain'),
        conversionId: configService.get('googleConversionId'),
        conversionLabel: configService.get('googleConversionLabel')
    }));
}]);