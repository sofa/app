
angular.module('sdk.directives.ccBreadcrumbs', [
        'src/directives/ccBreadcrumbs/cc-breadcrumbs.tpl.html',
        'sdk.services.urlParserService',
        'sdk.services.urlConstructionService',
        'sdk.services.couchService'
    ]);

angular.module('sdk.directives.ccBreadcrumbs')
    .directive('ccBreadcrumbs', ['$location', 'urlParserService', 'urlConstructionService', 'couchService', function($location, urlParserService, urlConstructionService, couchService) {

        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'src/directives/ccBreadcrumbs/cc-breadcrumbs.tpl.html',
            scope: {
                data: '=?'
            },
            link: function($scope, $element, attrs){

                var categoryToLinkTitleList = function(category){
                    var list = [];

                    var doIt = function(currentCategory){
                        if(currentCategory.parent){
                            list.unshift({
                                title: currentCategory.label,
                                link: currentCategory.urlId
                            });

                            doIt(currentCategory.parent);
                        }
                    };

                    doIt(category);

                    return list;
                };

                var prependRootLink = function(list){
                    //get rid of hardcoded stuff
                    list.unshift({
                        title: 'Startseite',
                        link: '/'
                    });

                    return list;
                };

                $scope.$watch(function(){
                    return $location.path();
                }, function(){
                    if(!urlParserService.isRootCategory() ||
                        urlParserService.isView('categories') ||
                        urlParserService.isView('products') ||
                        urlParserService.isView('product')){

                        var categoryUrlId = urlParserService.getCategoryUrlId();

                        couchService
                            .getCategory(categoryUrlId)
                            .then(function(category){
                                var data = prependRootLink(
                                                categoryToLinkTitleList(category));

                                if (urlParserService.isView('products')){
                                    data.pop();
                                }

                                $scope.data = data;
                            });
                    }
                });
            }
        };
    }]);