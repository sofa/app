'use strict';

/**
 *  Utilizes the sofa-image-resize-service to fill the src attribute of an image
 */

angular.module('CouchCommerceApp')
    .directive('ccSrc', function (imageResizeService) {

        return {
            restrict: 'A',
            link: function ($scope, $element, attrs) {

                var imageUrl = $scope.$eval(attrs.ccSrc),
                    opts = $scope.$eval(attrs.ccSrcConfig);

                // TODO: enable this when image resizer is capable of force-dimensions
//                attrs.$set('width', opts.maxwidth);
//                attrs.$set('height', opts.maxheight);

                attrs.$set('src', imageResizeService.resize(imageUrl, opts));

            }
        };
    });
