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

                var allowNull = attrs.allowNull !== undefined;

                //defines if an empty value should be omitted
                scope._omitNull = attrs.omitNull !== undefined;


                //Not sure, if we are doing the right thing here concerning ngModel.
                //However, it seems to work quite well for now and it's not that much work.

                //What we do is:

                //1. we set up a bi directional binding between the expression provided to ngMode
                //and a isolated scope property called _selectedValue. This way we don't have to
                //use $parent in our template.

                //2. we listen on scope._selectedValue manually and control the ngModelController
                //accordingly

                var unwatch = scope.$watchCollection('data', function(data){
                    
                    //this is the case where we need to set the selectedValue to the first value because it 
                    //previously was null and now we are getting data values and omitNull forces us to set
                    //a non null value
                    if (data.length > 0 && scope._selectedValue === null && scope._omitNull){
                        scope._selectedValue = data[0];
                    }
                    //this is the case where we had a value but it's been removed from the datasource
                    //in that case we either need to set it to null or the first value from the datasource
                    //depending on whether omitNull is true or not
                    else if(data.length > 0){
                        var tempValue = cc.Util.find(data, function(item){
                            return angular.equals(item, scope._selectedValue);
                        });

                        //this is the case where we had a value but it's been removed from the datasource
                        //in that case we either need to set it to null or the first value from the datasource
                        //depending on whether omitNull is true or not
                        if (!tempValue){
                            scope._selectedValue = scope._omitNull ? data[0] : null;
                        }
                        //this is the case where the datasource was changed and an equal value to the previous
                        //selected exists but it's not the same reference
                        else if(tempValue && tempValue !== scope._selectedValue){
                            scope._selectedValue = tempValue;
                        }
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

                var displayValueFormatter = scope.displayValueExp();

                var firstRun = true;
                if (ngModelController){
                    scope.$watch('_selectedValue', function(newValue){
                        ngModelController.$setViewValue(newValue);

                        if (!allowNull && newValue === null){
                            ngModelController.$setValidity('value', false);
                        }
                        else{
                            ngModelController.$setValidity('value', true);
                        }

                        if(firstRun){
                            ngModelController.$setPristine();
                        }

                        firstRun = false;
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
