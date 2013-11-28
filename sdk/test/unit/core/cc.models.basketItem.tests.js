module('cc.models.basketItem.tests');

test('it should calculate total with the price of the variant', function() {

    var product = new cc.models.Product();
    product.price = 9;

    var basketItem = new cc.models.BasketItem();
    basketItem.product = product;
    basketItem.variant = {
        price: 10
    };
    basketItem.quantity = 2;

    equal(basketItem.getTotal(), 20, 'uses price of variant');
});

test('it should calculate total with the price of the variant also with prices as strings', function() {

    var product = new cc.models.Product();
    product.price = 9;

    var basketItem = new cc.models.BasketItem();
    basketItem.product = product;
    basketItem.variant = {
        price: '10'
    };
    basketItem.quantity = 2;

    equal(basketItem.getTotal(), 20, 'uses price of variant');
});