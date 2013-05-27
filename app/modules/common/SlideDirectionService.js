angular
    .module('CouchCommerceApp')
    .factory('slideDirectionService',['$rootScope', '$q', 'couchService',function ($rootScope, $q, couchService) {

            'use strict';

            var direction = 'rtl',
                minScreenIndex = -999999,
                $self = {};

            $rootScope.$on('$routeChangeSuccess', function(evt, toRoute, fromRoute){

                var previousIndex = fromRoute && fromRoute.$$route && fromRoute.$$route.screenIndex !== undefined ? fromRoute.$$route.screenIndex : minScreenIndex,
                    currentIndex = toRoute && toRoute.$$route && toRoute.$$route.screenIndex !== undefined ? toRoute.$$route.screenIndex : minScreenIndex;

                //we are moving between to category listings
                if(previousIndex === 0 && currentIndex === 0){
                    var fromRouteCategory = fromRoute.locals.category;
                    var toRouteCategory = toRoute.locals.category;

                    var toRouteIsChild = toRouteCategory.parent === fromRouteCategory;
                    var toRouteIsParent = fromRouteCategory.parent === toRouteCategory;

                    if(toRouteIsChild){
                        direction = 'rtl';
                    }

                    if(toRouteIsParent){
                        direction = 'ltr';
                    }
                }
                else{
                    direction = currentIndex > previousIndex ? 'rtl' : 'ltr';
                }
            });

            $self.getDirection = function(){
                return direction;
            };

            $self.getSlideAnimationConfig = function(){
                return {
                    enter: 'slide-in-' + direction,
                    leave: 'slide-out-' + direction
                };
            };

            return $self;
        }
    ]);
