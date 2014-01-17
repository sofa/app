angular.module('sdk.directives.ccCategoryTreeView')
    .directive('ccCategoryTreeView', ['couchService', 'categoryTreeViewRemote', function(couchService, categoryTreeViewRemote) {

        'use strict';

        return {
            restrict: 'EA',
            scope:{},
            replace: true,
            templateUrl: 'src/directives/ccCategoryTreeView/cc-category-tree-view.tpl.html',
            link: function($scope, $element, attributes, controller){
                couchService
                    .getCategory()
                    .then(function(rootCategory){
                        $scope.items = rootCategory && rootCategory.children ? rootCategory.children : [];
                        $scope.item = rootCategory;
                        categoryTreeViewRemote.toggleVisibility(rootCategory);


                        $scope.items.forEach(function(item){
                            categoryTreeViewRemote.setItemLevel(item, 1);
                        });

                    });
            }
        };
    }]);