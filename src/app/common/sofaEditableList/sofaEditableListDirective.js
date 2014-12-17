'use strict';

angular
    .module('sofa.editableList')
    .directive('sofaEditableList', function ($templateCache) {
        return {
            restrict: 'E',
            scope: true,
            compile: function (tElement, tAttrs) {

                // Extract the repeat expression to be used on the internal ng-repeat
                var repeatExpression = tAttrs.repeater || 'item in items';

                // Get template from external template file
                var tpl = angular.element($templateCache.get('common/sofaEditableList/sofa-editable-list.tpl.html'));

                // Extract the children from this instance of the directive
                // This is the inner template which will be used within the ngRepeat of the outer template (tpl)
                var children = tElement.children();

                // Manually attach ngRepeat to the tpl's LI element
                // (this way we can pass different repeat expressions)
                var listElement = tpl.find('li');
                listElement.attr('ng-repeat', repeatExpression);

                // Target element within "tpl" to insert "children" into
                var transclusionElement = tpl[0].querySelector('.sofa-editable-list__content');

                // Where do the options come from (right || left)
                var layout = tAttrs.layout || 'left';

                tpl.addClass('sofa-editable-list--position-' + layout);

                // Wrap the children in our template
                angular.element(transclusionElement).append(children);

                // Append this new template to our compile element
                tElement.html('');
                tElement.append(tpl);

                return {
                    post: function (scope, element, attrs) {

                        var removeFn = scope.$eval(attrs.onRemove);

                        var vm = {};
                        scope.vm = vm;

                        vm.activeIndex = null;

                        vm.toggleState = function (index) {
                            vm.activeIndex = vm.activeIndex === index ? null : index;
                        };

                        vm.removeItem = function (item) {
                            removeFn(item);
                            vm.activeIndex = null;
                        };
                    }
                };
            }
        };
    });
