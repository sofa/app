'use strict';

angular.module('CouchCommerceApp').factory('searchUiState', function (inputFocusFixConfigService) {

    var self = {};

    self.results = [];

    var isOpen = false;

    self.isOpen = function () {
        return isOpen;
    };

    self.openSearch = function () {
        isOpen = true;
        inputFocusFixConfigService.enabled = true;
    };

    self.closeSearch = function () {
        isOpen = false;
        inputFocusFixConfigService.enabled = false;
    };

    self.searchTerm = '';

    self.isRunningSearch = false;

    self.abort = function () {
        self.searchTerm = '';
        self.closeSearch();
    };

    self.hasSearchTerm = function () {
        return self.searchTerm.length > 0;
    };

    self.clear = function () {

        if (!self.hasSearchTerm()) {
            self.abort();
        } else {
            self.searchTerm = '';
        }
    };

    self.clear();

    self.setResults = function (newResults) {
        self.results = newResults;
    };

    self.hasResults = function () {
        return self.results.length > 0;
    };

    self.hasNoMatch = function () {
        return !self.hasResults() &&
            !self.isRunningSearch &&
            self.hasSearchTerm();
    };

    return self;
});
