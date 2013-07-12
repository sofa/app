'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'CategoryController',
    [
        '$scope', '$routeParams', 'couchService', 'navigationService', 'backStepHighlightService', 'category',
        function CategoryController($scope, $routeParams, couchService, navigationService, backStepHighlightService, category) {

            $scope.backStepHighlightService = backStepHighlightService;

            $scope.goToCategory = function(category, $event){

                //this doesn't feel right. Can't we have a tap-highlight directive that
                //hooks into the ng-click somehow?
                angular.element($event.currentTarget).addClass('cc-static-highlight');


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
