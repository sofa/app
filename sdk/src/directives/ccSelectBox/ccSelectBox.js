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
                failMessage: '=?',
                displayValueExp: '&',
                _selectedValue: '=ngModel'
            },
            require: '?ngModel',
            templateUrl: 'src/directives/ccSelectBox/ccselectbox.tpl.html',
            link: function(scope, element, attrs, ngModelController){

                if (!attrs.ngModel){
                    return;
                }

                //Not sure, if we are doing the right thing here concerning ngModel.
                //However, it seems to work quite well for now and it's not that much work.

                //What we do is:

                //1. we set up a bi directional binding between the expression provided to ngMode
                //and a isolated scope property called _selectedValue. This way we don't have to
                //use $parent in our template.

                //2. we listen on scope._selectedValue manually and control the ngModelController
                //accordingly

                //This seems rather hacky. It works around the situation where we:
                //  - don't have a null value
                //  - the selected value (via ngModel) is null
                //The problem here is, that when the data is set, it doesn't preselect
                //the first item. Even worse, the select element *is* set to the first
                //element but angular does not care about it. If you then click into the select
                //and choose the already selected first value nothing gets propagated as angular
                //no change event is triggered.
                //We fix this by listening on the data, when it comes in and the _selectedValue
                //is still null, we set it to the first item and instantly unbind.
                var unwatch = scope.$watch('data', function(data){
                    //wow, we really need unit tests for all this mess. The contains check is needed for
                    //such cases where a _selectedValue is present but then the data changes and the value
                    //is no longer part of the data. We then reset the _selectedValue to the first value of
                    //the data source.
                    if (data.length > 0 && (scope._selectedValue === null || !contains(data, scope._selectedValue))){
                        scope._selectedValue = data[0];
                        unwatch();
                    }
                });

                //we would move this to cc.Util but first it needs to be decoupled from angular.equals()
                var contains = function(arr, obj){
                    for (var i = 0; i < arr.length; i++) {
                        var element = arr[i];
                        if (angular.equals(obj, element)){
                            return true;
                        }
                    }

                    return false;
                };

                var allowNull = attrs.allowNull !== undefined;

                //defines if an empty value should be omitted
                scope._omitNull = attrs.omitNull !== undefined;

                var displayValueFormatter = scope.displayValueExp();

                if (ngModelController){
                    scope.$watch('_selectedValue', function(newValue){
                        ngModelController.$setViewValue(newValue);

                        if (!allowNull && newValue === null){
                            ngModelController.$setValidity('value', false);
                        }
                        else{
                            ngModelController.$setValidity('value', true);
                        }
                    });
                }


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
                        var tempValue = value;
                        properties.forEach(function(node){
                            tempValue = tempValue[node];
                        });

                        return tempValue;
                    };
                }
            }
        };
    });
