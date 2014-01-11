angular
    .module('CouchCommerceApp')
    .directive('ccImageZoom', ['deviceService',
        function(deviceService) {

            'use strict';

            var EXPANDED_CLS            = 'cc-product-view-image--expanded',
                EXPANDED_VISIBLE_CLS    = 'cc-product-view-image--expanded--visible',
                ANIMATON_DURATION_MS    = 500;

            // Some devices are able to zoom anything. However, since that is out of our control and it ruins the
            // user experience anyway, we enable the full-flavour on those devices as well. Should other undesirable effects
            // arise on other devices we will blacklist those.
            var flavourLevelEnum = {
                SIMPLE: 1,
                FULL: 2
            };

            var flavourLevel = flavourLevelEnum.FULL;

            var os = deviceService.getOs();

            if (os === "Android") {
                if ( deviceService.isStockAndroidBrowser() ) {
                    flavourLevel = flavourLevelEnum.SIMPLE;
                }
            }

            var isTouchedInFullFlavourModeWithCertainAmountOfTouches = function(event, numTouches) {
                return flavourLevel === flavourLevelEnum.FULL && event.touches.length === numTouches;
            };

            return {
                restrict: 'A',
                scope: {
                    image: '='
                },
                link: function(scope, $element, attrs) {

                    scope.$on('$destroy', function() {
                        exitFullscreen();
                    });

                    var body = angular.element(document.body);

                    //This is a rather hacky way and we should better use class markers
                    var appContent = angular.element(document.querySelectorAll('body > div')[0]);

                    var viewWrapper;

                    if (flavourLevel === flavourLevelEnum.SIMPLE) {

                        var parent = $element.parent();
                        $element.remove();
                        $element = parent;


                        scope.$watch('image', function(newValue, oldValue) {
                            $element.css('background-image', 'url('+ newValue +')');
                        });

                        var $clone;

                        var isAllowedToInteract = true;

                        var createHandler = function(){
                            if ( !isAllowedToInteract ) {
                                return;
                            }

                            $clone = $element.clone();
                            $clone.addClass(EXPANDED_CLS);
                            body.append($clone);

                            // We need to set the whole underlying thing to display:none
                            // otherwise on some platforms (Android 2 I'm looking at you)
                            // the content behind the fullscreen image will still be visible
                            // and even scrollable which gives a bad experience.
                            appContent.css('display', 'none');
                            $clone.addClass(EXPANDED_CLS);

                            // The following triggers a reflow which allows for the transition animation to kick in.
                            // JSHint will give us a warning about this since we are not really doing something directly with
                            // the variable yet it is needed for the reflow. JSHint does not allow us to turn off these warnings
                            // so we assign it to a dummy variable
                            var dummy = $clone[0].offsetWidth;

                            $clone.addClass(EXPANDED_VISIBLE_CLS);
                            $clone.bind('click', removeHandler);
                            $clone.bind('touchend', removeHandler);

                            isAllowedToInteract = false;

                            setTimeout(function(){
                                isAllowedToInteract = true;
                            }, ANIMATON_DURATION_MS);
                        };

                        var removeHandler = function(){
                            if ( !isAllowedToInteract ) {
                                return;
                            }

                            appContent.css('display', '');
                            $clone.removeClass(EXPANDED_VISIBLE_CLS);

                            isAllowedToInteract = false;
                            setTimeout(function(){
                                $clone.remove();
                                isAllowedToInteract = true;
                            }, ANIMATON_DURATION_MS);
                        };

                        $element.bind('click', createHandler);
                        $element.bind('touchend', createHandler);

                    }
                    else {
                        var stateEnum = {
                            SMALL: 1,
                            SMALL_TO_FULL: 2,
                            FULL: 3,
                            FULL_TO_SMALL: 4
                        };

                        var currentState = stateEnum.SMALL;

                        var mask = null;

                        var addMask = function() {

                            viewWrapper = angular.element(document.querySelector('.cc-view-wrapper'));

                            mask = angular.element(document.createElement('div'));
                            mask.addClass('cc-product-view-image-mask');

                            viewWrapper.addClass("cc-product-view-image-mask-view-fix");
                            appContent.addClass("cc-product-view-image-mask-app-fix");

                            body.prepend(mask);
                            $element.css("z-index", 1201);

                        };

                        var removeMask = function() {

                            mask.remove();
                            mask = null;
                            viewWrapper.removeClass("cc-product-view-image-mask-view-fix");
                            appContent.removeClass("cc-product-view-image-mask-app-fix");

                        };

                        var stopScrolling = function(e) {
                            e.preventDefault();
                        };

                        var goFullscreen = function() {
                            currentState = stateEnum.SMALL_TO_FULL;

                            var aspectRatio = currentWidth / currentHeight;
                            var targetHeight;
                            var targetWidth;

                            if (window.innerWidth < window.innerHeight) {
                                targetWidth = window.innerWidth;
                                targetHeight = targetWidth / aspectRatio;
                            }
                            else {
                                targetHeight = window.innerHeight;
                                targetWidth = targetHeight * aspectRatio;
                            }

                            var rect = $element[0].parentElement.getBoundingClientRect();

                            var offsetX = window.innerWidth / 2 - targetWidth / 2;
                            var offsetY = window.innerHeight / 2 - targetHeight / 2;

                            lerpToPosition(-rect.left + offsetX, -rect.top + offsetY, targetWidth, targetHeight, function() {
                                currentState = stateEnum.FULL;
                            });

                            if (!mask) {
                                addMask();
                            }

                            document.body.addEventListener('touchmove', stopScrolling);
                        };

                        var exitFullscreen = function() {
                            currentState = stateEnum.FULL_TO_SMALL;

                            var aspectRatio = imgWidth / imgHeight;
                            var newHeight = imgHeight > parentHeight ? parentHeight : imgHeight;
                            var newWidth = imgHeight * aspectRatio;

                            var newOffsetX = (parentWidth / 2) - (newWidth / 2);
                            var newOffsetY = (parentHeight / 2) - (newHeight / 2);

                            lerpToPosition(newOffsetX, newOffsetY, newWidth, newHeight, function() {
                                currentState = stateEnum.SMALL;

                                if (mask) {
                                    removeMask();
                                }
                            });

                            document.body.removeEventListener('touchmove', stopScrolling);
                        };

                        var updateOpacity = function(width, height) {
                            if (!mask) return;

                            var tempw = width / window.innerWidth;
                            var temph = height / window.innerHeight;
                            var currentValue = Math.max(tempw, temph);

                            tempw = imgWidth / window.innerWidth;
                            temph = imgHeight / window.innerHeight;
                            var startValue = Math.max(tempw, temph);

                            var opacity = (currentValue - startValue) / ((1 - startValue) * 0.9);

                            opacity = Math.min(opacity, 1.0);
                            opacity = Math.max(opacity, 0.0);

                            mask.css("opacity", opacity);
                        };

                        var setImageDimensionsAndVisibility = function(img, left, top, width, height){
                            img.style.left = left + 'px';
                            img.style.top = top + 'px';
                            img.style.width = width + 'px';
                            img.style.height = height + 'px';
                            img.style.visibility = 'visible';
                        };

                        var lerpToPosition = function(targetX, targetY, targetW, targetH, done, interrupt) {
                            if (inAnimation) return;

                            var startX = currentOffsetX;
                            var startY = currentOffsetY;
                            var startW = currentWidth;
                            var startH = currentHeight;

                            var lastFrameTime = (new Date()).getTime();

                            var animTime = 0.5;
                            var currentAnimTime = 0;

                            inAnimation = true;

                            var lerp = function(a, b, alpha) {
                                a += (b - a) * alpha;
                                return a;
                            };

                            var easing = function(k) {
                                if ((k *= 2) < 1) return 0.5 * k * k;
                                return -0.5 * (--k * (k - 2) - 1);
                            };

                            var tick = function() {

                                var currTime = (new Date()).getTime();
                                var delta = (currTime - lastFrameTime) / 1000;
                                lastFrameTime = currTime;

                                currentAnimTime += delta;
                                currentAnimTime = Math.min(currentAnimTime, animTime);

                                var lerpFactor = currentAnimTime / animTime;

                                var currentLerpedX = lerp(startX, targetX, easing(lerpFactor));
                                var currentLerpedY = lerp(startY, targetY, easing(lerpFactor));
                                var currentLerpedWidth = lerp(startW, targetW, easing(lerpFactor));
                                var currentLerpedHeight = lerp(startH, targetH, easing(lerpFactor));

                                setImageDimensionsAndVisibility(theImage,
                                                                currentLerpedX,
                                                                currentLerpedY,
                                                                currentLerpedWidth,
                                                                currentLerpedHeight);

                                if (currentAnimTime < animTime && inAnimation) {
                                    updateOpacity(currentLerpedWidth, currentLerpedHeight);
                                    requestAnimationFrame(tick);
                                }
                                else {
                                    currentOffsetX = currentLerpedX;
                                    currentOffsetY = currentLerpedY;
                                    currentWidth = currentLerpedWidth;
                                    currentHeight = currentLerpedHeight;
                                    currentContinuousZoom = currentWidth / imgWidth;

                                    if (inAnimation) {
                                        inAnimation = false;

                                        if (done) {
                                            done();
                                        }
                                    }
                                    else {
                                        if (interrupt) {
                                            interrupt();
                                        }
                                    }
                                }
                            };

                            requestAnimationFrame(tick);
                        };

                        var panning = false,
                            zooming = false,
                            startX0,
                            startY0,
                            startX1,
                            startY1,
                            endX0,
                            endY0,
                            endX1,
                            endY1,
                            startDistanceBetweenFingers,
                            endDistanceBetweenFingers,
                            pinchRatio,
                            imgWidth,
                            imgHeight;

                        var currentContinuousZoom = 1.0,
                            currentOffsetX = 0,
                            currentOffsetY = 0,
                            currentWidth = imgWidth,
                            currentHeight = imgHeight;

                        var newContinuousZoom,
                            newHeight,
                            newWidth,
                            newOffsetX,
                            newOffsetY;

                        var centerPointStartX,
                            centerPointStartY,
                            centerPointEndX,
                            centerPointEndY,
                            translateFromZoomingX,
                            translateFromZoomingY,
                            translateFromTranslatingX,
                            translateFromTranslatingY,
                            translateTotalX,
                            translateTotalY;

                        var percentageOfImageAtPinchPointX,
                            percentageOfImageAtPinchPointY;

                        var theImage = $element[0];

                        var parentWidth = 0,
                            parentHeight = 0;

                        var inAnimation = false;

                        var init = function() {
                            parentWidth = $element[0].parentElement.offsetWidth;
                            parentHeight = $element[0].parentElement.offsetHeight;

                            var aspectRatio = currentWidth / currentHeight;

                            imgHeight = currentHeight = currentHeight > parentHeight ? parentHeight : currentHeight;
                            imgWidth = currentWidth = currentHeight * aspectRatio;

                            if (imgWidth > parentWidth) {
                                imgWidth = currentWidth = parentWidth - 20;
                                imgHeight = currentHeight = currentWidth / aspectRatio;
                            }

                            currentOffsetX = (parentWidth / 2) - (currentWidth / 2);
                            currentOffsetY = (parentHeight / 2) - (currentHeight / 2);


                            theImage.style.left = currentOffsetX + 'px';
                            theImage.style.top = currentOffsetY + 'px';
                            theImage.style.width = currentWidth + 'px';
                            theImage.style.height = currentHeight + 'px';

                            setImageDimensionsAndVisibility(theImage,
                                currentOffsetX,
                                currentOffsetY,
                                currentWidth,
                                currentHeight);
                        };

                        scope.$watch('image', function(newValue, oldValue) {

                            if (newValue) {

                                // We need the image with and height, so link it to the native onload function
                                // This will automatically be refired when angular changes the src attr
                                $element[0].onload = function() {
                                    imgHeight = this.height;
                                    imgWidth = this.width;
                                    currentWidth = imgWidth;
                                    currentHeight = imgHeight;

                                    init();

                                    return true;
                                };

                                $element[0].src = newValue;
                            }

                        }, true);


                        var touchMoved = false;

                        $element.bind('touchstart', function(event) {

                            var rect = $element[0].parentElement.getBoundingClientRect();
                            touchMoved = false;

                            if (flavourLevel !== flavourLevelEnum.FULL && currentState !== stateEnum.FULL) {
                                return;
                            }

                            panning = false;
                            zooming = false;

                            if (isTouchedInFullFlavourModeWithCertainAmountOfTouches(event, 1)) {
                                panning = true;
                                if (currentState === stateEnum.SMALL || currentState === stateEnum.FULL_TO_SMALL) return;
                                startX0 = event.touches[0].pageX - rect.left;
                                startY0 = event.touches[0].pageY - rect.top;
                            }
                            if (isTouchedInFullFlavourModeWithCertainAmountOfTouches(event, 2)) {
                                zooming = true;
                                startX0 = event.touches[0].pageX - rect.left;
                                startY0 = event.touches[0].pageY - rect.top;
                                startX1 = event.touches[1].pageX - rect.left;
                                startY1 = event.touches[1].pageY - rect.top;
                                centerPointStartX = ((startX0 + startX1) / 2.0);
                                centerPointStartY = ((startY0 + startY1) / 2.0);
                                percentageOfImageAtPinchPointX = (centerPointStartX - currentOffsetX) / currentWidth;
                                percentageOfImageAtPinchPointY = (centerPointStartY - currentOffsetY) / currentHeight;
                                startDistanceBetweenFingers = Math.sqrt(Math.pow((startX1 - startX0), 2) + Math.pow((startY1 - startY0), 2));
                            }

                            if (isTouchedInFullFlavourModeWithCertainAmountOfTouches(event, 2)) inAnimation = false;

                            if (!mask) {
                                addMask();
                            }

                        });

                        $element.bind('touchmove', function(event) {
                            var rect = $element[0].parentElement.getBoundingClientRect();
                            touchMoved = true;

                            if (panning) {
                                if (currentState === stateEnum.SMALL || currentState === stateEnum.FULL_TO_SMALL) return;

                                event.preventDefault();
                                endX0 = event.touches[0].pageX - rect.left;
                                endY0 = event.touches[0].pageY - rect.top;
                                translateFromTranslatingX = endX0 - startX0;
                                translateFromTranslatingY = endY0 - startY0;
                                newOffsetX = currentOffsetX + translateFromTranslatingX;
                                newOffsetY = currentOffsetY + translateFromTranslatingY;
                                theImage.style.left = newOffsetX + 'px';
                                theImage.style.top = newOffsetY + 'px';

                            }
                            else if (zooming) {

                                event.preventDefault();

                                // Get the new touches
                                endX0 = event.touches[0].pageX - rect.left;
                                endY0 = event.touches[0].pageY - rect.top;
                                endX1 = event.touches[1].pageX - rect.left;
                                endY1 = event.touches[1].pageY - rect.top;

                                // Calculate current distance between points to get new-to-old pinch ratio and calc width and height
                                endDistanceBetweenFingers = Math.sqrt(Math.pow((endX1 - endX0), 2) + Math.pow((endY1 - endY0), 2));
                                pinchRatio = endDistanceBetweenFingers / startDistanceBetweenFingers;
                                newContinuousZoom = pinchRatio * currentContinuousZoom;
                                newWidth = imgWidth * newContinuousZoom;
                                newHeight = imgHeight * newContinuousZoom;

                                // Get the point between the two touches, relative to upper-left corner of image
                                centerPointEndX = ((endX0 + endX1) / 2.0);
                                centerPointEndY = ((endY0 + endY1) / 2.0);

                                // This is the translation due to pinch-zooming
                                translateFromZoomingX = (currentWidth - newWidth) * percentageOfImageAtPinchPointX;
                                translateFromZoomingY = (currentHeight - newHeight) * percentageOfImageAtPinchPointY;

                                // And this is the translation due to translation of the centerpoint between the two fingers
                                translateFromTranslatingX = centerPointEndX - centerPointStartX;
                                translateFromTranslatingY = centerPointEndY - centerPointStartY;

                                // Total translation is from two components: (1) changing height and width from zooming and (2) from the two fingers translating in unity
                                translateTotalX = translateFromZoomingX + translateFromTranslatingX;
                                translateTotalY = translateFromZoomingY + translateFromTranslatingY;

                                // the new offset is the old/current one plus the total translation component
                                newOffsetX = currentOffsetX + translateTotalX;
                                newOffsetY = currentOffsetY + translateTotalY;

                                // Set the image attributes on the page
                                setImageDimensionsAndVisibility(theImage,
                                    newOffsetX,
                                    newOffsetY,
                                    newWidth,
                                    newHeight);
                            }

                            if (isTouchedInFullFlavourModeWithCertainAmountOfTouches(event, 2)) inAnimation = false;

                            updateOpacity(newWidth, newHeight);
                        });

                        var simpleClickZoom = function(event) {
                            if (!touchMoved) {
                                if (currentState === stateEnum.FULL) {
                                    exitFullscreen();
                                }
                                else if (currentState === stateEnum.SMALL) {
                                    goFullscreen();
                                }
                            }
                        };

                        $element.bind('touchend', function(event) {

                            if (isTouchedInFullFlavourModeWithCertainAmountOfTouches(event, 2)) inAnimation = false;

                            if (flavourLevel !== flavourLevelEnum.FULL) {
                                event.preventDefault();
                                return;
                            }

                            var rect = $element[0].parentElement.getBoundingClientRect();

                            if (panning) {
                                panning = false;

                                simpleClickZoom(event);

                                if (flavourLevel === flavourLevelEnum.FULL && (currentState === stateEnum.SMALL || currentState === stateEnum.FULL_TO_SMALL)) return;

                                currentOffsetX = newOffsetX;
                                currentOffsetY = newOffsetY;
                            }
                            else if (zooming) {
                                zooming = false;
                                currentOffsetX = newOffsetX;
                                currentOffsetY = newOffsetY;
                                currentWidth = newWidth;
                                currentHeight = newHeight;
                                currentContinuousZoom = newContinuousZoom;
                            }

                            if (flavourLevel === flavourLevelEnum.FULL) {
                                // If the image is zoomed in > 75% and < 100% of the screen it is likely they want to have it fullscreen
                                // At full screen, never destroy the mask
                                if (currentWidth / window.innerWidth > 0.75 || currentHeight / window.innerHeight > 0.75) {
                                    if ((currentWidth / window.innerWidth < 1 && currentHeight / window.innerHeight < 1)) {
                                        goFullscreen();
                                    }
                                    else {
                                        currentState = stateEnum.FULL;
                                    }
                                }
                                else {
                                    exitFullscreen();
                                }
                            }

                            touchMoved = false;
                        });

                        if (flavourLevel !== flavourLevelEnum.FULL) {
                            $element.bind('touchend', simpleClickZoom);
                            $element.bind('click', simpleClickZoom);
                        }


                        $element.bind('touchcancel', function(event) {
                            if (panning) {
                                panning = false;
                            }
                            else if (zooming) {
                                zooming = false;
                            }
                            if (mask) {
                                removeMask();
                            }
                        });

                        // Needed for devices to reposition the image
                        window.addEventListener('orientationchange', function() {
                            if (currentState === stateEnum.FULL) {
                                goFullscreen();
                            }
                            init();
                        });
                    }

                }
            };
        }
    ]);