'use strict';


angular
    .module('CouchCommerceApp')
    .factory('productService', [function(){
        var self = {};

        self.getImage = function(product, size){
            for (var i = 0; i < product.images.length; i++) {
                if (product.images[i].sizeName.toLowerCase() === size){
                    return product.images[i].url;
                }
            };

            return cc.Config.mediaPlaceholder;
        }

        return self;
}]);


