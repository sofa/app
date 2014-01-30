'use strict';
/* global document */

angular.module('CouchCommerceApp')
       .factory('ccImageZoomMaskService', function (ccImageZoomDomActors) {

    var self = {},
        mask = null;

    self.addMask = function (maskClass) {

        if (self.hasMask()) {
            return;
        }

        mask = angular.element(document.createElement('div'));

        if (maskClass) {
            mask.addClass(maskClass);
        }

        ccImageZoomDomActors.$body.prepend(mask);

        ccImageZoomDomActors.$element.css('visibility', 'hidden');
        ccImageZoomDomActors.$clone.css('visibility', 'visible');
    };

    self.removeMask = function () {

        if (!self.hasMask()) {
            return;
        }

        mask.remove();
        mask = null;

        ccImageZoomDomActors.$element.css('visibility', 'visible');
        ccImageZoomDomActors.$clone.css('visibility', 'hidden');
    };

    self.hasMask = function () {
        return mask !== null;
    };

    self.updateOpacity = function (opacity) {
        if (!self.hasMask()) {
            return;
        }

        mask.css('opacity', opacity);
    };

    return self;
});
