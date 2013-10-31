angular
    .module('CouchCommerceApp')
    .factory('scrollPositionService',['$rootScope', '$location', '$state', '$timeout', 'deviceService', function ($rootScope, $location, $state, $timeout, deviceService) {

            'use strict';

            var self =  {},
                cache = {},
                positionFixed = deviceService.hasPositionFixedSupport(),
                scroller = !positionFixed ? document.body : null;

            $rootScope.$on('$locationChangeStart', function(evt, newUrl, oldUrl){

                if(!scroller){
                    return;
                }

                cache[oldUrl] = {
                    scrollOffset: scroller.scrollTop
                };
            });

            self.setActiveScroller = function(element){
                if (positionFixed){
                    scroller = element;
                }
            };

            $rootScope.$on('stateChangeService.stateChangeSuccess', function(evt, data){

                var url         = null,
                    cachedValue = null;

                if (    data.move === 'productToProducts' ||
                        data.move === 'productsToCategory' ||
                        data.move === 'categoryToParentCategory'){

                    url = $location.absUrl();
                    cachedValue = cache[url];
                }

                //TODO:
                //I'm not entirely sure why we need to defer here. In any case, we should
                //use rAF then.
                $timeout(function(){
                    scroller.scrollTop = cachedValue ? cachedValue.scrollOffset : 0;
                },1);
            });

            return self;
        }
    ]);
