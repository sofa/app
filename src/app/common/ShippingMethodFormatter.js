'use strict';

angular.module('CouchCommerceApp').factory('shippingMethodFormatter', function ($filter) {
    return function (shippingMethod) {

        if (!shippingMethod || !shippingMethod.title) {
            return '';
        }
        return shippingMethod.title + ' (' + $filter('currency')(shippingMethod.price) + ')';
    };
});
