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
                }, function(err){
                    //TODO: show 404 page
                    console.log(err);
                });

            // $http
            //     .get('data/pages/neptune.html')
            //     .then(function(result){
            //         pagesVm.content = result.data;
            //         console.log(result.data);
            //     });

        }
    ]);
