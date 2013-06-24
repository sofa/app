'use strict';

angular.module('sdk.directives.ccZippy', []);

angular.module('sdk.directives.ccZippy')
    .directive('ccZippy', function() {

        var defaultIfUndefined = function(scope, property, defaultVal){
            return scope[property] = scope[property] === undefined ? defaultVal : scope[property];
        };

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                caption: '=?',
                opened: '=?'
            },
            templateUrl: '../sdk/src/directives/ccZippy/cczippy.tpl.html',
            link: function(scope, $element, attrs){
                var element = $element[0],
                    $caption = angular.element(element.querySelectorAll('.cc-zippy-caption')[0]),
                    $icon = angular.element(element.querySelectorAll('.cc-zippy-icon')[0]),
                    openedIconClass = 'icon-chevron-up',
                    closedIconClass = 'icon-chevron-down';

                defaultIfUndefined(scope, 'caption', 'default');
                defaultIfUndefined(scope, 'opened', false);

                var setOpen = function(opened){
                    $element.removeClass(opened ? 'cc-zippy-closed' : 'cc-zippy-opened');
                    $element.addClass(opened ? 'cc-zippy-opened' : 'cc-zippy-closed');
                    $icon.removeClass(opened ? closedIconClass : openedIconClass);
                    $icon.addClass(opened ? openedIconClass : closedIconClass);
                };

                var toggle = function(){
                    scope.opened = !scope.opened;
                    setOpen(scope.opened);
                };

                $caption.bind('click', toggle);

                scope.$watch('opened', setOpen);

                setOpen(scope.opened);
            }
        };
    });