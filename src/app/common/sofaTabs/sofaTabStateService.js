'use strict';

/* global sofa */

angular
    .module('sofa.tabs')
    .factory('tabStateService', function () {
        var self = this,
            tabSets = {};

        var findScopeByPaneId = function (id, tabInstance) {
            return sofa.Util.find(tabInstance, function (paneScope) {
                return paneScope.paneId === id;
            });
        };

        self.activateTabByPaneId = function (paneId, tabId) {
            var tabInstance = self.getSet(tabId);
            var scope = findScopeByPaneId(paneId, tabInstance);

            if (scope) {
                self.activateTab(scope, tabId);
            }
        };

        self.activateTab = function (paneScope, tabId) {
            var tabSet = self.getSet(tabId);

            angular.forEach(tabSet, function (pane) {
                pane.selected = false;
            });

            paneScope.selected = true;
        };

        self.addSet = function (id) {
            tabSets[id] = tabSets[id] || [];

            return tabSets[id];
        };

        self.removeSet = function (id) {
            delete tabSets[id];
        };

        self.getSet = function (id) {
            return tabSets[id];
        };

        return self;
    });
