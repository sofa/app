'use strict';

/* global Image */
/* global document */

/**
 *  Utilizes the sofa-image-resize-service to fill the src attribute of an image
 */

angular.module('CouchCommerceApp')
    .directive('ccSrc', function (imageResizeService, $q) {

        var LOADING_CLASS = 'cc-img-loading';

        var lazyLoading = function (imageUrl, opts) {
            var deferred = $q.defer(),
                image = new Image(),
                resizedUrl = imageResizeService.resize(imageUrl, opts);

            image.onload = function () {
                deferred.resolve(resizedUrl);
            };

            image.src = resizedUrl;

            return deferred.promise;
        };

        var elementInViewport = function (el) {
            var rect = el.getBoundingClientRect();

            return (
                rect.top >= 0 && rect.left >= 0 &&
                rect.top <= (window.innerHeight || document.documentElement.clientHeight)
            );
        };

        return {
            restrict: 'A',
            link: function ($scope, $element, attrs) {

                var imageUrl = $scope.$eval(attrs.ccSrc),
                    opts = $scope.$eval(attrs.ccSrcConfig),
                    parent = $element.parent(),
                    showSpinner = attrs.ccSrcSpinner;

                // TODO: enable this when image resizer is capable of force-dimensions
//                attrs.$set('width', opts.maxwidth);
//                attrs.$set('height', opts.maxheight);

                if (showSpinner && elementInViewport($element[0])) {
                    parent.addClass(LOADING_CLASS);
                    lazyLoading(imageUrl, opts).then(function (imageUrl) {
                        parent.removeClass(LOADING_CLASS);
                        attrs.$set('src', imageUrl);
                    });
                } else {
                    attrs.$set('src', imageResizeService.resize(imageUrl, opts));
                }

            }
        };
    });
