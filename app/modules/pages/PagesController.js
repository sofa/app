angular
    .module('CouchCommerceApp')
    .controller( 'PagesController',
    [
        '$scope', '$stateParams', '$http', 'pagesService',
        function CategoryController($scope, $stateParams, $http, pagesService) {

            'use strict';

            var pagesVm = this;

            pagesVm.isLoading = true;

            pagesService
                .getPage($stateParams.pageId)
                .then(function(page){
                    pagesVm.page = page;
                    pagesVm.mailTo = 'mailto:?subject=' + page.title + '&body=' + page.content;
                    pagesVm.isLoading = false;
                }, function(err){
                    pagesVm.isLoading = false;
                    //TODO: show 404 page
                    console.log(err);
                });
        }
    ]);
