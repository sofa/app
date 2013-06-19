angular
    .module('CouchCommerceApp')
    .controller( 'PagesController',
    [
        '$scope', '$routeParams', '$http', 'pagesService',
        function CategoryController($scope, $routeParams, $http, pagesService) {

            'use strict';

            var pagesVm = this;

            pagesVm.isLoading = true;

            pagesService
                .getPage($routeParams.pageId)
                .then(function(page){
                    pagesVm.page = page;
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
