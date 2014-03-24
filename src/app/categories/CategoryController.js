'use strict';

angular.module('CouchCommerceApp')
.controller('CategoryController', function ($scope, $stateParams, couchService, navigationService, backStepHighlightService, category, selectionService, urlParserService, categoryTreeViewRemote, titleService, $state) {

    if (!category) {
        return;
    }

    //we want to set the active category in the side menu.
    categoryTreeViewRemote.setActive(category);

    $scope.urlParserService = urlParserService;
    $scope.backStepHighlightService = backStepHighlightService;

    $scope.goToCategory = function (category, $event) {
        $event.preventDefault();
        selectionService.select($stateParams.category, angular.element($event.currentTarget));

        //even if we have the category already provided by the function parameter,
        //we have to fetch it again via the couchService. The reason for that is, that
        //it might be a leaf with no children but it's just an alias to a category
        //which does have children. In this case, we want to get to the real category
        //which has the children.

        //in 99% of the cases we will just get the same category returned by the couchService
        //as the one we got via the function parameter but for such alias corner cases it's important
        //to retrieve it through the couchService.
        couchService
            .getCategory(category.urlId)
            .then(function (realCategory) {
                if (!realCategory.children) {
                    navigationService.navigateToUrl(realCategory.getOriginFullUrl());
                } else {
                    navigationService.navigateToUrl(realCategory.getOriginFullUrl());
                }
            });
    };

    if ($state.current.url !== '/') {
        titleService.setTitleWithSuffix(category.label);
    } else {
        titleService.setShopNameTitle();
    }

    $scope.category = category;
    $scope.headline = !category.parent ? $scope.ln.welcomeText : category.label;
});
