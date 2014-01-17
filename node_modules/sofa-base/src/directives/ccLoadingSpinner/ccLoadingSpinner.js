
angular.module('sdk.directives.ccLoadingSpinner', ['src/directives/ccLoadingSpinner/ccloadingspinner.tpl.html']);

angular.module('sdk.directives.ccLoadingSpinner')
    .directive('ccLoadingSpinner', function() {

        'use strict';

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'src/directives/ccLoadingSpinner/ccloadingspinner.tpl.html'
        };
    });