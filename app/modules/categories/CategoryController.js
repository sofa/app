'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'CategoryController',
    [
        '$scope', '$routeParams', 'couchService', 'navigationService', 'category',
        function CategoryController($scope, $routeParams, couchService, navigationService, category) {

            $scope.goToCategory = function(category){
                if (!category.children){
                    navigationService.navigateToProducts(category.urlId);
                } else {
                    navigationService.navigateToCategory(category.urlId);
                }
            };

            if (!category.children){
                navigationService.navigateToProducts(category.urlId);
            }
            else{
                $scope.category = category;
            }
        }
    ]);
