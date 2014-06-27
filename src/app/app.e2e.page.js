'use strict';

var CouchCommerceApp = function () {

    this.navigateTo = function (url) {
        browser.get(url);
    };

    this.snapMenu = function () {
        return element(by.className('cc-side-menu'));
    };

    this.toggleSnapMenu = function () {
        element(by.className('cc-header__icon--sidemenu')).click();
    };

    this.openSearchBar = function () {
        element(by.className('cc-header__icon--search')).click();
    };

    this.closeSearchBar = function () {
        element(by.className('cc-search-box__close')).click();
    };

    this.searchBar = function () {
        return element(by.model('_value'));
    };

    this.searchResultsList = function () {
        return element(by.className('cc-search-result__group-list'));
    };

    this.searchResults = function () {
        return element.all(by.repeater('product in result.items'));
    };

    this.openCart = function () {
        element(by.className('cc-header__icon--cart')).click();
    };

    this.cartMenu = function () {
        return element(by.className('cc-side-menu--cart'));
    };

    this.wishList = function () {
        return element(by.className('cc-wishlist'));
    };

    this.footerItems = function () {
        return element.all(by.className('cc-trust-list__item'));
    };
};

module.exports = new CouchCommerceApp();
