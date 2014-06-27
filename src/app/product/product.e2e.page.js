var ProductPage = function () {

    this.thumbnails = function () {
        return element.all(by.repeater('image in images'));
    };

    this.wishlistButton = function () {
        return element(by.className('cc-wishlist-button'));
    };

    this.cartButton = function () {
        return element(by.className('cc-product-buy-box__add-to-cart'));
    };
};

module.exports = new ProductPage();
