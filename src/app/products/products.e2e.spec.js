'use strict';
describe('CouchCommerce App', function () {

    var app = require('../app.e2e.page.js');

    beforeEach(function () {
        app.navigateTo('/genusswelten/tees-und-zubehoer/tees');
    });

    it('should be on products page', function () {
        expect(browser.getCurrentUrl()).toMatch('tees');
    });

    it('should show products', function () {
        expect(element(by.className('cc-products__list')).isDisplayed()).toBe(true);
        var products = element.all(by.repeater('product in products'));
        expect(products.count()).toBe(14);
    });

    it('should have a filter select', function () {
        var select = element(by.model('model'));
        expect(select.isPresent()).toBe(true);
    });
});
