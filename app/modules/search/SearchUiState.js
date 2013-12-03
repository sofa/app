angular
    .module('CouchCommerceApp')
    .factory('searchUiState', ['searchService', function(searchService) {

            'use strict';

            var self = {};

            self.results = [];

            self.searchTerm = '';

            self.isRunningSearch = false;

            self.abort = function(){
                self.searchTerm = '';
                searchService.uiActive = false;
            };

            self.hasSearchTerm = function(){
                return self.searchTerm.length > 0;
            };

            self.clear = function(){

                if (!self.hasSearchTerm()){
                    self.abort();
                }
                else{
                    self.searchTerm = '';
                }
            };

            self.clear();

            self.setResults = function(newResults){
                self.results = newResults;
            };

            self.hasResults = function(){
                return self.results.length > 0;
            };

            self.hasNoMatch = function(){
                return !self.hasResults() &&
                       !self.isRunningSearch &&
                       self.hasSearchTerm();
            };

            return self;
        }
    ]);
