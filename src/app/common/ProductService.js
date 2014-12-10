'use strict';

angular
    .module('CouchCommerceApp')
    .factory('productService', function ($filter) {

        var self = {};

        self.getBasePriceInfo = function (product, selectedVariant) {
            if (!product.hasBasePrice()) {
                return '';
            }

            var price = $filter('currency')(product.getBasePriceStr(selectedVariant));

            if (product.getUnit() === 'kg') {
                return 'entspricht ' + price + ' pro 1 Kilogramm (kg)';
            }
            else if (product.getUnit() === 'St') {
                return 'entspricht ' + price + ' pro 1 Stück (St)';
            }
            else if (product.getUnit() === 'L') {
                return 'entspricht ' + price + ' pro 1 Liter (l)';
            }
            else if (product.hasUnit()) {
                return 'entspricht ' + price + ' pro ' + product.getUnit();
            }

            return '';
        };
        return self;
    });
