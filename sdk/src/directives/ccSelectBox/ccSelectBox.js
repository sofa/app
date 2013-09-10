angular.module('sdk.directives.ccSelectBox', ['src/directives/ccSelectBox/ccselectbox.tpl.html']);

/**
* Creates a mobile friendly select box that delegates to the native picker
* 
* Options:
* 
*   -   `displayValueExp` optional expression that maps values to display values.
*       Can either be a string (e.g. 'some.nested.property') or a function 
*       (e.g. function(value){ return value.some.nested.property; })
*/
angular.module('sdk.directives.ccSelectBox')
    .directive('ccSelectBox', function() {

        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: {
                data: '=',
                propertyName: '=',
                chooseText: '=?',
                selectedValue: '=?',
                displayValueExp: '&'
            },
            templateUrl: 'src/directives/ccSelectBox/ccselectbox.tpl.html',
            link: function(scope, element, attrs){

                var displayValueFormatter = scope.displayValueExp();

                //default display function that will be used if no
                //displayValueExp is given
                scope.displayFn = function(value){ return value; };

                if (angular.isFunction(displayValueFormatter)){
                    scope.displayFn = displayValueFormatter;
                }
                else if (angular.isString(displayValueFormatter)){

                    var properties = displayValueFormatter.split('.');

                    scope.displayFn = function(value){

                        if (!value){
                            return value;
                        }

                        properties.forEach(function(node){
                            value = value[node];
                        });

                        return value;
                    };
                }
            }
        };
    });
