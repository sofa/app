'use strict';

var _ = require('underscore');

var data = require('../data');

module.exports = function (req, res, next, query) {

    res.writeHead(200, {
        'Content-Type': 'application/javascript'
    });

    var searchResults = [];

    var searchKeyWord = query.q.substr(6).split('* OR reverse_text:')[0];

    _.each(data.products, function (productList, key) {
        _.each(productList.products, function (product) {
            if (product.name.toLowerCase().indexOf(searchKeyWord.toLowerCase()) !== -1) {
                var cat = data.findCatByUrlId(key);
                searchResults.push({
                    'productImageUrl': product.images[0].url,
                    // 'docid': '470_36',
                    'categoryName': cat.label,
                    'text': product.name,
                    'categoryUrlKey': cat.urlId,
                    'productUrlKey': product.urlKey,
                    'productOriginFullUrl': product.originFullUrl,
                    'categoryOriginFullUrl': cat.originFullUrl
                });
            }
        });
    });

    var output = query.callback + '(';

    var result = {
        'matches': searchResults.length,
        'query': query.q,
        'results': searchResults
    };

    output += JSON.stringify(result);
    output += ');';

    res.end(output);

};
