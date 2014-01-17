module('cc.basketService.tests');

var createBasketService = function(){
    return new cc.BasketService(new cc.LocalStorageService(), new cc.ConfigService());
};

test('can create BasketService instance', function() {
    var basketService = createBasketService();
    basketService.clear();
    ok(basketService, 'Created basketService instance' );
});

test('can add item', function() {
    var basketService = createBasketService();
    basketService.clear();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1);
    var summary = basketService.getSummary();

    ok(summary.quantity === 1, 'has a summary of one');
    ok(basketItem.product === product, 'retrieved product from basketItem');

});

test('trying to add an item that is out of stock raises exception', function() {
    var basketService = createBasketService();
    basketService.clear();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;
    product.qty = 0;
    
    throws(function(){
        var basketItem = basketService.addItem(product, 1);
    }, Error);

    var summary = basketService.getSummary();

    ok(summary.quantity === 0, 'has a summary of none');
});

test('removing the last item removes the whole basket item', function() {
    var basketService = createBasketService();
    basketService.clear();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1);
    var summary = basketService.getSummary();

    ok(summary.quantity === 1, 'has a summary of one');
    ok(basketItem.product === product, 'retrieved product from basketItem');

    var itemRemovedCalled = 0;
    basketService.on('itemRemoved', function(){
        //it's important to proof that the item was already removed
        //by the time the event fires
        summary = basketService.getSummary();
        ok(summary.quantity === 0, 'has zero items');
        ok(basketService.getItems().length === 0, 'has zero items');
        itemRemovedCalled++; 
    });

    basketService.decreaseOne(basketItem);

    ok(itemRemovedCalled === 1, 'itemRemoved was fired');
});

test('can use increase and decrease shorthands', function() {
    var basketService = createBasketService();
    basketService.clear();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1);
    var summary = basketService.getSummary();

    ok(summary.quantity === 1, 'has a summary of 1');
    ok(basketItem.product === product, 'retrieved product from basketItem');
    ok(basketItem.quantity === 1, 'has a quantity of 1');

    basketService.increaseOne(basketItem);

    summary = basketService.getSummary();

    ok(summary.quantity === 2, 'has a summary of 2');
    ok(basketItem.quantity === 2, 'has a quantity of 2');

    basketService.decreaseOne(basketItem);

    summary = basketService.getSummary();

    ok(summary.quantity === 1, 'has a summary of 1');
    ok(basketItem.quantity === 1, 'has a quantity of 1');

    basketService.increase(basketItem, 10);

    summary = basketService.getSummary();

    ok(summary.quantity === 11, 'has a summary of 11');
    ok(basketItem.quantity === 11, 'has a quantity of 11');


    basketService.decrease(basketItem, 10);

    summary = basketService.getSummary();

    ok(summary.quantity === 1, 'has a summary of 1');
    ok(basketItem.quantity === 1, 'has a quantity of 1');

});

test('cumulates same products', function() {
    var basketService = createBasketService();
    basketService.clear();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;
    product.price = 2;

    var itemAddedCalled = 0;

    basketService.on('itemAdded', function(){ itemAddedCalled++; });

    var basketItem = basketService.addItem(product, 1);
    var basketItem2 = basketService.addItem(product, 1);
    var summary = basketService.getSummary();

    ok(itemAddedCalled === 2, 'raises itemAdded event two times');
    ok(summary.quantity === 2, 'has a quantity of two');
    ok(basketService.exists(product), 'product exists');
    ok(basketItem.product === product, 'retrieved product from basketItem');
    ok(basketItem === basketItem2, 'baksetItems are identical');
    ok(basketItem.quantity === 2, 'has a quantity of two');
    ok(basketItem.getTotal() === 4, 'has a total price of four');
    ok(basketService.getItems().length === 1, 'has only one item');

});

test('cumulates same products even after app reload', function() {
    var basketService = createBasketService();
    basketService.clear();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;
    product.price = 2;

    var itemAddedCalled = 0;

    basketService.on('itemAdded', function(){ itemAddedCalled++; });

    //we intentionally set variant and optionID to null here because
    //it has been a regression once that null values were not preserved
    //after reloading the app due to a bug in cc.Util.extend
    var basketItem = basketService.addItem(product, 1, null, null);

    //we create a fresh basketService instance to mock the case that the
    //app was reloaded
    var freshBasketService = createBasketService();
    freshBasketService.on('itemAdded', function(){ itemAddedCalled++; });
    var basketItem2 = freshBasketService.addItem(product, 1, null, null);
    var summary = freshBasketService.getSummary();

    ok(itemAddedCalled === 2, 'raises itemAdded event two times');
    ok(summary.quantity === 2, 'has a quantity of two');
    ok(basketItem2.product === product, 'retrieved product from basketItem');
    ok(basketItem2.quantity === 2, 'has a quantity of two');
    ok(basketItem2.getTotal() === 4, 'has a total price of four');
    ok(freshBasketService.getItems().length === 1, 'has only one item');
});

test('can increase quantity by any number', function() {
    var basketService = createBasketService();
    basketService.clear();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1);
    var basketItem2 = basketService.addItem(product, 2);

    var summary = basketService.getSummary();

    ok(summary.quantity === 3, 'has a quantity of three');
    ok(basketItem.product === product, 'retrieved product from basketItem');
    ok(basketItem === basketItem2, 'baksetItems are identical');
    ok(basketItem.quantity === 3, 'has a quantity of three');
    ok(basketService.getItems().length === 1, 'has only one item');
});

test('does not cumulate same products with different variantIds', function() {
    var basketService = createBasketService();
    basketService.clear();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1, 123);
    var basketItem2 = basketService.addItem(product, 1, 456);


    var summary = basketService.getSummary();

    ok(summary.quantity === 2, 'has a quantity of two');

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
    var basketService = createBasketService();
    basketService.clear();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1, 1);
    var basketItem2 = basketService.addItem(product, 1, 1);


    var summary = basketService.getSummary();

    ok(summary.quantity === 2, 'has a quantity of two');

    ok(basketItem.product === product, 'retrieved product from basketItem');
    ok(basketItem2.product === product, 'retrieved product from basketItem2');

    ok(basketItem === basketItem2, 'baksetItems are identical');
    ok(basketItem.quantity === 2, 'has a quantity of two');

    ok(basketService.getItems().length === 1, 'has one item');
});


test('cumulates same products with identical optionIds', function() {
    var basketService = createBasketService();
    basketService.clear();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1, 1, 1);
    var basketItem2 = basketService.addItem(product, 1, 1, 1);

    var summary = basketService.getSummary();

    ok(summary.quantity === 2, 'has a quantity of two');

    ok(basketItem.product === product, 'retrieved product from basketItem');
    ok(basketItem2.product === product, 'retrieved product from basketItem2');

    ok(basketItem === basketItem2, 'baksetItems are identical');
    ok(basketItem.quantity === 2, 'has a quantity of two');
    
    ok(basketService.getItems().length === 1, 'has one item');
});

test('does not cumulate same products with different optionIds', function() {
    var basketService = createBasketService();
    basketService.clear();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1, 1, 123);
    var basketItem2 = basketService.addItem(product, 1, 1, 456);


    var summary = basketService.getSummary();

    ok(summary.quantity === 2, 'has a quantity of two');

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
    var basketService = createBasketService();
    basketService.clear();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 10);

    var summary = basketService.getSummary();

    ok(summary.quantity === 10, 'has a quantity of ten');

    ok(basketItem.product === product, 'retrieved product from basketItem');
    ok(basketItem.quantity === 10, 'has a quantity of tten');


    var itemRemovedCalled = 0;

    basketService.on('itemRemoved', function(){ itemRemovedCalled++; });

    basketService.removeItem(product, 5);

    var summaryAfter = basketService.getSummary();

    ok(itemRemovedCalled === 1, 'raises itemRemoved event');
    ok(summaryAfter.quantity === 5, 'has a quantity of five');

    ok(basketItem.quantity === 5, 'has a quantity of five');
});

test('trying to remove an non existing item raises exception', function() {
    var basketService = createBasketService();
    basketService.clear();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    throws(function(){
        basketService.removeItem(product, 5);
    }, Error);
});

test('trying to remove more items than what exists in basket raises exception', function() {
    var basketService = createBasketService();
    basketService.clear();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 10);

    ok(basketItem.product === product, 'retrieved product from basketItem');
    ok(basketItem.quantity === 10, 'has a quantity of ten');

    throws(function(){
        basketService.removeItem(product, 11);
        ok(basketItem.quantity === 10, 'quantity was not touched');
    }, Error);

});

test('can clear all items', function() {
    var basketService = createBasketService();
    basketService.clear();

    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1, 123);
    var basketItem2 = basketService.addItem(product, 1, 456);

    var summary = basketService.getSummary();

    ok(summary.quantity === 2, 'has a quantity of two');

    var product2 = new cc.models.Product();
    product2.name = 'Testproduct';
    product2.id = 12;

    basketItem = basketService.addItem(product2, 1, 123);
    basketItem2 = basketService.addItem(product2, 1, 456);

    ok(basketService.getItems().length === 4, 'has four items');


    var clearedCalled = 0;

    basketService.on('cleared', function(){ clearedCalled++; });

    basketService.clear();

    ok(clearedCalled === 1, 'raises cleared event');

    var summaryAfter = basketService.getSummary();

    ok(summaryAfter.quantity === 0, 'has a quantity of five');

    ok(basketService.getItems().length === 0, 'has zero items');
});

test('calculates summary', function() {
    var basketService = createBasketService();
    basketService.clear();

    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 1;
    product.price = 4.65;
    product.tax = 19;

    var product2 = new cc.models.Product();
    product2.name = 'Testproduct';
    product2.id = 2;
    product2.price = 12.28;
    product2.tax = 7;

    var product3 = new cc.models.Product();
    product3.name = 'Testproduct';
    product3.id = 3;
    product3.price = 9.00;
    product3.tax = 7;

    var variant = {
        price: 10.00
    };

    basketService.addItem(product, 1);
    basketService.addItem(product, 4);

    basketService.addItem(product2, 2);
    basketService.addItem(product2, 3);

    basketService.addItem(product3, 1, variant);

    var summary = basketService.getSummary();
    var itemCount = basketService.getItems().length;

    ok(itemCount === 3, 'has two basketItems');
    ok(summary.quantity === 11, 'has a quantity of 15');
    ok(summary.sum === 94.65, 'calculates sum correctly');
    ok(summary.vat === 9.15, 'calculates VAT correctly');
    ok(summary.total === 99.65, 'calculates total correctly');
    ok(summary.shipping === 5, 'uses shipping costs from config');
});

test('can calculate summary with shippingCost null', function() {
    //FIXME: doesn't feel right to directly fiddle with cc.Config
    var oldShippingCost = cc.Config.shippingCost;
    cc.Config.shippingCost = null;
    var basketService = createBasketService();
    basketService.clear();

    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 1;
    product.price = 4.65;
    product.tax = 19;

    var product2 = new cc.models.Product();
    product2.name = 'Testproduct';
    product2.id = 2;
    product2.price = 12.28;
    product2.tax = 7;

    basketService.addItem(product, 1);
    basketService.addItem(product, 4);

    basketService.addItem(product2, 2);
    basketService.addItem(product2, 3);

    var summary = basketService.getSummary();
    var itemCount = basketService.getItems().length;

    ok(itemCount === 2, 'has two basketItems');
    ok(summary.quantity === 10, 'has a quantity of 15');
    ok(summary.sum === 84.65, 'calculates sum correctly');
    ok(summary.vat === 7.70, 'calculates VAT correctly');
    ok(summary.total === 84.65, 'calculates total correctly');
    ok(summary.shipping === 0, 'uses shipping costs from config');

    cc.Config.shippingCost = oldShippingCost;
});


test('calculates summary', function() {
    var basketService = createBasketService();
    basketService.clear();

    var product = new cc.models.Product();
    product.price = 29.99;
    product.tax = 19;

    basketService.addItem(product, 1);

    var summary = basketService.getSummary({
        paymentMethod: { surcharge: 3 },
        shippingMethod: { price: 2.90 }
    });
    var itemCount = basketService.getItems().length;

    ok(itemCount === 1, 'has no basketItems');
    ok(summary.surchargeStr === '3.00', 'has a surcharge of 3.00');
    ok(summary.surcharge === 3, 'has a surcharge of 3');
    ok(summary.shipping === 2.90, 'uses passed shippingMethod for shipping costs');
    ok(summary.vat === 5.25, 'calculates VAT correctly');
    ok(summary.total === 35.89, 'calculates total correctly');
});
