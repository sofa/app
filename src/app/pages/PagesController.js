'use strict';

angular.module('CouchCommerceApp').controller('PagesController', function CategoryController($scope, $stateParams, $http, pagesService, pagesServiceExtension, titleService) {

    $scope.isLoading = true;

    pagesService
        .getPage(angular.isDefined($stateParams.pageId) ? $stateParams.pageId : pagesServiceExtension.currentPageId)
        .then(function (page) {
            titleService.setTitleWithSuffix(page.title);
            $scope.page = page;
            $scope.mailTo = 'mailto:?subject=' + page.title + '&body=' + page.content;
            $scope.isLoading = false;
        }, function () {
            $scope.isLoading = false;
            // in the template we automatically show a 404 page if the page is empty
            // and `isLoading` is false.
        });
});
