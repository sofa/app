angular.module('sdk.directives.ccFooter', ['src/directives/ccFooter/ccfooter.tpl.html']);
angular
    .module('sdk.directives.ccFooter')
    .directive('ccFooter', function() {

        'use strict';

        var defaultIfUndefined = function(scope, property, defaultVal){
            scope[property] = scope[property] === undefined ? defaultVal : scope[property];
        };

        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                items: '=?'
            },
            templateUrl: 'src/directives/ccFooter/ccfooter.tpl.html',
            link: function(scope, element, attrs){
                defaultIfUndefined(scope, 'items', cc.Config.aboutPages);

                scope.goTo = function(item){
                    window.location.href = '#/pages/' + item.id;
                };
            }
        };
    });