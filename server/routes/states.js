'use strict';

var _ = require('underscore');

var data = require('../data');

module.exports = function (req, res) {

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    });

    if (!req.body.url) {
        res.end(JSON.stringify({
            message: 'bad format'
        }));
        return;
    }

    var isProduct = data.isNameFromAProduct(req.body.url);

    if (isProduct) {

        // Find the category this product belongs to
        var cat = null;
        _.each(data.products, function (value, key) {
            _.each(value.products, function (product) {
                if (product.urlKey === req.body.url) {
                    cat = key;
                }
            });
        });

        if (!cat) {
            res.end('No cat found!');
        }

        res.end(JSON.stringify({
            url: req.body.url,
            stateName: 'product',
            stateParams: {
                category: cat,
                productUrlKey: req.body.url
            }
        }));

    }
    else {
        res.end(JSON.stringify({
            url: req.body.url,
            stateName: 'categories',
            stateParams: {
                category: req.body.url
            }
        }));
    }


};

