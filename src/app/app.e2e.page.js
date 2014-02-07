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

};

module.exports = new CouchCommerceApp();
