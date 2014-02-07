describe('CouchCommerce App', function () {

    var app = require('../app.e2e.page.js');

    it('should show search bar on click on search icon', function () {
        app.openSearchBar();
        expect(app.searchBar().isDisplayed()).toBe(true);
    });
});
