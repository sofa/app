'use strict';
/* global sofa */
sofa.ProductDecorator = function () {
    return function (product) {
        product = product._source;
        product.urlKey = product.id;

        // TODO: Adjust this in sofa.models.Product.prototype
        product.getOriginFullUrl = function () {
            var data = product.originFullUrl;

            // Legacy, shall we keep it?
            if (sofa.Util.isString(data)) {
                return data;
            }
            // New API
            if (sofa.Util.isArray(data)) {
                if (data.length === 1) {
                    return data[0].product;
                } else if (data.length > 1) {
                    // TODO: find the product URL matching the current category
                } else {
                    // this should not happen, throw exception
                }
            }
        };

        // TODO: Adjust this in sofa.models.Product.prototype
        product.getAllImages = function () {
            return product.images;
        };

        // TODO: Add to sofa.models.Product.prototype
        product.getPrice = function () {
            return product.price.normal;
        };

        // TODO: Add to sofa.models.Product.prototype
        product.getSpecialPrice = function () {
            return product.price.special;
        };

        // TODO: Add to sofa.models.Product.prototype
        product.getVat = function () {
            return product.taxPercent;
        };


//        product.imagesAlt = [];
//        product._price = product.price;
//        product.price = product.price.normal;

//        // Create priceOld property to work with legacy ccPrice directive
//        // TODO: consider updating the sofaPrice directive to make use of price.special
//        // TODO: (sofa.models.Product should also be updated to have a hasSpecialPrice() method instead of hasOldPrice())
//        if (product._price.special && (product._price.special !== product._price.normal)) {
//            product.price = product._price.special;
//            product.priceOld = product._price.normal;
//        }
//
//        product.images = product.images.concat(product.images.splice(0, 3));
//
//        // we need to hardcode that for now since we don't have it in the API
//        product.tax = 19;
//        product.qty = '1';
//
//        sofa.Util.forEach(product.variants, function (variant) {
//            variant.variantID = variant.id;
//            variant._stock = variant.stocks;
//            variant.stock = variant.stocks.online;
//            variant._price = variant.price;
//            variant.price = variant.price.normal;
//
//            // Create priceOld property to work with legacy ccPrice directive
//            // TODO: consider updating the sofaPrice directive to make use of price.special
//            // TODO: (sofa.models.Product should also be updated to have a hasSpecialPrice() method instead of hasOldPrice())
//            if (variant._price.special && (variant._price.special !== variant._price.normal)) {
//                variant.price = variant._price.special;
//                variant.priceOld = variant._price.normal;
//            }
//        });
//
//        product.description = '';
//
        product.categoryUrlId = product.categories.length > 0 ? product.categories[0].id : null;
//
//        var html = '';
//
//        sofa.Util.forEach(product.keyfacts, function (val) {
//            html += '<li>' + val + '</li>';
//        });
//
//        if (html) {
//            html = '<ul>' + html + '</ul>';
//            html += '<p>Artikelnummer: ' + product.articleNumber + '</p>';
//            product.description = html;
//        }
//
        // we mute the attributes for now. Not sure if those are meant to directly bind
        // to the UI. Doesn't seem to be a good fit.
        // TODO: think about how to handle attributes, especially those which are displayed as 'keyFacts' on the product details
        product.attributes = {};

        return product;
    };
};
