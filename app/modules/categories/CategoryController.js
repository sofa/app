

angular
    .module('CouchCommerceApp')
    .controller( 'CategoryController',
    [
        '$scope', '$stateParams', 'couchService', 'navigationService', 'backStepHighlightService', 'category', 'selectionService',
        function CategoryController($scope, $stateParams, couchService, navigationService, backStepHighlightService, category, selectionService) {

            'use strict';

            $scope.backStepHighlightService = backStepHighlightService;

            $scope.goToCategory = function(category, $event){

                selectionService.select($stateParams.category, angular.element($event.currentTarget));

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
