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
                displayValueExp: '&'
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

                //1. we listen on the expression which is set via the ngModel manually.
                //We have to use $parent for that.

                //2. we propagate changes on a private _selectedValue property on the isolated scope.
                //This way we don't have to use $parent within our template

                //3. we listen on scope._selectedValue manually and propagate changes back to
                //the $parent scope using some clever $eval magic :)

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

                scope.$parent.$watch(attrs.ngModel, function(newValue){
                    scope._selectedValue = newValue;
                });

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

                        //we need to propagate the value back to the $parent scope
                        //where it lives on. However, bindings might not be simple
                        //but nested properties (e.g. $scope.person.address.country)
                        //therefore, it's best to let $eval do the heavy lifting for us.
                        scope.$eval('$parent.' + attrs.ngModel + ' = _selectedValue');
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

                        properties.forEach(function(node){
                            value = value[node];
                        });

                        return value;
                    };
                }
            }
        };
    });
