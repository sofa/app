'use strict';
describe('CouchCommerce App', function () {

    var app = require('../app.e2e.page.js');

    beforeEach(function () {
        app.navigateTo('/');
    });

    it('should show search bar on click on search icon', function () {
        app.openSearchBar();
        expect(app.searchBar().isDisplayed()).toBe(true);
        app.closeSearchBar();
    });

    it('should show search results', function () {
        app.openSearchBar();
        app.searchBar().sendKeys('Tasche');
        // browser.debugger();
        browser.wait(function () {
            return app.searchResultsList().isDisplayed().then(function (displayed) {
                return !displayed;
            });
        }, 500, 'show search results');
        app.closeSearchBar();
    });

    it('should return the right result count', function () {
        app.openSearchBar();
        app.searchBar().sendKeys('Tasche');
        browser.wait(function () {
            return app.searchResults().count().then(function (count) {
                return count === 2;
            });
        }, 500, 'have right result count');
    });
});
