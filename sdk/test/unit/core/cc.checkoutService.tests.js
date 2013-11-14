module('cc.checkoutService.tests');

var createHttpService = function(){
    return new cc.mocks.httpService(new cc.QService());
};

var mrPinkAppRepresentation = {
            company: 'Company X',
            salutation: 'Mr',
            surname: 'Pink',
            name: 'John',
            street: 'The mission 1',
            city: 'San Francisco',
            zip: '5677732',
            country: {value: 'US', label: 'United States'},
            email: 'pink@themission.com',
            telephone: '0511-45673623'
        };

var mrPinkBackendRepresentation = {
                                    "company":"Company X",
                                    "salutation":"Mr",
                                    "surname":"Pink",
                                    "name":"John",
                                    "street":"The mission 1",
                                    "city":"San Francisco",
                                    "zip":"5677732",
                                    "country":"US",
                                    "telephone":"0511-45673623",
                                    "email":"pink@themission.com",
                                    "countryLabel":"United States"
                                };

var createCheckoutService = function(httpService, basketService){
    var configService = new cc.ConfigService();
    if(basketService){
        basketService = new cc.BasketService(new cc.LocalStorageService(), new cc.ConfigService());
    }
    return new cc.CheckoutService(httpService, new cc.QService(), basketService, new cc.LoggingService(configService), configService);
};

test('can create CheckoutService instance', function() {
    var checkoutService = createCheckoutService(createHttpService());
    ok(checkoutService, 'Created checkoutService instance' );
});

asyncTest('getSupportCheckoutMethod sends correct data to the backend', function() {
    expect(5);

    var httpService = createHttpService();

    httpService
        .when('POST', cc.Config.checkoutUrl + 'ajax.php')
        .respond({});

    var basketService = new cc.BasketService(new cc.LocalStorageService(), new cc.ConfigService());
    basketService.clear();
    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 10;

    var basketItem = basketService.addItem(product, 1);

    var checkoutService = createCheckoutService(httpService, basketService);

    var checkoutModel = {
        billingAddress: cc.Util.clone(mrPinkAppRepresentation),
        shippingAddress: {
            country: {value: 'DE', label: 'Deutschland'}
        },
        supportedShippingMethods: [],
        supportedPaymentMethods: [],
        selectedPaymentMethod: null,
        selectedShippingMethod: null,
        addressEqual: true
    };

    var checkoutModelClone = cc.Util.clone(checkoutModel);

    checkoutService
        .getSupportedCheckoutMethods(checkoutModel)
        .then(function(data){
            ok(data === null, "returns data");
            deepEqual(checkoutModel, checkoutModel, 'checkoutModel wasnt touched');
            start();
        });

    var httpConfig = httpService.getLastCallParams();
    var data = httpConfig.data;

    ok(data.task === 'GETPAYMENTMETHODS', 'sets correct task');
    //it's easier to compare the JavaScript objects here instead of the raw JSON strings.
    deepEqual(JSON.parse(data.invoiceAddress),mrPinkBackendRepresentation, 'sends invoice address correctly');
    ok(data.quote === '{"10":{"qty":1,"variantID":null,"optionID":null}}', 'sends quote data correctly');
});

asyncTest('checkoutWithCouchCommerce returns a promise with a token', function() {
    expect(1);

    var httpService = createHttpService();

    httpService
        .when('POST', cc.Config.checkoutUrl + 'ajax.php')
        .respond('({"token":"CC_4ee08a71c70c007ce92a0b941eb059fe"})');

    var basketService = new cc.BasketService(new cc.LocalStorageService(), new cc.ConfigService());

    var checkoutService = createCheckoutService(httpService, basketService);

    var checkoutModel = {
        billingAddress: {
            country: {value: "DE", label: "Deutschland"}
        },
        shippingAddress: {
            country: {value: "DE", label: "Deutschland"}
        },
        supportedShippingMethods: [],
        supportedPaymentMethods: [],
        selectedPaymentMethod: {},
        selectedShippingMethod: {},
        addressEqual: true
    };

    checkoutService
        .checkoutWithCouchCommerce(checkoutModel)
        .then(function(token){
            ok(token === 'CC_4ee08a71c70c007ce92a0b941eb059fe', "returns token");
            start();
        });
});

asyncTest('getSummary transforms addresses in standard format', function() {
    expect(2);

    var httpService = createHttpService();

    var response = '({"items":[{"id":"136","name":"Strandbag","price":"24.99","productId":"SW10098","size":"","tax_percent":"19","imageURL":"http:\/\/couchcommerce.shopwaredemo.de\/\/media\/image\/thumbnail\/Einkaufstasche_720x600.jpg","imageAlt1":"","variants":"","qty":1,"taxAmount":3.99,"tax":"24.99","subtotal":"24.99","details":""}],"totals":{"subtotal":"24.99","shipping":"2.90","vat":"4.45","grandtotal":"27.89"},"billing":{"salutation": "Mr", "firstname":"John","lastname":"Pink","company":"Company X", "telephone": "0511-45673623", "email":"pink@themission.com","street1":"The mission 1","city":"San Francisco","zip":"5677732","state":"","0":"","country":"US","countryname":"United States"},"shipping":{ "salutation": "Mr", "firstname":"John","lastname":"Pink","company":"Company X", "telephone": "0511-45673623", "email":"pink@themission.com","street1":"The mission 1","city":"San Francisco","zip":"5677732","state":"","0":"","country":"US","countryname":"United States","id":"cc_standard"},"paymentMethod":"Rechnung","shippingMethod":"Standard"})';

    httpService
        .when('POST', cc.Config.checkoutUrl + 'summaryst.php')
        .respond(response);

    var basketService = new cc.BasketService(new cc.LocalStorageService(), new cc.ConfigService());

    var checkoutService = createCheckoutService(httpService, basketService);

    checkoutService
        .getSummary('someToken')
        .then(function(response){
            ok(response, 'has response');
            deepEqual(response.invoiceAddress, mrPinkAppRepresentation, 'transforms invoice address into app format');
            start();
        });
});