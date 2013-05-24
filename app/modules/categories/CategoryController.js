'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'CategoryController',
    [
        '$scope', '$routeParams', '$location', 'couchService', 'navigationService',
        function CategoryController($scope, $routeParams, $location, couchService, navigationService) {

            $scope.goToCategory = function(category){
                if (!category.children){
                    navigationService.navigateToProducts(category.urlId);
                } else {
                    $location.path('cat/' + category.urlId);
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
