'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'HeaderController',
    [
        '$scope', '$location', 'navigationService', 'couchService',
        function CategoryController($scope, $location, navigationService, couchService) {

            $scope.goBack = function(){
                navigationService.goUp();
            };

            $scope.goToRoot = function(){
                navigationService.navigateToRootCategory();
            };
        }
    ]);
