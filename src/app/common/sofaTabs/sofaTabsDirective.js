'use strict';

angular
    .module('sofa.tabs')
    .directive('sofaTabs', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            controller: 'TabController',
            controllerAs: 'tabCtrl',
            scope: {
                tabId: '@'
            },
            templateUrl: 'common/sofaTabs/sofa-tabs.tpl.html',
            compile: function () {
                return {
                    pre: function (scope, iElement, iAttrs, tabCtrl) {
                        tabCtrl.tabId = scope.tabId;
                    },
                    post: function (scope, iElement, iAttrs, tabCtrl) {
                        tabCtrl.panes = tabCtrl.getTabSet(tabCtrl.tabId);
                    }
                };
            }
        };
    });
