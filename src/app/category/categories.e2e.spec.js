'use strict';
describe('CouchCommerce App', function () {

    var app = require('../app.e2e.page.js');

    beforeEach(function () {
        app.navigateTo('/genusswelten');
    });

    it('should navigate through category tree', function () {
        var categories = element.all(by.repeater('category in category.children'));
        categories.get(0).findElement(by.tagName('a')).click();
        expect(browser.getCurrentUrl()).toMatch('genusswelten');
    });

    it('should show category listing', function () {
        expect(element(by.className('cc-category-list')).isDisplayed()).toBe(true);
        var categories = element.all(by.repeater('category in category.children'));
        expect(categories.count()).toEqual(3);
    });
});
