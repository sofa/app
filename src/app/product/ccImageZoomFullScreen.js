'use strict';
/* global document*/

angular.module('CouchCommerceApp')
       .factory('ccImageZoomFullScreen', function (ccImageZoomSettings, ccImageZoomDomActors, $timeout) {

    var self = {},
    isAllowedToInteract = true,
    $fullDiv,
    settings = ccImageZoomSettings,
    domActors = ccImageZoomDomActors,
    appContent;

    self.toFullScreen = function ($element) {
        if (!isAllowedToInteract) {
            return;
        }

        appContent = settings.BODY_WRAPPER_CLASS ?
                     angular.element(document.querySelectorAll('.' + settings.BODY_WRAPPER_CLASS)[0]) :
                     domActors.$body;

        $fullDiv = angular.element(document.createElement('div'));
        domActors.$body.append($fullDiv[0]);

        if (settings.SIMPLE_CLASS) {
            $fullDiv.addClass(settings.SIMPLE_CLASS);
        }

        // Set the background-image of the newly created div to the image src
        $fullDiv.css('background-image', 'url(' + $element.attr('src') + ')');

        // The following triggers a reflow which allows for the transition animation to kick in.
        $fullDiv[0].offsetWidth; /* jshint ignore:line */

        if (settings.SIMPLE_ACTIVE_CLASS) {
            $fullDiv.addClass(settings.SIMPLE_ACTIVE_CLASS);
        }

        $fullDiv.bind('click', self.closeFullScreen);
        
        isAllowedToInteract = false;

        $timeout(function () {
            isAllowedToInteract = true;

            // We need to set the whole underlying thing to display:none
            // otherwise on some platforms (Android 2 I'm looking at you)
            // the content behind the fullscreen image will still be visible
            // and even scrollable which gives a bad experience.
            appContent.css('display', 'none');
        }, settings.ZOOM_ANIM_DURATION);
    };

    self.closeFullScreen = function () {
        if (!isAllowedToInteract) {
            return;
        }

        appContent.css('display', '');
        if (settings.SIMPLE_ACTIVE_CLASS) {
            $fullDiv.removeClass(settings.SIMPLE_ACTIVE_CLASS);
        }

        isAllowedToInteract = false;
        $timeout(function () {
            $fullDiv.remove();
            isAllowedToInteract = true;
        }, settings.ZOOM_ANIM_DURATION);
    };

    return self;
});
