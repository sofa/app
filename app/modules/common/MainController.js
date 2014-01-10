angular
    .module('CouchCommerceApp')
    .controller('MainController',
    [
        '$scope', 'searchUiState',
        function MainController($scope, searchUiState) {

            'use strict';

            $scope.searchUiState = searchUiState;
        }
    ]);
