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
            templateUrl: 'views/generic-directive-templates/cczippy.tpl.html',
            link: function(scope, element, attrs){
                var caption = angular.element(element.children('.cc-zippy-caption')[0]),
                    opened = true,
                    openedIconClass = 'icon-chevron-down',
                    closedIconClass = 'icon-chevron-up';

                var toggle = function(){
                    opened = !opened;
                    element.removeClass(opened ? 'cc-zippy-closed' : 'cc-zippy-opened');
                    element.addClass(opened ? 'cc-zippy-opened' : 'cc-zippy-closed');
                };

                caption.bind('click', toggle);

                toggle();

            }
        };
    });