angular.module('sdk.directives.ccIosPositionFixedInputFix', []);

//This fixes a pretty well known bug in iOS where elements with fixed positioning
//don't stay fixed if they contain an input element which gets focus, causing the
//virtual keyboard to appear.
//The fix is to toggle between absolute and fixed positioning on focus/blur to cause
//the browser to fixup the broken position:fixed.

//It's inspired by the answers here
//http://stackoverflow.com/questions/7970389/ios-5-fixed-positioning-and-virtual-keyboard

//However, we also had to bind to touchstart to  to cause a blur when the user starts
//scrolling.
angular.module('sdk.directives.ccIosPositionFixedInputFix')
    .directive('ccIosPositionFixedInputFix', ['deviceService', function(deviceService) {

        'use strict';

        var FIXED_ELEMENT_CLASS     = 'cc-fixed-element',
            FIXED_ELEMENT_SELECTOR  = '.' + FIXED_ELEMENT_CLASS;

        return {
                restrict: 'A',
                link: function (scope, element, attributes, controllers) {

                    if(!deviceService.hasPositionFixedSupport()){
                        return;
                    }

                    var fixedElements = document.querySelectorAll(FIXED_ELEMENT_SELECTOR);
                    var $fixedElements = angular.element(fixedElements);
                    var $document = angular.element(document);

                    var makeItAbsolute = function(){
                        $fixedElements.css('position', 'absolute');
                    };

                    var makeItFixed = function(){
                        $fixedElements.css('position', 'fixed');
                    };

                    element.on('focus', function(){
                        makeItAbsolute();
                        
                        var bind = function(){
                            document.activeElement.blur();
                            $document.off('touchstart',bind);
                        };

                        $document.on('touchstart', bind);
                    });

                    element.on('blur', function(){
                        makeItFixed();
                    });
                }
            };
    }]);