'use strict';
/* global document*/

angular.module('CouchCommerceApp')
       .factory('ccImageZoomDomUtil', function () {

    var self = {};

    // This methods calculates the exact absolute position of an element, including scroll offset
    self.findPos = function (obj) {
        var obj2 = obj;
        var curtop = 0;
        var curleft = 0;
        if (document.getElementById || document.all) {
            do {
                curleft += obj.offsetLeft - obj.scrollLeft;
                curtop += obj.offsetTop - obj.scrollTop;
                obj = obj.offsetParent;
                obj2 = obj2.parentNode;
                while (obj2 !== obj) {
                    curleft -= obj2.scrollLeft;
                    curtop -= obj2.scrollTop;
                    obj2 = obj2.parentNode;
                }
            } while (obj.offsetParent);
        } else if (document.layers) {
            curtop += obj.y;
            curleft += obj.x;
        }
        return {
            top: curtop,
            left: curleft
        };
    };

    self.setImageDimensionsAndVisibility = function (img, left, top, width, height, visible) {
        img.style.left = left + 'px';
        img.style.top = top + 'px';
        img.style.width = width + 'px';
        img.style.height = height + 'px';
        img.style.visibility = visible ? 'visible' : 'hidden';
    };

    return self;
});
