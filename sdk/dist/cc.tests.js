test('can create BasketService instance', function() {
    var basketService = new cc.BasketService();
    ok(basketService, 'Created basketService instance' );
});

test('can create BasketService instance', function() {
    var basketService = new cc.BasketService();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1);

    ok(basketItem.product === product, 'retrieved product from basketItem');
});

test('cumulates same products', function() {
    var basketService = new cc.BasketService();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1);
    var basketItem2 = basketService.addItem(product, 1);

    ok(basketService.exists(product), 'product exists');
    ok(basketItem.product === product, 'retrieved product from basketItem');
    ok(basketItem === basketItem2, 'baksetItems are identical');
    ok(basketItem.quantity === 2, 'has a quantity of two');
    ok(basketService.getItems().length === 1, 'has only one item');

});

test('can increase quantity by any number', function() {
    var basketService = new cc.BasketService();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1);
    var basketItem2 = basketService.addItem(product, 2);

    ok(basketItem.product === product, 'retrieved product from basketItem');
    ok(basketItem === basketItem2, 'baksetItems are identical');
    ok(basketItem.quantity === 3, 'has a quantity of three');
    ok(basketService.getItems().length === 1, 'has only one item');

});

test('does not cumulate same products with different variantIds', function() {
    var basketService = new cc.BasketService();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1, 123);
    var basketItem2 = basketService.addItem(product, 1, 456);

    ok(basketService.exists(product, 123), 'product exists');
    ok(basketService.exists(product, 456), 'product exists');
    
    ok(basketItem.product === product, 'retrieved product from basketItem');
    ok(basketItem2.product === product, 'retrieved product from basketItem2');

    ok(basketItem !== basketItem2, 'baksetItems are different');
    ok(basketItem.quantity === 1, 'has a quantity of one');
    ok(basketItem2.quantity === 1, 'has a quantity of one');
    
    ok(basketService.getItems().length === 2, 'has two items');
});

test('cumulates same products with identical variantIds', function() {
    var basketService = new cc.BasketService();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1, 1);
    var basketItem2 = basketService.addItem(product, 1, 1);

    ok(basketItem.product === product, 'retrieved product from basketItem');
    ok(basketItem2.product === product, 'retrieved product from basketItem2');

    ok(basketItem === basketItem2, 'baksetItems are identical');
    ok(basketItem.quantity === 2, 'has a quantity of two');;
    
    ok(basketService.getItems().length === 1, 'has one item');
});


test('cumulates same products with identical optionIds', function() {
    var basketService = new cc.BasketService();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1, 1, 1);
    var basketItem2 = basketService.addItem(product, 1, 1, 1);

    ok(basketItem.product === product, 'retrieved product from basketItem');
    ok(basketItem2.product === product, 'retrieved product from basketItem2');

    ok(basketItem === basketItem2, 'baksetItems are identical');
    ok(basketItem.quantity === 2, 'has a quantity of two');;
    
    ok(basketService.getItems().length === 1, 'has one item');
});

test('does not cumulate same products with different optionIds', function() {
    var basketService = new cc.BasketService();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1, 1, 123);
    var basketItem2 = basketService.addItem(product, 1, 1, 456);


    ok(basketService.exists(product, 1, 123), 'product exists');
    ok(basketService.exists(product, 1, 456), 'product exists');
    
    ok(basketItem.product === product, 'retrieved product from basketItem');
    ok(basketItem2.product === product, 'retrieved product from basketItem2');

    ok(basketItem !== basketItem2, 'baksetItems are different');
    ok(basketItem.quantity === 1, 'has a quantity of one');
    ok(basketItem2.quantity === 1, 'has a quantity of one');
    
    ok(basketService.getItems().length === 2, 'has two items');
});

test('can remove items by any number', function() {
    var basketService = new cc.BasketService();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 10);;

    ok(basketItem.product === product, 'retrieved product from basketItem');
    ok(basketItem.quantity === 10, 'has a quantity of tten');

    basketService.removeItem(product, 5);

    ok(basketItem.quantity === 5, 'has a quantity of five');
});

test('trying to remove an non existing item raises exception', function() {
    var basketService = new cc.BasketService();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    throws(function(){
        basketService.removeItem(product, 5);
    }, Error);
});

test('trying to remove more items than what exists in basket raises exception', function() {
    var basketService = new cc.BasketService();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 10);;

    ok(basketItem.product === product, 'retrieved product from basketItem');
    ok(basketItem.quantity === 10, 'has a quantity of ten');

    throws(function(){
        basketService.removeItem(product, 11);
        ok(basketItem.quantity === 10, 'quantity was not touched');
    }, Error);
});

test('can clear all items', function() {
    var basketService = new cc.BasketService();

    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1, 123);
    var basketItem2 = basketService.addItem(product, 1, 456);

    var product2 = new cc.models.Product();
    product2.name = 'Testproduct';
    product2.id = 12;

    var basketItem = basketService.addItem(product2, 1, 123);
    var basketItem2 = basketService.addItem(product2, 1, 456);
    
    ok(basketService.getItems().length === 4, 'has four items');

    basketService.clear();

    ok(basketService.getItems().length === 0, 'has zero items');
});
