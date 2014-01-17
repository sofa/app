module('cc.models.product.tests');

test('it should be marked as out of stock', function() {

    var product = new cc.models.Product();
    product.qty = 0;

    equal(product.isOutOfStock(), true, 'product is out of stock');
});


test('it should be marked as out of stock (2)', function() {

    var product = new cc.models.Product();
    product.qty = -1;

    equal(product.isOutOfStock(), true, 'product is out of stock');
});

test('it should be marked as out of stock (all variants have a stock of 0', function() {

    var product = new cc.models.Product();
    product.qty = 1;

    product.variants =  [{
                            //we need to mock it as strings until the backend is fixed
                            stock: '0'
                        },{
                            stock: '0'
                        }];

    equal(product.isOutOfStock(), true, 'product is out stock');
});

test('it should be marked as in stock (some variants have stock)', function() {

    var product = new cc.models.Product();
    product.qty = 1;

    product.variants =  [{
                            //we need to mock it as strings until the backend is fixed
                            stock: '1'
                        },{
                            stock: '0'
                        }];

    equal(product.isOutOfStock(), false, 'product is in stock');
});

test('it should be marked as in stock (some variants have stock, ignoring 0 qty)', function() {

    var product = new cc.models.Product();
    product.qty = 0;

    product.variants =  [{
                            //we need to mock it as strings until the backend is fixed
                            stock: '1'
                        },{
                            stock: '0'
                        }];

    equal(product.isOutOfStock(), false, 'product is in stock');
});

test('it should be marked as in stock', function() {

    var product = new cc.models.Product();
    product.qty = 1;

    equal(product.isOutOfStock(), false, 'product is in stock');
});

test('it should be marked as in stock (no qty)', function() {

    var product = new cc.models.Product();
    equal(product.isOutOfStock(), false, 'product is in stock');
});

test('it should be marked as in stock (qty is null)', function() {

    var product = new cc.models.Product();
    product.qty = null;
    equal(product.isOutOfStock(), false, 'product is in stock');
});