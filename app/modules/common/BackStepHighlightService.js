angular
    .module('CouchCommerceApp')
    .factory('backStepHighlightService',['$rootScope', '$timeout', function ($rootScope, $timeout) {

            'use strict';

            var self                        = {},
                flaggingDurationMs          = 600,
                flags                       = {},
                timeouts                    = {},
                CATEGORY_SCREEN_INDEX       = 0,
                PRODUCT_LIST_SCREEN_INDEX   = 1,
                PRODUCT_SCREEN_INDEX        = 2;


            $rootScope.$on('$stateChangeSuccess', function(evt, toRoute, toParams, toLocals, fromRoute, fromParams, fromLocals){

                var previousIndex   = fromRoute && fromRoute.screenIndex,
                    currentIndex    = toRoute && toRoute.screenIndex;

                if(previousIndex === PRODUCT_SCREEN_INDEX && currentIndex === PRODUCT_LIST_SCREEN_INDEX){
                    flags.product =  fromLocals.product;
                }
                else if(previousIndex === PRODUCT_LIST_SCREEN_INDEX && currentIndex === CATEGORY_SCREEN_INDEX){
                    flags.category = fromParams.category;
                }
                //TODO: Should we test for a parent child relationship?
                else if(previousIndex === CATEGORY_SCREEN_INDEX && currentIndex === CATEGORY_SCREEN_INDEX) {
                    flags.category = fromParams.category;
                }
            });

            self.isHighlighted = function(item){

                if (item instanceof cc.models.Product){
                    return isHighlighted(item, 'product');
                }
                //we don't have a category model, but the urlId property
                //is unique enough to identify a category
                else if (item && item.urlId){
                    var matcher = function(item, flaggedObject){
                        return item.urlId === flaggedObject;
                    };

                    return isHighlighted(item, 'category', matcher);
                }

                return false;
            };

            var isHighlighted = function(item, prefix, matcher){
                //optinally use provided matcher function
                matcher = matcher || function(a, b) { return a === b };

                var match = matcher(item, flags[prefix]);

                //if the query does not match the flagged object,
                //don't remove the flag. Basically, only remove the flag
                //after a matching query has been made

                if(!match){
                    return false;
                }

                //if there's already a timeout scheduled, don't add a new one to prevent
                //timeouts queueing up

                if (!timeouts[prefix]){
                    timeouts[prefix] = $timeout(function(){
                        flags[prefix] = null;
                        timeouts[prefix] = null;
                    }, flaggingDurationMs);
                }

                return true;
            };

            return self;
        }
    ]);
