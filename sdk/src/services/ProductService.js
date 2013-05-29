angular.module('sdk.services.productService', []);

angular
    .module('sdk.services.productService')
    .factory('productService', [function(){

        'use strict';

        var self = {};

        self.getImage = function(product, size){
            for (var i = 0; i < product.images.length; i++) {
                if (product.images[i].sizeName.toLowerCase() === size){
                    return product.images[i].url;
                }
            }

            return cc.Config.mediaPlaceholder;
        };

        //TODO: This is pure shit. I need to talk to Felix got get that clean
        //It's only in here to keep some German clients happy that rely on it.
        //We need to make it more flexibile & localizable
        self.getBasePriceInfo = function(product){
            if (product.custom1 > 0){
                if (product.custom3 === 'kg'){
                    return 'entspricht ' + cc.Util.toFixed(product.custom1, 2) + ' € pro 1 Kilogramm (kg)';
                }
                else if (product.custom3 === 'St'){
                    return 'entpricht ' + cc.Util.toFixed(product.custom1, 2) + ' € pro 1 Stück (St)';
                }
                else if (product.custom3 === 'L'){
                    return 'entpricht ' + cc.Util.toFixed(product.custom1, 2) + ' € pro 1 Liter (l)';
                }
                else if (cc.Util.isString(product.custom3) && product.custom3.length > 0){
                    return 'entpricht ' + cc.Util.toFixed(product.custom1, 2) + ' € pro '  + product.custom3;
                }
            }

            return '';
        };

        return self;
}]);


