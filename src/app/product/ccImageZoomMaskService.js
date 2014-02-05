'use strict';
/* global document */

angular.module('CouchCommerceApp')
       .factory('ccImageZoomMaskService', function (ccImageZoomDomActors) {

    var self = {},
        closeFn = null,
        $maskCloseIcon,
        mask = null;

    self.addMask = function (maskClass) {

        if (self.hasMask()) {
            return;
        }

        mask = angular.element(document.createElement('div'));

        $maskCloseIcon = angular
                            .element(document.createElement('i'))
                            .addClass('cc-image-zoom__close-mask-image');

        if (closeFn) {
            $maskCloseIcon.bind('click', closeFn);
        }

        if (maskClass) {
            mask.addClass(maskClass);
        }

        ccImageZoomDomActors.$body.append($maskCloseIcon);

        ccImageZoomDomActors.$body.prepend(mask);

        ccImageZoomDomActors.$element.css('visibility', 'hidden');
        ccImageZoomDomActors.$clone.css('visibility', 'visible');
    };

    self.removeMask = function () {

        if (!self.hasMask()) {
            return;
        }


        if (closeFn) {
            $maskCloseIcon.unbind('click', closeFn);
            $maskCloseIcon.remove();
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
        $maskCloseIcon.css('opacity', opacity);
    };

    //Todo: this is all quite anti angular.
    self.onClose = function (fn) {
        closeFn = fn;
    };

    return self;
});
