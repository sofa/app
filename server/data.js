'use strict';

var config = require('../build.config');
var _ = require('underscore');
var walkDir = require('walkdir');
var path = require('path');

var categories = require('../data/local/categories.json');
var products = {};

walkDir.sync('server/products/', function (filePath) {
    var data = require(filePath);
    var baseName = path.basename(filePath, '.json');
    products[baseName] = data;

    // Add a host that matches our port setting
    _.each(products[baseName].products, function (product) {
        _.each(_.union(product.images, product.imagesAlt), function (val, key, arr) {
            arr[key].url = 'http://' + config.server_host + ':' + config.server_port + '/' + arr[key].url; /* jshint ignore:line */
        });
    });

});

var loopAndFindInCat = function (cat, urlId) {
    if (cat.urlId === urlId) {
        return cat;
    }

    var foundCat = null;

    if (cat.children) {
        _.each(cat.children, function (child) {
            if (!foundCat) {
                foundCat = loopAndFindInCat(child, urlId);
            }
        });
    }

    return foundCat;
};

module.exports = {
    products: products,
    categories: categories,
    findCatByUrlId: function (urlId) {
        return loopAndFindInCat(categories, urlId);
    },
    isNameFromAProduct: function (name) {
        return _.some(products, function (product) {
            return _.some(product.products, function (item) {
                return item.urlKey === name;
            });
        });
    }
};
