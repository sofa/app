'use strict';

angular.module('CouchCommerceApp')
.factory('productService', function () {

    var self = {};

    self.getBasePriceInfo = function (product) {
        if (product.getUnit() === 'kg') {
            return 'entspricht ' + product.getBasePriceStr() + ' € pro 1 Kilogramm (kg)';
        }
        else if (product.getUnit() === 'St') {
            return 'entpricht ' + product.getBasePriceStr() + ' € pro 1 Stück (St)';
        }
        else if (product.getUnit() === 'L') {
            return 'entpricht ' + product.getBasePriceStr() + ' € pro 1 Liter (l)';
        }
        else if (product.hasUnit()) {
            return 'entpricht ' + product.getBasePriceStr() + ' € pro ' + product.getUnit();
        }

        return '';
    };
    return self;
});
