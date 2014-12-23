'use strict';

/* global Image */

angular
    .module('CouchCommerceApp')
    .factory('imagePreloadService', function ($q, imageResizeService) {

        var self = this;

        var preloadImage = function (imageUrl) {
            var deferred = $q.defer(),
                img = new Image();

            img.onload = function () {
                deferred.resolve(true);
            };
            img.src = imageUrl;

            return deferred.promise;
        };

        self.getResizedProductImages = function (images, options) {

            var resizedCollection = [];
            var types = [];

            angular.forEach(images, function (image, index) {

                resizedCollection[index] = {};

                angular.forEach(options, function (opts, i) {
                    var typeId = opts.type;
                    var cleanOptions = angular.copy(opts);
                    types[i] = typeId;
                    delete cleanOptions.type;

                    resizedCollection[index][typeId] = {
                        url: imageResizeService.resize(image.url, cleanOptions),
                        loaded: false
                    };
                });
            });

            var queuedLoader = function (imageVariants, collectionIndex, index) {
                if (index + 1 > types.length) {
                    return;
                }
                preloadImage(imageVariants[types[index]].url)
                    .then(function (state) {
                        resizedCollection[collectionIndex][types[index]].loaded = state;
                        queuedLoader(imageVariants, collectionIndex, index + 1);
                    });
            };

            angular.forEach(resizedCollection, function (imageVariants, index) {
                queuedLoader(imageVariants, index, 0);
            });

            return resizedCollection;
        };

        return self;
    });
