'use strict';

angular
    .module('CouchCommerceApp')
    .factory('sidemenuUiState', function ($rootScope, snapRemote, tabStateService) {

        var self = this;

        self.setActiveTab = function (paneId) {
            tabStateService.activateTabByPaneId(paneId, 'side-menu-tabs');
        };

        self.openSidemenu = function (side) {
            snapRemote.open(side || '');
        };

        self.closeSidemenu = function () {
            snapRemote.close();
        };

        snapRemote.getSnapper().then(function (snapper) {
            snapper.on('snapperClosed', function () {
                $rootScope.$emit('sidemenuClosed');
            });
        });

        return self;
    });
