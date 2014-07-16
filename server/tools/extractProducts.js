'use strict';

var categories = require('../../data/local/categories.json');
var _ = require('underscore');
var Q = require('q');
var fs = require('fs');

var getCatJson = function (cat) {
    var deferred = Q.defer();

    var request = require('request');
    request('http://cc1.couchcommerce.com/apiv7/products/?&stid=53787&cat=' + cat.urlId + '&callback=', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var outputFilename = 'server/products/' + cat.urlId + '.json';

            fs.writeFile(outputFilename, body, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('JSON saved to ' + outputFilename);
                    deferred.resolve(body);
                }
            });

        }
        else {
            deferred.reject(error);
        }
    });

    return deferred.promise;
};

var promises = [];

var loopCat = function (cat) {
    if (cat.children) {
        _.each(cat.children, function (cat) {
            loopCat(cat);
        });
    }
    else {
        promises.push(getCatJson(cat));
    }
};

loopCat(categories);

Q.all(promises).then(function () {
    console.log('All done!');
});
