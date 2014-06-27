'use strict';

describe('CouchCommerce App', function () {

    var app = require('../app.e2e.page.js');

    beforeEach(function () {
        app.navigateTo('/');
    });

    it('should show cart', function () {
        app.openCart();
        expect(app.cartMenu().isDisplayed()).toBe(true);
    });

    it('should show trused shop context view', function () {
        var footerItems = app.footerItems();
        footerItems.get(0).click();
        expect(element(by.className('cc-context-view')).isDisplayed()).toBe(true);
    });

    it('should return to desktop version', function () {
        var footerItems = app.footerItems();
        footerItems.get(1).click();
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toMatch('couchcommerce.shopwaredemo.de');
        browser.ignoreSynchronization = false;
    });
});
