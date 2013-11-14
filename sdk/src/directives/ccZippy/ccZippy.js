
angular.module('sdk.directives.ccZippy', ['src/directives/ccZippy/cczippy.tpl.html']);

angular.module('sdk.directives.ccZippy')
    .directive('ccZippy', function() {

        'use strict';

        var defaultIfUndefined = function(scope, property, defaultVal){
            scope[property] = scope[property] === undefined ? defaultVal : scope[property];
        };

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                caption: '=?',
                opened: '=?'
            },
            templateUrl: 'src/directives/ccZippy/cczippy.tpl.html',
            link: function(scope, $element, attrs){
                var element = $element[0],
                    $caption = angular.element(element.querySelectorAll('.cc-zippy-caption')[0]),
                    $icon = angular.element(element.querySelectorAll('.cc-zippy-icon')[0]),
                    openedIconClass = 'fa fa-chevron-up',
                    closedIconClass = 'fa fa-chevron-down';

                defaultIfUndefined(scope, 'caption', 'default');

                scope.opened = attrs.initOpened === undefined ? false : (attrs.initOpened === "true");

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