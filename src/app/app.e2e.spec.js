'use strict';

describe('CouchCommerce App', function () {

    var app = require('./app.page.js');

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
        app.toggleSnapMenu();

        browser.wait(function () {
            return app.snapMenu().isDisplayed().then(function (displayed) {
                return !displayed;
            });
        }, 1000, 'menu should disappear');
    });
});
