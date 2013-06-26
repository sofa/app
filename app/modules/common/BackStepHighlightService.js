angular
    .module('CouchCommerceApp')
    .factory('backStepHighlightService',['$rootScope', '$timeout', function ($rootScope, $timeout) {

            'use strict';

            var self                        = {},
                flaggingDurationMs          = 600,
                flaggedProduct              = null,
                flaggedCategoryUrlID        = null,
                productTimeOutToken         = null,
                categoryTimeOutToken        = null,
                CATEGORY_SCREEN_INDEX       = 0,
                PRODUCT_LIST_SCREEN_INDEX   = 1,
                PRODUCT_SCREEN_INDEX        = 2;


            $rootScope.$on('$routeChangeSuccess', function(evt, toRoute, fromRoute){

                var previousIndex   = fromRoute && fromRoute.$$route && fromRoute.$$route.screenIndex,
                    currentIndex    = toRoute && toRoute.$$route && toRoute.$$route.screenIndex;

                if(previousIndex === PRODUCT_SCREEN_INDEX && currentIndex === PRODUCT_LIST_SCREEN_INDEX){
                    flaggedProduct = fromRoute.locals.product;
                }
                else if(previousIndex === PRODUCT_LIST_SCREEN_INDEX && currentIndex === CATEGORY_SCREEN_INDEX){
                    flaggedCategoryUrlID = fromRoute.params.category;
                }
                //TODO: Should we test for a parent child relationship?
                else if(previousIndex === CATEGORY_SCREEN_INDEX && currentIndex === CATEGORY_SCREEN_INDEX) {
                    flaggedCategoryUrlID = fromRoute.params.category;
                }
            });

            self.isHighlighted = function(item){

                if (item instanceof cc.models.Product){
                    return isHighlighted(item, flaggedProduct, productTimeOutToken);
                }
                //we don't have a category model, but the urlId property
                //is unique enough to identify a category
                else if (item && item.urlId){
                    var matcher = function(item, flaggedObject){
                        return item.urlId === flaggedObject;
                    };

                    return isHighlighted(item, flaggedCategoryUrlID, categoryTimeOutToken, matcher);
                }

                return false;
            };

            var isHighlighted = function(item, flaggedObject, timeoutToken, matcher){
                //optinally use provided matcher function
                matcher = matcher || function(a, b) { return a === b };

                var match = matcher(item, flaggedObject);

                //if the query does not match the flagged object,
                //don't remove the flag. Basically, only remove the flag
                //after a matching query has been made

                if(!match){
                    return false;
                }

                //if there's already a timeout scheduled, don't add a new one to prevent
                //timeouts queueing up

                if (!timeoutToken){
                    timeoutToken = $timeout(function(){
                        flaggedObject = null;
                        timeoutToken = null;
                    }, flaggingDurationMs);
                }

                return true;
            };

            return self;
        }
    ]);
