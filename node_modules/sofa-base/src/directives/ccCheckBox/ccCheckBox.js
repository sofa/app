
angular.module('sdk.directives.ccCheckBox', ['src/directives/ccCheckBox/cccheckbox.tpl.html']);

angular.module('sdk.directives.ccCheckBox')
    .directive('ccCheckBox', function() {

        'use strict';

        var instanceCount = 0;

        return {
            restrict: 'E',
            replace: true,
            scope: {
                label: '=?',
                value: '=?'
            },
            templateUrl: 'src/directives/ccCheckBox/cccheckbox.tpl.html',
            link: function(scope, $element, attrs){
                instanceCount++;
                scope.id = instanceCount;
            }
        };
    });