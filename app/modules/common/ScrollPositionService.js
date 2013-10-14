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

            $rootScope.$on('$stateChangeSuccess', function(evt, toRoute, toParams, toLocals, fromRoute, fromParams, fromLocals){

                //why does $location.hash() report back an empty string?
                var url     = location.href;
                var cachedValue = cache[url];

                //I'm not entirely sure why we need to defer here. In any case, we should
                //use rAF then.
                $timeout(function(){
                    scroller.scrollTop = cachedValue ? cachedValue.scrollOffset : 0;
                },1);
            });

            return self;
        }
    ]);
