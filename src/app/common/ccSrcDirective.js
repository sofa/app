'use strict';

/* global Image */

/**
 *  Utilizes the sofa-image-resize-service to fill the src attribute of an image
 */

angular.module('CouchCommerceApp')
    .directive('ccSrc', function (imageResizeService, $q, configService) {

        var LOADING_CLASS = 'cc-img-loading';

        var placeholderUrl = configService.get('mediaPlaceholder');

        var getResizedImage = function (imageUrl, opts) {
            return imageResizeService.resize(imageUrl, opts);
        };

        var checkImage = function (imageUrl, opts) {
            var deferred = $q.defer(),
                image = new Image(),
                resizedUrl = getResizedImage(imageUrl, opts);

            image.onerror = function () {
                if (placeholderUrl) {
                    deferred.resolve(getResizedImage(placeholderUrl, opts));
                } else {
                    deferred.resolve('');
                }
            };

            image.onload = function () {
                deferred.resolve(resizedUrl);
            };
            image.src = resizedUrl;

            return deferred.promise;
        };

        return {
            restrict: 'A',
            link: function ($scope, $element, attrs) {

                var imageUrl = $scope.$eval(attrs.ccSrc),
                    opts = $scope.$eval(attrs.ccSrcConfig),
                    parent = $element.parent(),
                    showSpinner = attrs.ccSrcSpinner;

                if (showSpinner) {
                    parent.addClass(LOADING_CLASS);
                }
                // TODO: enable this when image resizer is capable of force-dimensions
//                attrs.$set('width', opts.maxwidth);
//                attrs.$set('height', opts.maxheight);

                checkImage(imageUrl, opts).then(function (url) {
                    attrs.$set('src', url);
                    if (showSpinner) {
                        parent.removeClass(LOADING_CLASS);
                    }
                });
            }
        };
    });
