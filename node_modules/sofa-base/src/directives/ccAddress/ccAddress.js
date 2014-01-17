angular.module('sdk.directives.ccAddress', ['src/directives/ccAddress/ccaddress.tpl.html']);

angular.module('sdk.directives.ccAddress')
    .directive('ccAddress', function() {

        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: {
                data: '=',
            },
            templateUrl: 'src/directives/ccAddress/ccaddress.tpl.html'
        };
    });