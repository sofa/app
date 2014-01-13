angular.module('sdk.directives.ccCategoryTreeView')
    .directive('ccNestedCategoryItem', ['$compile', 'categoryTreeViewRemote', 'navigationService', 'snapRemote', function($compile, categoryTreeViewRemote, navigationService, snapRemote) {

        'use strict';

        return {
            restrict: 'A',
            require: '^ccTemplateCode',
            link: function($scope, $element, attributes, controller){
                if ($scope.item.children){
                    $scope.items = $scope.item.children;
                    var html = $compile(controller.templateCode)($scope);
                    $element.append(html);
                }
                $scope.remoteControl = categoryTreeViewRemote;

                $scope.doAction = function(item){
                    if (!item.hasChildren){
                        snapRemote.close();
                        navigationService.navigateToProducts(item.urlId);
                    }
                    else{
                        categoryTreeViewRemote.toggleVisibility(item);
                    }
                };
            }
        };
    }]);