'use strict';

angular
    .module('sofa.tabs')
    .controller('TabController', function (tabStateService) {

        var ctrl = this;

        ctrl.getTabSet = function (tabId) {
            return tabStateService.getSet(tabId);
        };

        ctrl.activateTab = function (paneScope, tabId) {
            tabStateService.activateTab(paneScope, tabId);
        };

        ctrl.addPane = function (paneScope, tabId) {
            var set = tabStateService.addSet(tabId);

            if (!set.length) {
                ctrl.activateTab(paneScope, tabId);
            }

            set.push(paneScope);
        };

    });
