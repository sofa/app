'use strict';

angular.module('CouchCommerceApp')
.factory('productService', function () {

    var self = {};

    self.getBasePriceInfo = function (product, selectedVariant) {
        if (product.getUnit() === 'kg') {
            return 'entspricht ' + product.getBasePriceStr(selectedVariant) + ' € pro 1 Kilogramm (kg)';
        }
        else if (product.getUnit() === 'St') {
            return 'entspricht ' + product.getBasePriceStr(selectedVariant) + ' € pro 1 Stück (St)';
        }
        else if (product.getUnit() === 'L') {
            return 'entspricht ' + product.getBasePriceStr(selectedVariant) + ' € pro 1 Liter (l)';
        }
        else if (product.hasUnit()) {
            return 'entspricht ' + product.getBasePriceStr(selectedVariant) + ' € pro ' + product.getUnit();
        }

        return '';
    };
    return self;
});
