angular
    .module('CouchCommerceApp')
    .controller('MainController',
    [
        '$scope', 'searchUiState', 'searchService',
        function MainController($scope, searchUiState, searchService) {

            'use strict';

            $scope.searchUiState = searchUiState;
            $scope.searchService = searchService;
        }
    ]);
