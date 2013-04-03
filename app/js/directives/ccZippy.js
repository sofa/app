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
                var $element = $(element[0]),
                    $caption = $element.children('.cc-zippy-caption').first(),
                    $icon = $element.find('.cc-zippy-icon').first(),
                    opened = true,
                    openedIconClass = 'icon-chevron-up',
                    closedIconClass = 'icon-chevron-down';

                var toggle = function(){
                    opened = !opened;
                    $element.removeClass(opened ? 'cc-zippy-closed' : 'cc-zippy-opened');
                    $element.addClass(opened ? 'cc-zippy-opened' : 'cc-zippy-closed');
                    $icon.removeClass(opened ? closedIconClass : openedIconClass);
                    $icon.addClass(opened ? openedIconClass : closedIconClass);
                };

                $caption.bind('click', toggle);

                toggle();

            }
        };
    });