'use strict';

var CouchCommerceApp = function () {

    this.navigateTo = function (url) {
        browser.get(url);
    };

    this.snapMenu = function () {
        return element(by.className('cc-side-menu'));
    };

    this.toggleSnapMenu = function () {
        element(by.className('fa-bars')).click();
    };

    this.openSearchBar = function () {
        element(by.className('fa-search')).click();
    };

    this.searchBar = function () {
        return element(by.className('cc-search-box__input'));
    };
};

module.exports = new CouchCommerceApp();
