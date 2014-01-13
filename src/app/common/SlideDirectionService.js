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


        $rootScope.$on('stateChangeService.stateChangeSuccess', function(evt, data){

            var previousIndex = data.previousIndex,
                currentIndex  = data.currentIndex;

            if(data.move === 'categoryToChildCategory'){
                direction = 'rtl';
            }
            else if(data.move === 'categoryToParentCategory'){
                direction = 'ltr';
            }
            else if(data.move === 'pagesToPages'){
                var fromRoutePageId = data.originalEvent.fromParams.pageId;
                var toRoutePageId = data.originalEvent.toParams.pageId;

                var fromRouteScreenIndex = pagesService.getPageConfig(fromRoutePageId).screenIndex;
                var toRouteScreenIndex = pagesService.getPageConfig(toRoutePageId).screenIndex;

                direction = getDirectionFromIndexes(fromRouteScreenIndex, toRouteScreenIndex);
            }
            else{
                direction = getDirectionFromIndexes(previousIndex, currentIndex);
            }

        });

        var getDirectionFromIndexes = function(fromIndex, toIndex){
            return (toIndex > fromIndex) || (toIndex === fromIndex) ? 'rtl' : 'ltr';
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
