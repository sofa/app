'use strict';

angular
    .module('CouchCommerceApp')
    .controller('MainController', function MainController($scope, searchUiState) {
        $scope.searchUiState = searchUiState;
    }
);
