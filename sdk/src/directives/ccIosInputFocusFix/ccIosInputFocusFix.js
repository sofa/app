// On iOS, when you focus an input and then rotate the screen, the layout
// tends to mess up. To fix it we force a DOM refresh on orientation change.

angular.module('sdk.directives.ccIosInputFocusFix')
    .directive('ccIosInputFocusFix', ['inputFocusFixConfigService', 'deviceService',
        function(inputFocusFixConfigService, deviceService) {

        'use strict';

        return {
                restrict: 'A',
                link: function (scope, element, attributes, controllers) {
                    window.addEventListener('orientationchange', function() {
                        if ( inputFocusFixConfigService.enabled && deviceService.getOs() === "iOS" ) {
                            setTimeout(function() {
                                document.body.style.display = "none";
                                setTimeout(function() {
                                    document.body.style.display = "block";
                                }, 1);
                            }, 1000);
                            // The number 1000 here is magic, because this hack needs to happen somewhere after the orientationchange.
                            // It is unlikely that orientationchanges will ever exceed 1000ms since devices only get faster and
                            // this is only targeted towards iOS devices which react in a consistent way.
                        }
                    });
                }
            };
    }]);