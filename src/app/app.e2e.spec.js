'use strict';

describe('CouchCommerce App', function () {

    it('should open snap menu on click', function () {
        browser.get('/');
        element(by.className('fa-bars')).click();

        expect(element(by.className('cc-side-menu')).isDisplayed()).toBe(true);
    });
});
