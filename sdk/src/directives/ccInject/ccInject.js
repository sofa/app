angular.module('sdk.directives.ccInject', []);

angular
    .module('sdk.directives.ccInject')
    .directive('ccInject', ['$templateCache', '$http', '$compile', 'injectsService', function($templateCache, $http, $compile, injectsService) {

        'use strict';

        return {
            restrict: 'EA',
            replace: true,
            scope: {
                target: '@'
            },
            link: function(scope, element, attrs){
                scope.injectsService = injectsService;

                var templateUrl = injectsService.getTemplate(scope.target);

                if (templateUrl === null){
                    element.remove();
                }
                else{
                    $http
                        .get(templateUrl, {cache: $templateCache})
                        .success(function (tplContent) {
                            element.replaceWith($compile(tplContent)(scope));
                        });
                }
            }
        };
    }]);