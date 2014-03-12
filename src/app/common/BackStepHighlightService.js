'use strict';

angular.module('CouchCommerceApp')
.factory('backStepHighlightService', function ($rootScope) {

    var self = {},
        flags = {},
        reset = false;

    $rootScope.$on('stateChangeService.stateChangeSuccess', function (evt, data) {
        reset = false;
        if (data.move === 'productToProducts') {
            flags.product = data.originalEvent.fromLocals.globals.product;
        } else if (data.move === 'productsToCategory') {
            flags.category = data.originalEvent.fromParams.category;
        } else if (data.move === 'categoryToParentCategory') {
            flags.category = data.originalEvent.fromParams.category;
        } else {
            reset = true;
        }
    });

    self.isHighlighted = function (item) {

        if (item instanceof cc.models.Product) {
            return isHighlighted(item, 'product');
        } else if (item && item.urlId) {
            //we don't have a category model, but the urlId property
            //is unique enough to identify a category
            var matcher = function (item, flaggedObject) {
                return item.urlId === flaggedObject;
            };
            return isHighlighted(item, 'category', matcher);
        }
        return false;
    };

    var isHighlighted = function (item, prefix, matcher) {
        //optionally use provided matcher function
        matcher = matcher || function (a, b) { return a === b; };

        var match = matcher(item, flags[prefix]);

        //if the query does not match the flagged object,
        //don't remove the flag. Basically, only remove the flag
        //after a matching query has been made

        if (!match) {
            return false;
        }

        if (reset) {
            flags[prefix] = null;
            reset = false;
        }
        return true;
    };
    return self;
});
