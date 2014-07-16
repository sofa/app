'use strict';

var products = require('../data').products;

module.exports = function (req, res, next, query) {

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/javascript',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    });

    if (products[query.cat]) {
        var result = query.callback + '(';
        result += JSON.stringify(products[query.cat]);
        result += ');';

        res.end(result);
    }
    else {
        res.end('No such cat exists!');
    }
};
