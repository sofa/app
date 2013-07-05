'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'CategoryControllerTablet',
    [
        '$scope', '$stateParams', 'couchService', 'navigationService', 'backStepHighlightService', 'category', '$state', 'splitViewDataService', 'splitViewSlideDirectionService', 'selectionService',
        function CategoryController($scope, $stateParams, couchService, navigationService, backStepHighlightService, category, $state, splitViewDataService, splitViewSlideDirectionService, selectionService) {

            $scope.backStepHighlightService = backStepHighlightService;

            splitViewDataService.rightCategory = null;

            $scope.goToCategory = function(category, $index, $event){

                selectionService.select($stateParams.category, angular.element($event.currentTarget));
                splitViewSlideDirectionService.setCurrentIndex($state.current.name, $index);

                //It currently only works if we use transitionTo. Directly modifying the URL
                //does not work for whatever reasons.
                //It might be related to this bug:
                //https://github.com/angular-ui/ui-router/issues/237

                //$state.transitionTo('cat.filled.list', { category: category.urlId});

                if (!category.children){
                    splitViewDataService.leftCategory = category.parent;
                    $state.transitionTo('cat.filled.products', { category: category.urlId});
                } else {
                    $state.transitionTo('cat.filled.list', { category: category.urlId});
                }

                // if (!category.children){
                //     navigationService.navigateToProducts(category.urlId);
                // } else {
                //     navigationService.navigateToCategory(category.urlId);
                // }
            };
        }
    ]);
