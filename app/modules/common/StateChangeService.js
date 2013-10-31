angular
    .module('CouchCommerceApp')
    .factory('stateChangeService',['$rootScope', function ($rootScope) {

            'use strict';

            var self = {};

            var map = {
                '-999999': 'unknown',
                '-1'     : 'pages',
                '0'      : 'category',
                '1'      : 'products',
                '2'      : 'product',
                '3'      : 'cart',
                '4'      : 'checkout',
                '5'      : 'summary',
                '6'      : 'thankyou'
            };

            $rootScope.$on('$stateChangeSuccess', function(evt, toRoute, toParams, toLocals, fromRoute, fromParams, fromLocals){

                var originalEvent = {
                    evt: evt,
                    toRoute: toRoute,
                    toParams: toParams,
                    toLocals: toLocals,
                    fromRoute: fromRoute,
                    fromParams: fromParams,
                    fromLocals: fromLocals
                };

                //TODO: I don't think it's the correct way to rely on the screenIndex.
                var previousIndex = fromRoute && fromRoute.screenIndex !== undefined ? fromRoute.screenIndex : minScreenIndex,
                    currentIndex = toRoute && toRoute.screenIndex !== undefined ? toRoute.screenIndex : minScreenIndex;

                var eventData = {
                    move: null,
                    previousIndex: previousIndex,
                    currentIndex: currentIndex,
                    originalEvent: originalEvent
                };

                //we are moving between two category listings
                if(previousIndex === 0 && currentIndex === 0){
                    var fromRouteCategory = fromLocals.globals.category;
                    var toRouteCategory = toLocals.globals.category;

                    if(toRouteCategory.parent === fromRouteCategory){
                        eventData.move = 'categoryToChildCategory';
                        $rootScope.$emit('stateChangeService.stateChangeSuccess', eventData);
                    }
                    else if(fromRouteCategory.parent === toRouteCategory){
                        eventData.move = 'categoryToParentCategory';
                        $rootScope.$emit('stateChangeService.stateChangeSuccess', eventData);
                    }
                    else{
                        eventData.move = 'categoryToCategory';
                        $rootScope.$emit('stateChangeService.stateChangeSuccess', eventData);
                    }
                }
                else{
                    eventData.move = map[previousIndex] + 'To' + cc.Util.capitalize(map[currentIndex]);
                    $rootScope.$emit('stateChangeService.stateChangeSuccess', eventData);
                }
            });

            return self;
        }
    ]);
