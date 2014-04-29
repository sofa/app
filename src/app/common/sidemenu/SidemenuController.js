'use strict';

angular.module('CouchCommerceApp')
    .controller('SidemenuController', function ($scope, sidemenuUiState) {

        $scope.sidemenuUiState = sidemenuUiState;

        sidemenuUiState.setActiveTab('categories');

    });
