'use strict';

describe('CouchCommerce App', function () {

    var app = require('./app.e2e.page.js');

    beforeEach(function () {
        app.navigateTo('/');
    });

    it('should open snap menu on click', function () {
        app.toggleSnapMenu();
        expect(app.snapMenu().isDisplayed()).toBe(true);
    });

    it('should open snap menu on click', function () {
        // open menu
        app.toggleSnapMenu();
        expect(app.snapMenu().isDisplayed()).toBe(true);
        // close menu
        // expect(app.snapMenu().isDisplayed()).toBe(false);

        // browser.wait(function () {
        //     return app.snapMenu().isDisplayed().then(function (displayed) {
        //         return !displayed;
        //     });
        // }, 1000, 'menu should disappear');
    });

    it('should open category tree', function () {
        app.toggleSnapMenu();
        var categories = element.all(by.repeater('item in items'));

        categories.get(0).click();
        expect(categories.get(0).findElement(by.className('cc-category-tree-view__list--child')).isDisplayed()).toBe(true);
    });

    it('should show wishlist', function () {
        app.toggleSnapMenu();
        var tabs = element.all(by.className('cc-side-menu-tabs__icon'));
        tabs.get(1).click();
        expect(app.wishList().isDisplayed()).toBe(true);
    });
});
