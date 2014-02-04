'use strict';

describe('CouchCommerce App', function () {

    it('should open snap menu on click', function () {
        browser.get('/');
        element(by.className('fa-bars')).click();

        expect(element(by.className('cc-side-menu')).isDisplayed()).toBe(true);
    });
    it('should open snap menu on click', function () {
        browser.get('/');
        element(by.className('fa-bars')).click();

        expect(element(by.className('cc-side-menu')).isDisplayed()).toBe(true);
        element(by.className('fa-bars')).click();
        // browser.debugger();
        browser.wait(function () {
            return element(by.className('cc-side-menu')).isDisplayed().then(function (displayed) {
                return !displayed;
            });
        }, 1000, 'menu should disappear');
    });
});
