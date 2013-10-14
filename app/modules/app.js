

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
    'sdk.directives',
    'sdk.filter',
    'ui.bootstrap',
    // 'angular-carousel',
    'templates'
    ])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

    'use strict';

var categoryStateConfig;

    if (false){

        $stateProvider
            .state('catchEmptyRoot',{
                    url: '/',
                    controller: ['$state', function($state){
                        $state.transitionTo('cat.filled.list');
                    }]
            });

        $stateProvider
            .state('cat',{
                    url: '/cat',
                    templateUrl: 'modules/categories/categorylisting_tablet.tpl.html',
                    controller: 'CategoryControllerTablet',
                    screenIndex: 0,
                    resolve: {
                        category: ['couchService', '$stateParams', function(couchService, $stateParams){
                            return couchService.getCategory($stateParams.category);
                        }]
                    }
            })
            .state('cat.filled',{
                views: {
                    '': {
                        templateUrl: 'modules/categories/categorylisting_content_tablet.tpl.html',
                        controller: ['splitViewDataService', '$scope', 'navigationService', 'splitViewSlideDirectionService', '$state', 'selectionService', '$stateParams', function(splitViewDataService, $scope, navigationService, splitViewSlideDirectionService, $state, selectionService, $stateParams){
                            $scope.viewData = splitViewDataService;
                            $scope.splitViewSlideDirectionService = splitViewSlideDirectionService;
                            $scope.$state = $state;

                            $scope.navigateToProduct = function(product, $index, $event){
                                selectionService.select('products_' + $stateParams.category, angular.element($event.currentTarget));
                                navigationService.navigateToProduct(product);
                                splitViewSlideDirectionService.setCurrentIndex($state.current.name, $index);
                            };
                        }]

                    }
                }
            })
            .state('cat.filled.list',{
                url: '/:category',
                views: {
                    '': {
                        templateUrl: 'modules/categories/categorylisting_content_subcategories_tablet.tpl.html',
                        resolve: {
                            category: ['couchService', '$stateParams', function(couchService, $stateParams){
                                return couchService.getCategory($stateParams.category);
                            }]
                        },
                        controller: ['category', '$scope', 'splitViewDataService', '$stateParams', function(category, $scope, splitViewDataService, $stateParams){
                            $scope.viewData = splitViewDataService;

                            splitViewDataService.setLeftBoxAsCategories();
                            splitViewDataService.leftCategory = category.parent || category;
                            //if there is no category in the $stateParams why is this state even activated?
                            //whatever, we don't want the openCategory to be set if there is no $stateParams.category set
                            splitViewDataService.rightCategory = $stateParams.category && category;
                        }]
                    }
                }
            })
            .state('cat.filled.products',{
                url: '/:category/products',
                views: {
                    '': {
                        templateUrl: 'modules/products/products_tablet.tpl.html',
                        resolve: {
                            category: ['couchService', '$stateParams', function(couchService, $stateParams){
                                return couchService.getCategory($stateParams.category);
                            }],
                            products: ['couchService', '$stateParams', function(couchService, $stateParams){
                                return couchService.getProducts($stateParams.category);
                            }]
                        },
                        controller: ['category', 'products', '$scope', 'splitViewDataService', 'navigationService', 'splitViewSlideDirectionService', '$state', function(category, products, $scope, splitViewDataService, navigationService, splitViewSlideDirectionService, $state){
                            //splitViewDataService.category = category.parent || category;
                            $scope.viewData = splitViewDataService;
                            splitViewDataService.leftCategory = category.parent;
                            splitViewDataService.setLeftBoxAsCategories();
                            splitViewDataService.rightCategory = null;
                            splitViewDataService.products = products;
                            $scope.navigateToProduct = function(product, $index){
                                navigationService.navigateToProduct(product);
                                splitViewSlideDirectionService.setCurrentIndex($state.current.name, $index);
                            };
                            //$scope.navigationService = navigationService;
                            //$scope.splitViewSlideDirectionService = splitViewSlideDirectionService;
                        }]
                    }
                }
            })
            .state('cat.filled.product',{
                url: '/:category/product/:productUrlKey',
                views: {
                    '': {
                        templateUrl: 'modules/product/product_tablet.tpl.html',
                        resolve: {
                            products: ['couchService', '$stateParams', function(couchService, $stateParams){
                                return couchService.getProducts($stateParams.category);
                            }],
                            product: ['couchService', '$stateParams', function(couchService, $stateParams){
                                return couchService.getProduct($stateParams.category, $stateParams.productUrlKey);
                            }]
                        },
                        controller: 'ProductControllerTablet'
                    }
                }
            });

    }
    else {
        categoryStateConfig = {
                url: '/',
                templateUrl: 'modules/categories/categorylisting_phone.tpl.html',
                controller: 'CategoryController',
                screenIndex: 0,
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
    }



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
                screenIndex: 1
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
                screenIndex: 2
            });

        $stateProvider
            .state('cart', {
                url: '/cart',
                templateUrl: 'modules/cart/cart.tpl.html',
                controller: 'CartController',
                screenIndex: 3
            });

        $stateProvider
            .state('checkout', {
                url: '/checkout',
                templateUrl: 'modules/checkout/checkout.tpl.html',
                controller: 'CheckoutController',
                screenIndex: 4
            });

        $stateProvider
            .state('summary', {
                url: '/summary/:token',
                templateUrl: 'modules/summary/summary.tpl.html',
                controller: 'SummaryController',
                screenIndex: 5
            });

        $stateProvider
            .state('thankyou', {
                url: '/thankyou',
                templateUrl: 'modules/thankyou/thankyou.tpl.html',
                controller: function(){},
                screenIndex: 6
            });

        $stateProvider
            .state('pages', {
                url: '/pages/:pageId',
                templateUrl: 'modules/pages/pages.tpl.html',
                controller: 'PagesController as pagesVm',
                screenIndex: -1
            });

        $urlRouterProvider.otherwise('/');
    }])
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
    }]);
