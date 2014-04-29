'use strict';

angular.module('CouchCommerceApp')
    .factory('sidemenuUiState', function ($rootScope, snapRemote) {

        var state = {};

        state.activeTab = '';

        state.getActiveTab = function () {
            return state.activeTab;
        };

        state.setActiveTab = function (tab) {
            state.activeTab = tab;
        };

        state.openSidemenu = function (side) {
            snapRemote.open(side || '');
        };

        state.closeSidemenu = function () {
            snapRemote.close();
        };

        snapRemote.getSnapper().then(function (snapper) {
            snapper.on('snapperClosed', function () {
                $rootScope.$emit('sidemenuClosed');
            });
        });

        return state;
    });
