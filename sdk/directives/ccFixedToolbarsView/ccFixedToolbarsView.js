'use strict';

angular.module('sdk.directives.ccFixedToolbarsView', []);

//this is a generic directive that creates an view with optional fixed
//header and toolbars
angular.module('sdk.directives.ccFixedToolbarsView')
    .directive('ccFixedToolbarsView', function() {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                header: '=',
                footer: '='
            },
            templateUrl: '../sdk/directives/ccFixedToolbarsView/fixedtoolbarsview.html'
        };
    });