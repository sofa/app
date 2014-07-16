'use strict';

var walkDir = require('walkdir');
var fs = require('fs');
var Q = require('q');
var _ = require('underscore');

var promises  = [];

var imagesUsedInProductJsons = [];

var filterJsonFileMedia = function (filePath) {

    console.log(filePath);
    var data = require(filePath);

    var deferred = Q.defer();

    data.products.forEach(function (product, pi) {
        product.images.forEach(function (image, ii) {
            data.products[pi].images[ii].url  = data.products[pi].images[ii].url.replace('http://couchcommerce.shopwaredemo.de/media/image/', 'media/product/');
            imagesUsedInProductJsons.push(data.products[pi].images[ii].url);
        });
        product.imagesAlt.forEach(function (image, ii) {
            data.products[pi].imagesAlt[ii].url  = data.products[pi].imagesAlt[ii].url.replace('http://couchcommerce.shopwaredemo.de/media/image/', 'media/product/');
            imagesUsedInProductJsons.push(data.products[pi].imagesAlt[ii].url);
        });
    });

    fs.writeFile(filePath, JSON.stringify(data, null, 4), function (err) {
        if (err) {
            console.log(err);
            deferred.reject(err);
        } else {
            console.log('JSON saved to ' + filePath);
            deferred.resolve();
        }
    });

    return deferred.promise;
};

walkDir.sync('server/products/', function (filePath) {

    promises.push(filterJsonFileMedia(filePath));
    // var name = path.basename(filePath, '.js');
    // routes[name] = require(filePath);
});


var unnecessaryMediaFiles = [];
var localMediaFiles = [];

Q.all(promises).then(function () {
    console.log('All done!');

    walkDir.sync('server/media/product/', function (filePath) {

        filePath = filePath.replace('/Applications/XAMPP/xamppfiles/htdocs/frontend-spike/server/', '');

        localMediaFiles.push(filePath);

    });

    _.each(localMediaFiles, function (img) {
        if (!_.contains(imagesUsedInProductJsons, img)) {
            unnecessaryMediaFiles.push(img);
            fs.unlink('server/' + img, function (err) {
                if (err) {
                    console.error(err);
                }
            });
        }
    });

    console.log('imagesUsedInProductJsons: ', imagesUsedInProductJsons.length);
    console.log('localMediaFiles: ', localMediaFiles.length);
    console.log('unnecessaryMediaFiles: ', unnecessaryMediaFiles.length);

});
