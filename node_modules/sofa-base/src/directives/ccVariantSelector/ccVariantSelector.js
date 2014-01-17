angular.module('sdk.directives.ccVariantSelector', ['src/directives/ccVariantSelector/ccvariantselector.tpl.html']);

angular.module('sdk.directives.ccVariantSelector')
    .filter('ccVariantFilter', ['$filter', function($filter) {

        'use strict';

        return function(values, selectedValues, key) {
            var selected = {},
                applyFilters = false;

            // reformat for built in filter and exclude current property
            for (var property in selectedValues){
                if (key!==property && selectedValues[property]!==null && selectedValues[property]!==undefined) {
                   selected['properties.' + property] = selectedValues[property];
                   applyFilters = true;
                }
            }

            // extract available variants
            var variants = applyFilters ? $filter('filter')(values, selected, true) : values;

            // extract flat values for the curent property
            var result = [];
            variants.forEach(function(variant){
                if (result.indexOf(variant.properties[key]) === -1 && variant.stock > 0){
                    result.push(variant.properties[key]);
                }
            });
            return result;
        };
    }])

    .directive('ccVariantSelector', function() {

        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: {
                variants: '=',
                variant : '=?',
                selectedProperties: '=?',
                chooseText: '=?'
            },
            templateUrl: 'src/directives/ccVariantSelector/ccvariantselector.tpl.html',
            link: function(scope, element, attrs){

                // extract flat list of available properties
                // maybe iterating on the first variant is enough ?
                scope.properties = [];
                scope.selectedProperties = {};

                scope.variants.forEach(function(variant){
                    for (var property in variant.properties){
                        //create a placeholder value on the selectedProperties hash
                        //for each available property. So we can later figure out
                        //which are missing.
                        scope.selectedProperties[property] = null;
                        if (scope.properties.indexOf(property) === -1){
                            scope.properties.push(property);
                        }
                    }
                });
                

                var findVariant = function(variants, selectedProperties){
                    var filteredVariants = variants.filter(function(variant){
                        for (var property in variant.properties){
                            if (variant.properties[property] !== selectedProperties[property]){
                                return false;
                            }
                        }

                        return true;
                    });

                    return filteredVariants.length > 0 ? filteredVariants[0] : null;
                };

                scope.$watch('selectedProperties', function(val){
                    var variant = findVariant(scope.variants, val);
                    scope.variant = variant;
                }, true);
            }
        };
    });
