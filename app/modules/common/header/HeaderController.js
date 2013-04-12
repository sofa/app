'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'HeaderController',
    [
        '$scope', '$location', 'navigationService', 'couchService',
        function CategoryController($scope, $location, navigationService, couchService) {

            $scope.goBack = function(){
                navigationService.goUp();
//                var currentCategory = couchService.getCurrentCategory();
//                if (navigationService.isView('product')){
//                    if (currentCategory){
//                        $location.path('')
//                    }
//                }
//                else if (navigationService.isView('products')){
//
//                }
            };
        }
    ]);
