'use strict';
describe('CouchCommerce App', function () {

    var app = require('../app.e2e.page.js');
    var productPage = require('./product.e2e.page.js');

    beforeEach(function () {
        app.navigateTo('/genusswelten/tees-und-zubehoer/tees/13/pai-mu-tan-tee-weiss');
    });

    it('should show product page', function () {
        expect(browser.getCurrentUrl()).toMatch('pai-mu-tan-tee-weiss');
    });

    it('should have product big product image', function () {
        var imageWrapper = element(by.className('cc-product-view-image-wrapper'));
        expect(imageWrapper.isPresent()).toBe(true);
    });

    it('should have a thumbnail bar', function () {
        var thumbnailBar = element(by.className('cc-thumbnail-bar'));
        expect(thumbnailBar.isPresent()).toBe(true);
    });

    it('should have thumbnails', function () {
        var thumbnails = productPage.thumbnails();
        expect(thumbnails.count()).toBe(4);
    });

    it('should have two zippy elements', function () {
        var zippys = element.all(by.className('cc-zippy'));
        expect(zippys.count()).toBe(2);
    });

    it('should open zippys on click', function () {
        var zippys = element.all(by.className('cc-zippy'));

        var detailsZippy = zippys.get(1);
        detailsZippy.findElement(by.className('cc-zippy__caption')).click();
        expect(detailsZippy.findElement(by.className('cc-zippy__content')).isDisplayed()).toBe(true);
    });

    it('should put products on wishlist', function () {
        browser.sleep(500);
        productPage.wishlistButton().click();
        expect(app.wishList().isDisplayed()).toBe(true);
        var items = element.all(by.repeater('(key,item) in wishlist'));
        expect(items.count()).toBe(1);
    });

    it('should put products into cart', function () {
        productPage.cartButton().click();
        expect(app.cartMenu().isDisplayed()).toBe(true);
    });
});
