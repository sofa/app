angular
    .module('CouchCommerceApp')
    .factory('slideDirectionService',['$rootScope', '$q', 'couchService', 'pagesService', function ($rootScope, $q, couchService, pagesService) {

            'use strict';

            var direction = 'rtl',
                minScreenIndex = -999999,
                $self = {};


            var aboutPages = cc.Config.aboutPages;

            //assign screen indexes to each page of the pages section.

            //we need to loop through the pages backwards in order to set the correct
            //screen indexes that correlate to the position of the elements in the footer
            var screenIndex = 0;
            for (var i = aboutPages.length - 1; i >= 0; i--) {
                var obj = aboutPages[i];

                if (obj.id){
                    //we don't know how many pages we have. But since we decided to place
                    //all pages on the left boundaries of our app (visually speaking!)
                    //it's quite easy to set up screenIndexes that make sense.
                    //we just iterate over all pages and assign decreasing indexes starting
                    //at -1
                    aboutPages[i].screenIndex = (screenIndex * -1) - 1;
                    screenIndex++;
                }
            }

            $rootScope.$on('$routeChangeSuccess', function(evt, toRoute, fromRoute){

                var previousIndex = fromRoute && fromRoute.$$route && fromRoute.$$route.screenIndex !== undefined ? fromRoute.$$route.screenIndex : minScreenIndex,
                    currentIndex = toRoute && toRoute.$$route && toRoute.$$route.screenIndex !== undefined ? toRoute.$$route.screenIndex : minScreenIndex;

                //we are moving between two category listings
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
                //we are moving between two views of the pages section
                else if (previousIndex === -1 && currentIndex === -1){
                    var fromRoutePageId = fromRoute.params.pageId;
                    var toRoutePageId = toRoute.params.pageId;

                    var fromRouteScreenIndex = pagesService.getPageConfig(fromRoutePageId).screenIndex;
                    var toRouteScreenIndex = pagesService.getPageConfig(toRoutePageId).screenIndex;

                    direction = getDirectionFromIndexes(fromRouteScreenIndex, toRouteScreenIndex);
                }
                else{
                    direction = getDirectionFromIndexes(previousIndex, currentIndex);
                }
            });

            var getDirectionFromIndexes = function(fromIndex, toIndex){
                return toIndex > fromIndex ? 'rtl' : 'ltr';
            };

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
