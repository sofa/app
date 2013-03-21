'use strict';

//this is a generic directive that creates an view with optional fixed
//header and toolbars
angular.module("CouchCommerceApp")
    .directive('ccFixedToolbarsView', function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                header: '@',
                footer: '@'
            },
            templateUrl: 'views/generic-directive-templates/fixedtoolbarsview.html'
        };
    });