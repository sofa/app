'use strict';

//this is a generic directive that creates an view with optional fixed
//header and toolbars
angular.module("CouchCommerceApp")
    .directive('ccZippy', function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                caption: '=',
            },
            templateUrl: 'views/generic-directive-templates/cczippy.tpl.html'
        };
    });