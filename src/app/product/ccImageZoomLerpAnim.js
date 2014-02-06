'use strict';
/* global requestAnimationFrame */

angular.module('CouchCommerceApp')
       .factory('ccImageZoomLerpAnim', function ($q) {

    var self = {};

    self.lerpTo = function (duration, imgWidth, target, current, onProgress, applier) {
        var deferred = $q.defer();

        var startX = current.offsetX;
        var startY = current.offsetY;
        var startW = current.width;
        var startH = current.height;

        var lastFrameTime = (new Date()).getTime();

        var animTime = duration / 1000;
        var currentAnimTime = 0;

        var lerp = function (a, b, alpha) {
            a += (b - a) * alpha;
            return a;
        };

        var easing = function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k;
            }
            return -0.5 * (--k * (k - 2) - 1);
        };

        var tick = function () {

            var currTime = (new Date()).getTime();
            var delta = (currTime - lastFrameTime) / 1000;
            lastFrameTime = currTime;

            currentAnimTime += delta;
            currentAnimTime = Math.min(currentAnimTime, animTime);

            var lerpFactor = currentAnimTime / animTime;

            var currentLerpedX = lerp(startX, target.x, easing(lerpFactor));
            var currentLerpedY = lerp(startY, target.y, easing(lerpFactor));
            var currentLerpedWidth = lerp(startW, target.w, easing(lerpFactor));
            var currentLerpedHeight = lerp(startH, target.h, easing(lerpFactor));

            // We would love to just use deferred.notify here but since in our
            // current version of Angular promises don't resolve outside of a $digest
            // it's more practical to switch to callback style here as manually triggering
            // a $digest with each frame might cause a perf bottleneck.
            // This might be solved once we upgrade to Angular 1.2
            // See: https://github.com/angular/angular.js/commit/6b91aa0a18098100e5f50ea911ee135b50680d67
            onProgress({
                lerpedX:         currentLerpedX,
                lerpedY:         currentLerpedY,
                lerpedWidth:     currentLerpedWidth,
                lerpedHeight:    currentLerpedHeight
            });

            current.offsetX = currentLerpedX;
            current.offsetY = currentLerpedY;
            current.width = currentLerpedWidth;
            current.height = currentLerpedHeight;

            if (currentAnimTime < animTime) {
                requestAnimationFrame(tick);
            } else {
                current.continuousZoom = current.width / imgWidth;
                deferred.resolve();
                // promises don't resolve outside of a $digest in the current angular version
                // TODO: Think about moving this whole thing to old fashioned callback style. :-(
                applier();
            }
        };

        requestAnimationFrame(tick);

        return deferred.promise;
    };

    return self;
});
