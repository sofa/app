angular.module('sdk.directives.ccFooter', [
    'src/directives/ccFooter/ccfooter.tpl.html',
    'sdk.services.configService'
]);

angular
    .module('sdk.directives.ccFooter')
    .directive('ccFooter', ['configService', function(configService) {

        'use strict';

        var defaultIfUndefined = function(scope, property, defaultVal){
            scope[property] = scope[property] === undefined ? defaultVal : scope[property];
        };

        var ABOUT_PAGES = configService.get('aboutPages');

        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                items: '=?'
            },
            templateUrl: 'src/directives/ccFooter/ccfooter.tpl.html',
            link: function(scope, element, attrs){
                defaultIfUndefined(scope, 'items', ABOUT_PAGES);

                scope.goTo = function(item){
                    window.location.href = '#/pages/' + item.id;
                };
            }
        };
    }]);