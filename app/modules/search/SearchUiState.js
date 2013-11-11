angular
    .module('CouchCommerceApp')
    .factory('searchUiState',[function () {

            'use strict';

            var self = {};
            
            self.results = [];

            self.isOpen = false;

            self.abort = function(){
                self.searchTerm = '';
                self.isOpen = false;
            };

            self.clear = function(){
                self.searchTerm = '';
            };

            self.clear();

            self.setResults = function(newResults){
                self.results = newResults;
            };

            self.hasResults = function(){
                return self.results.length > 0;
            };

            return self;
        }
    ]);
