angular
    .module('CouchCommerceApp')
    .factory('searchUiState',[function () {

            'use strict';

            var self = {};
            
            self.results = [];

            self.isOpen = false;

            self.searchTerm = '';

            self.abort = function(){
                self.searchTerm = '';
                self.isOpen = false;
            };

            self.clear = function(){

                if (self.searchTerm.length === 0){
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

            return self;
        }
    ]);
