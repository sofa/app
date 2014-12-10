'use strict';

angular
    .module('sofa.tabs')
    .directive('sofaTabPane', function () {
        return {
            require: '^sofaTabs',
            restrict: 'E',
            transclude: true,
            scope: {
                paneTitle: '@?',
                paneId: '@?'
            },
            templateUrl: 'common/sofaTabs/sofa-tab-pane.tpl.html',
            link: function (scope, element, attrs, tabCtrl) {
                tabCtrl.addPane(scope, tabCtrl.tabId);
            }
        };
    });
