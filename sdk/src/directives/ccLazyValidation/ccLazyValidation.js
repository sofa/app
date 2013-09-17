angular.module('sdk.directives.ccLazyValidation', []);

angular.module('sdk.directives.ccLazyValidation')
    .directive('ccLazyValidation', function() {

        'use strict';

        var DEBOUNCE_MS     = 2000,
            VALID_CLS       = 'cc-valid',
            INVAID_CLS      = 'cc-invalid';

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function($scope, element, attributes, controller){

                //there are situations where the VALID_CLS/INVALID_CLS needs to be set on the parent
                //rather than directly on the element.
                var notifyElement = attributes.ccLazyValidation === 'parent' ? element.parent() : element;


                var validate = function(){
                    return controller.$valid ? setValid() : setInvalid();
                };

                var debouncedKeyUp = cc.Util.debounce(function(){
                    //if the user deletes all text from the box but
                    //still hasn't moved focus to somewhere else,
                    //don't bother him with complains
                    if (element.val().length > 0){
                        validate();
                    }
                }, DEBOUNCE_MS);

                var setValid = function(){
                    notifyElement.removeClass(INVAID_CLS);
                    notifyElement.addClass(VALID_CLS);
                };

                var setInvalid = function(){
                    notifyElement.removeClass(VALID_CLS);
                    notifyElement.addClass(INVAID_CLS);
                };

                var resetState = function(){
                    notifyElement.removeClass(VALID_CLS);
                    notifyElement.removeClass(INVAID_CLS);
                };

                element.bind('keydown', resetState);
                element.bind('keyup', debouncedKeyUp);
                element.bind('blur', validate);
            }
        };
    });