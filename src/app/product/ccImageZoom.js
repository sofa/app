'use strict';
/* global document*/

angular
    .module('CouchCommerceApp')
    .directive('ccImageZoom', function (deviceService, $q, $timeout, ccImageZoomDomActors, ccImageZoomMaskService, ccImageZoomLerpAnim, ccImageZoomSettings) {

            var isTouchedWithNTouches = function (event, numTouches) {
                return event.touches.length === numTouches;
            };

            // This methods calculates the exact absolute position of an element, including scroll offset
            function findPos(obj) {
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
            }

            return {
                restrict: 'A',
                scope: {
                    ngSrc: '@',
                    maskClass: '@',
                    activeClass: '@',
                    zoomAnimDuration: '@'
                },
                link: function (scope, $element, attrs) {

                    if (!ccImageZoomSettings.enabled) {
                        return;
                    }

                    var MASK_CLASS = attrs.maskClass;
                    var ACTIVE_CLASS = attrs.activeClass;
                    var ZOOM_ANIM_DURATION = attrs.zoomAnimDuration ? attrs.zoomAnimDuration : 1000;
                    
                    var body = ccImageZoomDomActors.$body = angular.element(document.body);

                    var $clone;

                    ccImageZoomDomActors.$element = $element;

                    $clone = ccImageZoomDomActors.$clone = $element.clone();

                    $element.css('visibility', 'hidden');
                    $clone.css('visibility', 'hidden');

                    body.append($clone);

                    if (ACTIVE_CLASS) {
                        $clone.addClass(ACTIVE_CLASS);
                    }

                    // We spawn a clone that is invisible. Every time we want to interact with the image,
                    // we transform the clone instead and make it visible.

                    var stateEnum = {
                        SMALL: 1,
                        SMALL_TO_FULL: 2,
                        FULL: 3,
                        FULL_TO_SMALL: 4
                    };

                    var currentState = stateEnum.SMALL;

                    var originalImagePos;

                    var stopScrolling = function (e) {
                        e.preventDefault();
                    };

                    var goFullscreen = function () {

                        // 1. Teleport to the original image
                        // 2. Become visible
                        // 3. Do the transition

                        // Calculate the absolute position of the original image, including scroll
                        originalImagePos = findPos(originalImage);

                        currentState = stateEnum.SMALL_TO_FULL;

                        var aspectRatio = current.width / current.height;
                        var targetHeight;
                        var targetWidth;

                        var offsetX = 0;
                        var offsetY = 0;

                        if (window.innerWidth < window.innerHeight) {
                            targetWidth = window.innerWidth;
                            targetHeight = targetWidth / aspectRatio;
                        } else {
                            targetHeight = window.innerHeight;
                            targetWidth = targetHeight * aspectRatio;
                            offsetX = -(targetWidth - window.innerWidth) / 2;
                        }

                        offsetY = -(targetHeight / 2) + window.innerHeight / 2;

                        ccImageZoomMaskService.addMask(attrs.maskClass);

                        document.body.addEventListener('touchmove', stopScrolling);

                        return lerp({x: offsetX, y: offsetY, w: targetWidth, h: targetHeight}, current)
                                .then(function () {
                                    inAnimation = false;
                                    currentState = stateEnum.FULL;
                                });
                    };

                    var exitFullscreen = function () {
                        currentState = stateEnum.FULL_TO_SMALL;

                        var aspectRatio = imgWidth / imgHeight;
                        var newHeight = imgHeight > parentHeight ? parentHeight : imgHeight;
                        var newWidth = imgHeight * aspectRatio;

                        // Calculate the absolute position of the original image, including scroll
                        originalImagePos = findPos(originalImage);

                        document.body.removeEventListener('touchmove', stopScrolling);

                        return lerp({x: originalImagePos.left, y: originalImagePos.top, w: newWidth, h: newHeight}, current)
                                .then(function () {
                                    inAnimation = false;
                                    currentState = stateEnum.SMALL;

                                    ccImageZoomMaskService.removeMask();
                                });
                    };

                    ccImageZoomMaskService.onClose(exitFullscreen);

                    var updateOpacity = function (width, height) {
                        if (!ccImageZoomMaskService.hasMask()) {
                            return;
                        }

                        var tempw = width / window.innerWidth;
                        var temph = height / window.innerHeight;
                        var currentValue = Math.max(tempw, temph);

                        tempw = imgWidth / window.innerWidth;
                        temph = imgHeight / window.innerHeight;
                        var startValue = Math.max(tempw, temph);

                        var opacity = (currentValue - startValue) / ((1 - startValue) * 0.9);

                        opacity = Math.min(opacity, 1.0);
                        opacity = Math.max(opacity, 0.0);

                        ccImageZoomMaskService.updateOpacity(opacity);
                    };

                    var setImageDimensionsAndVisibility = function (img, left, top, width, height, visible) {
                        img.style.left = left + 'px';
                        img.style.top = top + 'px';
                        img.style.width = width + 'px';
                        img.style.height = height + 'px';
                        img.style.visibility = visible ? 'visible' : 'hidden';
                    };

                    var lerp = function (target, current) {
                        if (inAnimation) {
                            return $q.when();
                        }
                        else {
                            inAnimation = true;

                            var onProgress = function (temp) {
                                setImageDimensionsAndVisibility(cloneImage,
                                    temp.lerpedX,
                                    temp.lerpedY,
                                    temp.lerpedWidth,
                                    temp.lerpedHeight,
                                    true);
                                updateOpacity(temp.lerpedWidth, temp.lerpedHeight);
                            };

                            return ccImageZoomLerpAnim.lerpTo(ZOOM_ANIM_DURATION, imgWidth, target, current, onProgress, function () { scope.$digest(); })
                                    .then(function () {
                                        inAnimation = false;
                                    });
                        }
                    };

                    var panning = false,
                        zooming = false,
                        startX0,
                        startY0,
                        startX1,
                        startY1,
                        startDistanceBetweenFingers,
                        endDistanceBetweenFingers,
                        pinchRatio,
                        imgWidth,
                        imgHeight;


                    var current = {
                        continuousZoom: 1.0,
                        offsetX: 0,
                        offsetY: 0,
                        width: imgWidth,
                        height: imgHeight
                    };

                    var newContinuousZoom,
                        newHeight,
                        newWidth,
                        newOffsetX,
                        newOffsetY;

                    var centerPointStartX,
                        centerPointStartY,
                        centerPointEndX,
                        centerPointEndY;

                    var percentageOfImageAtPinchPointX,
                        percentageOfImageAtPinchPointY;

                    var originalImage = $element[0],
                        cloneImage = $clone[0];

                    var parentWidth = 0,
                        parentHeight = 0;

                    var inAnimation = false;

                    var init = function () {
                        parentWidth = originalImage.parentElement.offsetWidth;
                        parentHeight = originalImage.parentElement.offsetHeight;

                        var aspectRatio = current.width / current.height;

                        imgHeight = current.height = current.height > parentHeight ? parentHeight : current.height;
                        imgWidth = current.width = current.height * aspectRatio;

                        if (imgWidth > parentWidth) {
                            imgWidth = current.width = parentWidth - 20;
                            imgHeight = current.height = current.width / aspectRatio;
                        }

                        // Calculate the absolute position of the original image, including scroll
                        originalImagePos = findPos(originalImage);

                        current.offsetX = originalImagePos.left;
                        current.offsetY = originalImagePos.top;

                        setImageDimensionsAndVisibility(cloneImage,
                            current.offsetX,
                            current.offsetY,
                            current.width,
                            current.height,
                            false);
                    };

                    attrs.$observe('ngSrc', function (newValue) {
                        if (newValue) {
                            // We need the image width and height, so link it to the native onload function
                            // This will automatically be refired when angular changes the src attr
                            originalImage.onload = function () {
                                imgHeight = originalImage.offsetHeight;
                                imgWidth = originalImage.offsetWidth;
                                current.width = imgWidth;
                                current.height = imgHeight;

                                init();

                                $element.css('visibility', 'visible');

                                return true;
                            };

                            cloneImage.src = newValue;
                        }
                    }, true);

                    var touchMoved = false;

                    var touchStart = function (event) {
                        // Let the animation finish before altering the image
                        if (inAnimation) {
                            return;
                        }

                        // Calculate the absolute position of the original image, including scroll
                        originalImagePos = findPos(originalImage);

                        if (currentState !== stateEnum.FULL) {
                            current.offsetX = originalImagePos.left;
                            current.offsetY = originalImagePos.top;
                        }

                        var rect = cloneImage.parentElement.getBoundingClientRect();
                        
                        touchMoved = false;
                        panning = false;
                        zooming = false;

                        if (isTouchedWithNTouches(event, 1)) {
                            panning = true;
                            if (currentState === stateEnum.SMALL || currentState === stateEnum.FULL_TO_SMALL) {
                                return;
                            }
                            startX0 = event.touches[0].pageX - rect.left;
                            startY0 = event.touches[0].pageY - rect.top;
                        }
                        if (isTouchedWithNTouches(event, 2)) {
                            zooming = true;
                            startX0 = event.touches[0].pageX - rect.left;
                            startY0 = event.touches[0].pageY - rect.top;
                            startX1 = event.touches[1].pageX - rect.left;
                            startY1 = event.touches[1].pageY - rect.top;

                            centerPointStartX = ((startX0 + startX1) / 2.0);
                            centerPointStartY = ((startY0 + startY1) / 2.0);

                            percentageOfImageAtPinchPointX = (centerPointStartX - current.offsetX) / current.width;
                            percentageOfImageAtPinchPointY = (centerPointStartY - current.offsetY) / current.height;
                            startDistanceBetweenFingers = Math.sqrt(Math.pow((startX1 - startX0), 2) + Math.pow((startY1 - startY0), 2));
                        }

                        if (isTouchedWithNTouches(event, 2)) {
                            inAnimation = false;
                        }

                        ccImageZoomMaskService.addMask(MASK_CLASS);
                    };

                    $clone.bind('touchstart', touchStart);
                    $element.bind('touchstart', touchStart);

                    var touchmove = function (event) {
                        var endX0,
                            endY0,
                            endX1,
                            endY1,
                            translateFromZoomingX,
                            translateFromZoomingY,
                            translateFromTranslatingX,
                            translateFromTranslatingY,
                            translateTotalX,
                            translateTotalY;

                        var rect = cloneImage.parentElement.getBoundingClientRect();
                        touchMoved = true;

                        if (panning) {
                            if (currentState === stateEnum.SMALL || currentState === stateEnum.FULL_TO_SMALL) {
                                return;
                            }

                            event.preventDefault();
                            endX0 = event.touches[0].pageX - rect.left;
                            endY0 = event.touches[0].pageY - rect.top;
                            translateFromTranslatingX = endX0 - startX0;
                            translateFromTranslatingY = endY0 - startY0;
                            newOffsetX = current.offsetX + translateFromTranslatingX;
                            newOffsetY = current.offsetY + translateFromTranslatingY;
                            cloneImage.style.left = newOffsetX + 'px';
                            cloneImage.style.top = newOffsetY + 'px';

                            updateOpacity(current.width, current.height);
                        } else if (zooming) {

                            event.preventDefault();

                            // Get the new touches
                            endX0 = event.touches[0].pageX - rect.left;
                            endY0 = event.touches[0].pageY - rect.top;
                            endX1 = event.touches[1].pageX - rect.left;
                            endY1 = event.touches[1].pageY - rect.top;

                            // Calculate current distance between points to get new-to-old pinch ratio and calc width and height
                            endDistanceBetweenFingers = Math.sqrt(Math.pow((endX1 - endX0), 2) + Math.pow((endY1 - endY0), 2));
                            pinchRatio = endDistanceBetweenFingers / startDistanceBetweenFingers;
                            newContinuousZoom = pinchRatio * current.continuousZoom;
                            newWidth = imgWidth * newContinuousZoom;
                            newHeight = imgHeight * newContinuousZoom;

                            // Get the point between the two touches, relative to upper-left corner of image
                            centerPointEndX = ((endX0 + endX1) / 2.0);
                            centerPointEndY = ((endY0 + endY1) / 2.0);

                            // This is the translation due to pinch-zooming
                            translateFromZoomingX = (current.width - newWidth) * percentageOfImageAtPinchPointX;
                            translateFromZoomingY = (current.height - newHeight) * percentageOfImageAtPinchPointY;

                            // And this is the translation due to translation of the centerpoint between the two fingers
                            translateFromTranslatingX = centerPointEndX - centerPointStartX;
                            translateFromTranslatingY = centerPointEndY - centerPointStartY;

                            // Total translation is from two components: (1) changing height and width from zooming and (2) from the two fingers translating in unity
                            translateTotalX = translateFromZoomingX + translateFromTranslatingX;
                            translateTotalY = translateFromZoomingY + translateFromTranslatingY;

                            // the new offset is the old/current one plus the total translation component
                            newOffsetX = current.offsetX + translateTotalX;
                            newOffsetY = current.offsetY + translateTotalY;

                            // Set the image attributes on the page
                            setImageDimensionsAndVisibility(cloneImage,
                                newOffsetX,
                                newOffsetY,
                                newWidth,
                                newHeight,
                                true);

                            updateOpacity(newWidth, newHeight);
                        }
                    };

                    $clone.bind('touchmove', touchmove);
                    $element.bind('touchmove', touchmove);

                    var simpleClickZoom = function () {
                        if (!touchMoved) {
                            if (currentState === stateEnum.FULL) {
                                scope.$apply(exitFullscreen);
                            } else if (currentState === stateEnum.SMALL) {
                                scope.$apply(goFullscreen);
                            }
                        }
                    };

                    var touchend = function (event) {

                        if (isTouchedWithNTouches(event, 2)) {
                            inAnimation = false;
                        }

                        if (panning) {
                            panning = false;

                            simpleClickZoom(event);

                            if (currentState === stateEnum.SMALL || currentState === stateEnum.FULL_TO_SMALL) {
                                return;
                            }

                            current.offsetX = newOffsetX;
                            current.offsetY = newOffsetY;
                        } else if (zooming) {
                            zooming = false;
                            current.offsetX = newOffsetX;
                            current.offsetY = newOffsetY;
                            current.width = newWidth;
                            current.height = newHeight;
                            current.continuousZoom = newContinuousZoom;
                        }

                        // If the image is zoomed in > 75% and < 100% of the screen it is likely they want to have it fullscreen
                        // At full screen, never destroy the mask
                        if (current.width / window.innerWidth > 0.75 || current.height / window.innerHeight > 0.75) {
                            if ((current.width / window.innerWidth < 1 && current.height / window.innerHeight < 1)) {
                                scope.$apply(goFullscreen);
                            } else {
                                currentState = stateEnum.FULL;
                            }
                        } else if (!inAnimation) {
                            scope.$apply(exitFullscreen);
                        }

                        touchMoved = false;
                    };

                    $clone.bind('touchend', touchend);
                    $element.bind('touchend', touchend);

                    $clone.bind('touchcancel', function () {
                        if (panning) {
                            panning = false;
                        } else if (zooming) {
                            zooming = false;
                        }
                        ccImageZoomMaskService.removeMask();
                    });

                    // Needed for devices to reposition the image
                    window.addEventListener('orientationchange', function () {
                        if (currentState === stateEnum.FULL) {
                            scope.$apply(goFullscreen);
                        }
                        init();
                    });

                    // Clean up when the directive is destroyed
                    scope.$on('$destroy', function () {
                        if (currentState === stateEnum.FULL) {
                            exitFullscreen()
                            .then(function () {
                                $clone.remove();
                            });
                        }
                        else {
                            $clone.remove();
                        }
                    });

                }
            };
        }
    );