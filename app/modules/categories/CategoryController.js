'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'CategoryController',
    [
        '$scope', '$routeParams', 'couchService', 'navigationService',
        function CategoryController($scope, $routeParams, couchService, navigationService) {

            $scope.goToCategory = function(category){
                if (!category.children){
                    navigationService.navigateToProducts(category.urlId);
                } else {
                    navigationService.navigateToCategory(category.urlId);
                }
            };

            couchService
                .getCategories($routeParams.category)
                .then(function(data) {
                    if (!data.children){
                        navigationService.navigateToProducts(data.urlId);
                    }
                    else{
                        $scope.categories = data;
                    }
                });
        }
    ]);
