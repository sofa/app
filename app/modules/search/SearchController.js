

angular
    .module('CouchCommerceApp')
    .controller('SearchController',
    [
        '$scope', 'searchService', 'searchUiState', '$rootScope', '$dialog',
        function SearchController($scope, searchService, searchUiState, $rootScope, $dialog) {

            'use strict';

            //We need to strive for ballance here. On the one hand
            //names like 'header.SearchButtonClicked' are pretty bad
            //because what if we also want to show the search on a
            //keyboard shortcut?
            //In general the SearchController should not know about
            //things like the header etc.
            //On the other hand, if we use a generic event name like
            //"ShowSearchRequested" how do we differentiate for
            //Google Analytics? We surely would like to know whether
            //the user uses the button or the shortcuts more?

            //I think what might work best would be a service that listens
            //for all the concrete events but then emits a new generic
            //event that the SearchController can subscribe to?

            $scope.$onRootScope('header.searchButtonClicked', function(){
                searchUiState.isOpen = true;
            });

            var vm = this;

            vm.searchUiState = searchUiState;

            $scope.abort = function(){
                searchUiState.isOpen = false;
                $scope.clear();
            };

            $scope.clear = function(){
                vm.searchTerm = '';
            };

            $scope.clear();

            $scope.$watch('vm.searchTerm', function(searchTerm){

                searchService
                    .search(searchTerm, { groupKey: 'categoryUrlKey', groupText: 'categoryName'})
                    .then(function(response){
                        searchUiState.setResults(response.data.groupedResults);
                    });
            });
        }
    ]);
