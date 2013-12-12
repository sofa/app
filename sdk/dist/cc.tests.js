cc.Config = {
    loggingEnabled: true,
    storeCode: '53787',
    originalUrl:'http://couchcommerce.shopwaredemo.de/',
    noRedirectSuffix:'/CC/noRedirect',
    searchUrl: 'https://de7so.api.searchify.com/v1/indexes/production/search',
    apiUrl: 'http://cc1.couchcommerce.com/apiv6/products/',
    checkoutUrl:'http://couchdemoshop.couchcommerce.com/checkout/v2/',
    apiHttpMethod: 'jsonp',
    categoryJson: 'data/couchdemoshop/categories.json',
    //apiUrl: 'data/dasgibtesnureinmal/products.json',
    //apiHttpMethod: 'get',
    mediaFolder:'http://cc1.couchcommerce.com/media/couchdemoshop/img/',
    mediaImgExtension:'png',
    mediaPlaceholder:'http://cdn.couchcommerce.com/media/platzhalter.png',
    resourceUrl:'http://localhost:8888/couchcommerce/couchcommerce-frontend/app/data/pages/',
    shippingCost:5,
    shippingTax:19,
    shippingFreeFrom: null,
    currencySign:'€',
    shippingText:'zzgl. 5€ Versandkosten',
    showGeneralAgreement:1,
    showAgeAgreement:0,
    showAppExitLink:true,
    linkGeneralAgreement:'saturn',
    linkRecallAgreement:'neptune',
    linkAgeAgreement:'age',
    linkShippingCosts:'',
    locale:'de-de',
    countries:[{"value":"DE","label":"Deutschland"},{"value":"AT","label":"\u00d6sterreich"},{"value":"AE","label":"Arabische Emirate"},{"value":"AU","label":"Australien"},{"value":"BE","label":"Belgien"},{"value":"DK","label":"D\u00e4nemark"},{"value":"FI","label":"Finnland"},{"value":"IT","label":"Italien"},{"value":"NL","label":"Niederlande"},{"value":"CH","label":"Schweiz"},{"value":"ES","label":"Spanien"}],
    aboutPages:[
            {
                title:'Neptune',
                id:'neptune'
            },
            {
                title:'Saturn',
                id:'saturn'
            },
            {
                title:'Something',
                id:'something'
            }
    ]
};
cc.define('cc.mocks.httpService', function($q){

    'use strict';

    var mocks,
        requestQueue = [];

    var self = function(config){

        config.method = config.method && config.method.toLowerCase();
        requestQueue.push(config);
        var deferred = $q.defer();


        var responseMock = mocks[config.method][config.url];
        var configData = config.data || config.params;
        if (responseMock === undefined && configData !== undefined){
            var endpointKey = createEndpointKey(config.url, configData);
            responseMock = mocks[config.method][endpointKey];
        }

        if (responseMock && typeof responseMock.responseTime === 'number'){
            setTimeout(function(){
                deferred.resolve({
                    data: responseMock.data
                });
            }, responseMock.responseTime);
        }
        else if (responseMock){
            deferred.resolve({
                    data: responseMock.data
            });
        }

        return deferred.promise;
    };

    self.getLastCallParams = function(){
        return requestQueue.length > 0 ? requestQueue[requestQueue.length - 1] : null;
    };

    self.getRequestQueue = function(){
        return requestQueue;
    };

    self.when = function(method, endpoint, data){

        endpoint = createEndpointKey(endpoint, data);

        return {
            respond: function(data, responseTime){
                method = method.toLowerCase();
                mocks[method][endpoint] = { data: data , responseTime: responseTime};
            }
        };
    };

    var createEndpointKey = function(endpoint, data){
        return data !== undefined ? endpoint + '_' + md5Object(data) : endpoint;
    };

    /**
     * clear the mocked data so that the service is in it's initial state
     * 
     */
    self.clear = function(){
        requestQueue.length = 0;
        mocks = {
            get: {},
            post: {},
            put: {},
            jsonp: {},
            'delete': {}
        };
    };

    self.clear();

    return self;
});
(function(window){
    function md5cycle(x, k) {
        var a = x[0],
            b = x[1],
            c = x[2],
            d = x[3];

        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);

        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);

        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);

        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);

        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3]);

    }

    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }

    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function md51(s) {
        txt = '';
        var n = s.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i;
        for (i = 64; i <= s.length; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < s.length; i++)
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i++) tail[i] = 0;
        }
        tail[14] = n * 8;
        md5cycle(state, tail);
        return state;
    }

    /* there needs to be support for Unicode here,
     * unless we pretend that we can redefine the MD-5
     * algorithm for multi-byte characters (perhaps
     * by adding every four 16-bit characters and
     * shortening the sum to 32 bits). Otherwise
     * I suggest performing MD-5 as if every character
     * was two bytes--e.g., 0040 0025 = @%--but then
     * how will an ordinary MD-5 sum be matched?
     * There is no way to standardize text to something
     * like UTF-8 before transformation; speed cost is
     * utterly prohibitive. The JavaScript standard
     * itself needs to look at this: it should start
     * providing access to strings as preformed UTF-8
     * 8-bit unsigned value arrays.
     */

    function md5blk(s) { /* I figured global was faster.   */
        var md5blks = [],
            i; /* Andy King said do it this way. */
        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    }

    var hex_chr = '0123456789abcdef'.split('');

    function rhex(n) {
        var s = '',
            j = 0;
        for (; j < 4; j++)
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
        return s;
    }

    function hex(x) {
        for (var i = 0; i < x.length; i++)
            x[i] = rhex(x[i]);
        return x.join('');
    }

    function md5(s) {
        return hex(md51(s));
    }

    function md5Object(obj){
        return md5(JSON.stringify(obj));
    }

    /* this function is much faster,
    so if possible we use it. Some IEs
    are the only ones I know of that
    need the idiotic second function,
    generated by an if clause.  */

    function add32(a, b) {
        return (a + b) & 0xFFFFFFFF;
    }

    if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
        function add32(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }
    }

    window.md5 = md5;
    window.md5Object = md5Object;
})(window)
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
module('cc.couchService.tests');

var productData = {
    "queryDetails":{
    "category":"main",
    "categoryName":"Root",
    "showSizeFilter":"true",
    "showColorFilter":"true"
},
"totalCount":"16",
"products":[
    {"id":1036,"sku":"1172","qty":"2","name":"Fassbind Brut de Fut Williams Obstbrand 53,2 % 0,5 l Flasche","price":"53.58","super":"","variants":[],"priceOld":"0.00","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Brut de Fut Williams Obstbrand 0,5 Liter Flasche<\/strong><\/h3>\n<p><strong>Fassbind Brut de Fut Williams Obstbrand<\/strong> wird in der \u00e4ltesten Destillerie der Schweiz hergestellt. Gebrannt wird mit neuester Technik, aber nach altem, bew\u00e4hrtem Rezept und nat\u00fcrlich mit viel Liebe zum Detail.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-brut-de-fut-williams-obstbrand-53-2-0-5-l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"107.16","custom2":"0.5","custom3":"","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_brut_de_fut_williams_obstbrand_50_5_0_5_l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_brut_de_fut_williams_obstbrand_50_5_0_5_l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Brut de Fut Williams Obstbrand 53,2 % 0,5 l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":310,"sku":"1177","qty":10,"name":"Fassbind Framboise Obstbrand 41% 0,7l Obstler Flasche","price":"36.95","super":"","variants":[],"priceOld":"0.00","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Framboise Obstbrand 0,7l Obstler Flasche<\/strong><\/h3>\n<p><strong>Fassbind Framboise Obstbrand<\/strong> kennt eigentlich jeder, der schon mal in der Schweiz gewesen ist. Mit dieser besonderen <strong>Spezialit\u00e4t<\/strong> \u00fcberzeugen Gastwirte gerne Ihre G\u00e4ste von der herausragenden Brennkunst ihres Landes.<\/p>\n<p><strong>Fassbind Framboise Obstbrand<\/strong> \u00fcberzeugt mit <strong>Geschmack<\/strong> und <strong>Charakter<\/strong>.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-framboise-obstbrand-41-0-7l-obstler-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"52.79","custom2":"0.7","custom3":"","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_framboise_obstbrand_43_0_7l_obstler_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_framboise_obstbrand_43_0_7l_obstler_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Framboise Obstbrand 41% 0,7l Obstler Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":78,"sku":"1185","qty":10,"name":"Fassbind Vieux Berg Kirsch Obstbrand 41% 0,7l Flasche Obstler","price":"41.20","super":"","variants":[],"priceOld":"0.00","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Vieux Berg Kirsch Obstbrand 0,7l Flasche Obstler<\/strong><\/h3>\n<p><strong>Fassbind Vieux Berg Kirsch Obstbrand<\/strong> ist wohl der popul\u00e4rste<strong> Obstbrand<\/strong> aus dem Haus <strong>Fassbind<\/strong>.<br \/>\n<strong>Fassbind<\/strong> verbinden die Kenner mit der uralten Schweizer Brenntradition f\u00fcr vollendete <strong>Obstbr\u00e4nde<\/strong>. Jeder der erzeugten <strong>Obstbr\u00e4nde<\/strong>, ist eigentlich ein Meisterwerk an sich. Doch mit dem <strong>Fassbind Vieux Berg Kirsch Obstbrand<\/strong> haben Sie das Flagschiff der breiten Range vor sich.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-vieux-berg-kirsch-obstbrand-41-0-7l-flasche-obstler","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"58.86","custom2":"0.7","custom3":"","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieux_berg_kirsch_obstbrand_43_0_7l_flasche_obstler.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieux_berg_kirsch_obstbrand_43_0_7l_flasche_obstler.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Vieux Berg Kirsch Obstbrand 41% 0,7l Flasche Obstler","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":754,"sku":"1187","qty":10,"name":"Fassbind Pfl\u00fcmli Obstbrand 41 % 0,7 l Flasche","price":"33.77","super":"","variants":[],"priceOld":"36.95","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Pfl\u00fcmli Obstbrand 0,7 Liter Flasche<\/strong><\/h3>\n<p><strong>Fassbind Pfl\u00fcmli Obstbrand<\/strong> sorgt f\u00fcr den hervorragenden Ruf <strong>schweizer Obstbr\u00e4nde<\/strong> bei den Kennern und Experten dieser Welt. Es geh\u00f6rt zur Unternehmensphilosophie der <strong>Brennerei Fassbind<\/strong>, das nur qualitativ hochwertigste Rohstoffe und traditionelle Handwerkskunst, im Ergebnis immer einen edlen <strong>Obstbrand<\/strong> hervorbringen. So wurde der <strong>Fassbind Pfl\u00fcmli Obstbrand<\/strong> bereits mehrfach ausgezeichnet und bietet dem Genie\u00dfer ein vollmundiges <strong>Geschmackserlebnis<\/strong>.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-pflumli-obstbrand-41-0-7-l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"48.24","custom2":"0.7","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_pfluemli_obstbrand_43_0_7_l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_pfluemli_obstbrand_43_0_7_l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Pfl\u00fcmli Obstbrand 41 % 0,7 l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":2436,"sku":"1194","qty":"4","name":"Fassbind Vieille Abricot alter Aprikosenbrand Obstbrand 40% 0,7l Flasche","price":"39.99","super":"","variants":[],"priceOld":"41.91","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Der Obstbrand Fassbind Vieille Abricot alter Aprikosenbrand 40% 0,7l Flasche<\/strong><\/h3>\n<p>Der <strong>Vieil Abrico<\/strong>t z&auml;hlt zu der Palette der in <strong>Eichenholzf&auml;ssern<\/strong> gereiften <strong>Br&auml;nde<\/strong> (<strong>Les vieilles barriques<\/strong>). Das hei&szlig;t, dass er nach der  Destillation f&uuml;r einen Zeitraum von 10-18 Monaten in den F&auml;ssern reifte,  und anschlie&szlig;end f&uuml;r eine weitere Geschmacksverfeinerung mit  sogenannten <strong>Dosagen<\/strong> veredelt wurde. Diese Dosagen werden in speziellen  Eichenholz-St&auml;nden gewonnen, und sind in&nbsp; klaren Br&auml;nden eingelegte  getrocknete Fr&uuml;chte. Dadurch entwickelt sich ein fruchtig, s&uuml;&szlig;es Aroma  mit einer feinen Barrique-Note, die durch die Lagerung im Fass bedingt  ist. Diesen wunderbaren alten<strong> Aprikosenbrand<\/strong> muss man einfach probiert  haben!<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-vieille-abricot-alter-aprikosenbrand-obstbrand-40-0-7l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"57.13","custom2":"0.7","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_abricot_alter_aprikosenbrand_obstbrand_40_0_7l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_abricot_alter_aprikosenbrand_obstbrand_40_0_7l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Vieille Abricot alter Aprikosenbrand Obstbrand 40% 0,7l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":2434,"sku":"1196","qty":"25","name":"Fassbind Vieille Poire alter Birnenbrand Obstbrand 40% 0,7l Flasche","price":"35.99","super":"","variants":[],"priceOld":"38.19","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Vieille Poire alter Birnenbrand Obstbrand 0,7 Liter Fl.<\/strong><\/h3>\n<p>Der <strong>Fassbind Vieille Poire<\/strong> ist ein <strong>alter Birnenbrand<\/strong> und geh&ouml;rt zur  Gruppe der <strong>Vieille Barriques<\/strong>. Das bedeutet, das Destillat reifte f&uuml;r  einen Zeitraum von 10-18 Monaten in <strong>Eichenholzf&auml;ssern<\/strong> und wurde  anschlie&szlig;end zur Geschmacksverfeinerung veredelt. Dabei werden dem  Obstbrand sogenannte Dosagen hinzugegeben. Die Dosagen werden in  speziellen Eichenholzst&auml;nden gewonnen, und zwar durch das Einlegen  getrockneter Fr&uuml;chte in klare Br&auml;nde. Die durch die Veredlung  entstehende intensive <strong>Williamsnote<\/strong> macht den <strong>Fassbind Vieille Poire<\/strong> besonders fruchtig. Zusammen mit der feinen S&uuml;&szlig;e und Noten aus  Eichenholz wird der <strong>Fassbind Vieille Poire<\/strong> zum Geschmackserlebnis.  Dieses brachte ihm 2003 beim schweizer Schnaps Forum die <strong>goldene  Vignette<\/strong> ein, 2005 wurde dem <strong>Obstbrand<\/strong> bei der International Wine &amp;  Spirit Competion die <strong>Silbermedaille<\/strong> verliehen und 2007 gab es ebenfalls  eine silberne Ehrung bei der Distiswiss.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-vieille-poire-alter-birnenbrand-obstbrand-40-0-7l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"51.41","custom2":"0.7","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_poire_alter_birnenbrand_obstbrand_40_0_7l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_poire_alter_birnenbrand_obstbrand_40_0_7l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Vieille Poire alter Birnenbrand Obstbrand 40% 0,7l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":2435,"sku":"1199","qty":"2","name":"Fassbind Vieille Pomme alter Apfelbrand Obstbrand 40% 0,7l Flasche","price":"39.99","super":"","variants":[],"priceOld":"41.91","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Vieille Poire alter Apfelbrand Obstbrand 40% 0,7Liter Fl.<\/strong><\/h3>\n<p>Der<strong> Fassbind Vieille Pomme<\/strong> ist ein<strong> alter Obstbrand<\/strong>, der f&uuml;r einen  Zeitraum von einem Jahr in Eichenholzf&auml;ssern lagerte, bevor er zur  Geschmacksverfeinerung mit einer hausgemachten Dosage veredelt wurde.  Das Ergebnis ist ein eleganter K&ouml;rper mit einem intensiven fruchtigen  Apfelaroma. In Verbindung mit der leichten holzigen Note, ist der <strong> Fassbind Vieille Pomme<\/strong> ein absolutes Geschmackserlebnis.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-vieille-pomme-alter-apfelbrand-obstbrand-40-0-7l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"57.13","custom2":"0.7","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_pomme_alter_apfelbrand_obstbrand_40_0_7l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_pomme_alter_apfelbrand_obstbrand_40_0_7l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Vieille Pomme alter Apfelbrand Obstbrand 40% 0,7l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":204,"sku":"1202","qty":10,"name":"Fassbind Vieille Prune Obstbrand Pflaume 40% 0,7l Flasche","price":"33.77","super":"","variants":[],"priceOld":"38.19","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Vieille Prune Obstbrand 40% 0,7l Flasche<\/strong><\/h3>\n<p>Grundlage des <strong>Fassbind Vieille Prune Obstbrandes<\/strong> sind feinstes <strong>Pflaumen<\/strong> Destillate. Diese verleihen ihm sein unnachahmliches <strong>Aroma<\/strong> und einen erstklassigen <strong>Geschmack<\/strong>. Nach der Destillation \u00fcbergibt man den <strong>Fassbind Vieille Prune Obstbrand<\/strong> den Reifeprozess.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-vieille-prune-obstbrand-pflaume-40-0-7l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"48.24","custom2":"0.7","custom3":"","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_prune_obstbrand_pflaume_43_0_7l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_prune_obstbrand_pflaume_43_0_7l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Vieille Prune Obstbrand Pflaume 40% 0,7l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":662,"sku":"1204","qty":"1","name":"Fassbind Obstbrand Walderdbeeren R\u00e9serve Priv\u00e9e 43 % 0,5 l Flasche","price":"99.37","super":"","variants":[],"priceOld":"0.00","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Walderdbeeren R\u00e9serve Priv\u00e9e 0,5 l Obstbrand<\/strong><\/h3>\n<p><strong>Fassbind Walderdbeeren R\u00e9serve Priv\u00e9e<\/strong> ist ein ausgezeichnetes Produkt und bietet dem wahren Genie\u00dfer ein vollmundiges<strong> Geschmackserlebnis<\/strong>. Mehrfach wurde der <strong>Fassbind Walderdbeeren R\u00e9serve Priv\u00e9e<\/strong> bereits f\u00fcr seine <strong>Qualit\u00e4t<\/strong> und einzigartigen <strong>Geschmack<\/strong> ausgezeichnet und wird auch Sie mit seinem <strong>Aromareichtum <\/strong>vollkommen \u00fcberzeugen.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-obstbrand-walderdbeeren-reserve-privee-43-0-5-l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Farbe":"Nein","Lieferzeit":"3-4 Tage"},"custom1":"198.74","custom2":"0.5","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/w\/a\/walderdbeere_hochwertig.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/w\/a\/walderdbeere_hochwertig.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Obstbrand Walderdbeeren R\u00e9serve Priv\u00e9e 43 % 0,5 l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":1089,"sku":"1206","qty":10,"name":"Fassbind Wildkirsch Reserve Privee Obstbrand 41 % 0,5 l Flasche","price":"108.03","super":"","variants":[],"priceOld":"0.00","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Wildkirsch Reserve Privee Obstbrand 0,5 Liter Flasche <\/strong><\/h3>\n<p><strong>Fassbind Wildkirsch Reserve Privee Obstbrand<\/strong> ist entstanden durch ein tragisches Ungl\u00fcck im Jahre 1806, wo das Dorf Goldau und noch 2 andere D\u00f6rfer durch gewaltige Felsst\u00fcrze vernichtet wurden. Die riesige Wunde am Berg war der Vorl\u00e4ufer f\u00fcr eine wilde und faszinierende Flora. Kleine seltene aber z\u00e4he Gew\u00e4chse von <strong>Wildkirschen<\/strong> sind ein Teil der Natur.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-wildkirsch-reserve-privee-obstbrand-41-0-5-l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"216.06","custom2":"0.5","custom3":"","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_wildkirsch_reserve_privee_obstbrand_43_0_5_l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_wildkirsch_reserve_privee_obstbrand_43_0_5_l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Wildkirsch Reserve Privee Obstbrand 41 % 0,5 l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":722,"sku":"1208","qty":"1","name":"Fassbind Williams Obstbrand 41 % 0,7 l Flasche","price":"36.95","super":"","variants":[],"priceOld":"0.00","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Williams Obstbrand 0,7 Liter Flasche<\/strong><\/h3>\n<p><strong>Fassbind Williams Obstbrand<\/strong> ist einer der Klassiker im bew\u00e4hrten Sortiment dieses Herstellers mit dem hervorragenden Ruf unter Kennern. Weit \u00fcber die Landesgrenzen der <strong>Schweiz<\/strong> ist das Unternehmen <strong>Fassbind <\/strong>bekannt f\u00fcr \u00fcberragende <strong>Qualit\u00e4t<\/strong> und ausgezeichnete G\u00fcte. Nehmen Sie Teil an dem vollendet hohen Geschmackserlebnis, das ihnen der <strong>Fassbind Williams Obstbrand<\/strong> bietet.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-williams-obstbrand-41-0-7-l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"52.79","custom2":"0.7","custom3":"","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_williams_obstbrand_43_0_7_l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_williams_obstbrand_43_0_7_l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Williams Obstbrand 41 % 0,7 l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":2637,"sku":"3333","qty":"1","name":"Fassbind Les Cuv\u00e9es Speciales Kirsch Port Cask Finished Obstbrand 41% 0,35l Flasche","price":"55.55","super":"","variants":[],"priceOld":"60.99","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Der Obstbrand Fassbind Les Cuv&eacute;es Speciales Kirsch Port Cask Finished 41% 0,35l Flasche<\/strong><\/h3>\n<p>Dieser <strong>Kirschbrand<\/strong> lagerte f&uuml;r ein Jahr in einem <strong>portugiesischen Porto Presidential Fass<\/strong>. Diese Lagerung verhalf dem <strong>Obstbrand<\/strong> zu einem dezenten <strong>Portweincharakter<\/strong> mit einem Hauch Marzipan. Da f&uuml;r die Reihe der <strong>&lsquo;Les cuv&eacute;es speciales&lsquo;<\/strong> nur ein Portweinfass mit Kirschbrand gef&uuml;llt wurde, ist der <strong>Kirsch Port Cask Finished<\/strong> in einer <strong>streng limitierten Anzahl von 402 Flaschen<\/strong> erh&auml;ltlich. Sichern Sie sich deshalb schnell eine Flasche der hervorragenden Kreation.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-les-cuvees-speciales-kirsch-port-cask-finished-obstbrand-41-0-35l-flasche","tax":"19","attributes":{"Gewicht":"1.0000","Lieferzeit":"3-4 Tage"},"custom1":"158.71","custom2":"0.35","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_les_cuv_es_speciales_kirsch_port_cask_finished_obstbrand_41_0_35l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_les_cuv_es_speciales_kirsch_port_cask_finished_obstbrand_41_0_35l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Les Cuv\u00e9es Speciales Kirsch Port Cask Finished Obstbrand 41% 0,35l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":2638,"sku":"3334","qty":10,"name":"Fassbind Les Cuv\u00e9es Speciales Kirsch Rum Cask Finished Obstbrand 41% 0,35l Flasche","price":"55.55","super":"","variants":[],"priceOld":"60.99","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Der Fassbind Les Cuv&eacute;es Speciales Kirsch Rum Cask Finished Obstbrand 41% 0,35l Flasche<\/strong><\/h3>\n<p>Der <strong>Kirsch Rum Cask Finished<\/strong>&nbsp; der Reihe <strong>&lsquo;Les cuv&eacute;es speciales&lsquo;<\/strong> von Fassbind ist ein <strong>vollmundiger Kirschbrand<\/strong> mit einem unverkennbaren <strong>Angostura-Rum-Aroma<\/strong> entstanden. Da Fassbind nur ein <strong>Angostura-Fass<\/strong> mit seinem Kirschbrand f&uuml;llte, gibt es den <strong>Kirsch Rum Cask Finished<\/strong> nur in streng <strong>limitierter Auflage<\/strong>. Weltweilt sind 387 Flaschen dieser au&szlig;ergew&ouml;hnlichen und hervorragenden Kirschbrandvariation erh&auml;ltlich. Also schnell zugreifen!<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-les-cuvees-speciales-kirsch-rum-cask-finished-obstbrand-41-0-35l-flasche","tax":"19","attributes":{"Gewicht":"1.0000","Lieferzeit":"3-4 Tage"},"custom1":"158.71","custom2":"0.35","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_les_cuv_es_speciales_kirsch_rum_cask_finished_obstbrand_41_0_35l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_les_cuv_es_speciales_kirsch_rum_cask_finished_obstbrand_41_0_35l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Les Cuv\u00e9es Speciales Kirsch Rum Cask Finished Obstbrand 41% 0,35l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":2639,"sku":"3335","qty":"1","name":"Fassbind Les Cuv\u00e9es Speciales Kirsch Sherry Cask Finished Obstbrand 41% 0,35l Flasche","price":"55.55","super":"","variants":[],"priceOld":"60.99","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Der Obstbrand Fassbind Les Cuv&eacute;es Speciales Kirsch mit Sherry Cask Finished 41% 0,35l Flasche<\/strong><\/h3>\n<p>F&uuml;r den <strong>Kirsch Sherry Cask Finished<\/strong> der Reihe <strong>&lsquo;Les cuv&eacute;es speciales&lsquo; <\/strong>wurde das edle <strong>Kirschdestillat<\/strong> in einem <strong>spanischen Sherry-Fass<\/strong> gelagert. Dadurch hat sich eine ganz besondere Kirsch-Mandel-Note entfaltet, die von dem s&uuml;&szlig;lich-bittere Sherryaroma gekonnt unterstrichen wird. Den <strong>Kirsch Sherry Cask Finished<\/strong> gibt es in der <strong>streng limitierten Anzahl von 398 Flaschen<\/strong> auf dem Markt und wird mit Sicherheit nach kurzer Zeit vergriffen sein. Also schlagen Sie schnell zu!<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-les-cuvees-speciales-kirsch-sherry-cask-finished-obstbrand-41-0-35l-flasche","tax":"19","attributes":{"Gewicht":"1.0000","Lieferzeit":"3-4 Tage"},"custom1":"158.71","custom2":"0.35","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_les_cuv_es_speciales_kirsch_sherry_cask_finished_obstbrand_41_0_35l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_les_cuv_es_speciales_kirsch_sherry_cask_finished_obstbrand_41_0_35l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Les Cuv\u00e9es Speciales Kirsch Sherry Cask Finished Obstbrand 41% 0,35l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":2640,"sku":"3336","qty":10,"name":"Fassbind Les Cuv\u00e9es Speciales Kirsch Whisky Cask Finished Obstbrand 41% 0,35l Flasche","price":"55.55","super":"","variants":[],"priceOld":"60.99","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Der Fassbind Les Cuv&eacute;es Speciales Kirsch Whisky Cask Finished Obstbrand 41% 0,35 Liter Fl.<\/strong><\/h3>\n<p>F&uuml;r den <strong>Kirsch Whisky Cask Finished<\/strong> &nbsp;lagerte der unnachahmliche <strong>Kirschbrand<\/strong> von <strong>Fassbind<\/strong> f&uuml;r ein Jahr in einem Whiskyfass der <strong>schottischen Tobermoy Destillerie<\/strong>. Diese Lagerung verhalf ihm zu einem&nbsp; angenehmen rauchigen und&nbsp; torfigen Geschmack, dem typischen Aroma <a title=\"Single Malt Whisky\" href=\"http:\/\/www.dasgibtesnureinmal.de\/spirituosen\/whisky\/scotch-pure-malt-whisky.html\" target=\"_blank\"><strong>schottischer Single Malts<\/strong><\/a>. Diese Kirschbrand-Variation der Reihe <strong>&lsquo;Les cuv&eacute;es speciales&lsquo;<\/strong> &uuml;berzeugt Obstbrandkenner und Whiskyliebhaber gleicherma&szlig;en. Da n nur ein Fass mit dieser Kreation existierte, gibt es den <strong>Kirsch Whisky Cask Finished<\/strong> in der streng&nbsp; limitierten Auflage von 418 Flaschen. Also sichern Sie sich schnell diese ungew&ouml;hnliche Variation des edlen <strong>Kirschbrands<\/strong>!<\/p>\n<p><strong><br \/><\/strong><\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-les-cuvees-speciales-kirsch-whisky-cask-finished-obstbrand-41-0-35l-flasche","tax":"19","attributes":{"Gewicht":"1.0000","Lieferzeit":"3-4 Tage"},"custom1":"158.71","custom2":"0.35","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_les_cuv_es_speciales_kirsch_whisky_cask_finished_obstbrand_41_0_35l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_les_cuv_es_speciales_kirsch_whisky_cask_finished_obstbrand_41_0_35l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Les Cuv\u00e9es Speciales Kirsch Whisky Cask Finished Obstbrand 41% 0,35l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":2720,"sku":"3373","qty":10,"name":"Fassbind Vieille Framboise alter Himbeerbrand Obstbrand 40% 0,7l Flasche","price":"38.19","super":"","variants":[],"priceOld":"0.00","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Vieille Framboise alter Himbeerbrand Obstbrand 0,7l Flasche.<\/strong><\/h3>\n<p>Der <strong>Fassbind Vieille Framboise<\/strong> ist ein <strong>alter Himbeerbrand<\/strong>, der nach einem alten Hausrezept des Unternehmens <strong>Fassbind<\/strong> hergestellt und destilliert wurde, und anschlie&szlig;end f&uuml;r die Dauer eines Jahres im&nbsp; Eichenholzfass lagerte.&nbsp; Auf diese Weise hat der <strong>Fassbind Vieille Framboise<\/strong> sein unnachahmliches <strong>Barrique-Aroma <\/strong>angenommen, das f&uuml;r die gesamte Reihe der <strong>Fassbind Vieille Barriques<\/strong> kennzeichnend ist.&nbsp; Zu diesem Eichenholzaroma gesellt sich ein angenehmer und &uuml;beraus fruchtiger Himbeergeschmack, der ein wenig an Himbeerkonfit&uuml;re erinnert.&nbsp; Der <strong>Fassbind Vieille Framboise<\/strong> ist ein absolutes Muss f&uuml;r die Liebhaber der edlen <a title=\"Obstbr&auml;nde von Fassbind\" href=\"http:\/\/www.dasgibtesnureinmal.de\/spirituosen\/obstbrande\/fassbind.html\" target=\"_blank\"><strong>Obstbr&auml;nde aus dem Hause Fassbind<\/strong><\/a>!<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-vieille-framboise-alter-himbeerbrand-obstbrand-40-0-7l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Farbe":"Nein","Lieferzeit":"3-4 Tage"},"custom1":"54.56","custom2":"0.7","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_framboise.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_framboise.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Vieille Framboise alter Himbeerbrand Obstbrand 40% 0,7l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"}
]
};

var categories = {
        'label': 'root',
        'urlId': 'root',
        'children': [{
            'label': 'child 1',
            'urlId': 'child1',
            'children': [{
                'label': 'child2',
                'urlId': 'child2'
            }]
        }, {
            'label': 'child 2',
            'urlId': 'child2',
            'children': [{
                'label': 'grandchild 4',
                'urlId': 'grandchild4'
            }, {
                'label': 'grandchild 5',
                'urlId': 'grandchild5'
            }]
        }]
    };

var createHttpService = function(){
    return new cc.mocks.httpService(new cc.QService());
};

var createCouchService = function(httpService){
    return new cc.CouchService(httpService, new cc.QService(), new cc.ConfigService());
};

test('can create CouchService instance', function() {
    var couchService = createCouchService(createHttpService());
    ok(couchService, 'Created couchService instance' );
});

test('it should detect direct parent<->child relationships', function() {

    var a = {
        urlId: 'a'
    };

    var b = {
        urlId: 'b',
        parent: a
    };

    var couchService = createCouchService(createHttpService());

    ok(couchService.isAParentOfB(a, b), 'a is a parent of b' );
    ok(couchService.isAParentOfB(b, a) === false, 'b is not a parent of a');

    ok(couchService.isAChildOfB(b, a), 'b is a child of a' );
    ok(couchService.isAChildOfB(a, b) === false, 'a is not a child of b');
});

test('it should detect indirect parent<->child relationships', function() {

    var a = {
        urlId: 'a'
    };

    var b = {
        urlId: 'b',
        parent: a
    };

    var c = {
        urlId: 'c',
        parent: b
    };

    var couchService = createCouchService(createHttpService());

    ok(couchService.isAParentOfB(a, c), 'a is a parent of c' );
    ok(couchService.isAParentOfB(c, a) === false, 'c is not a parent of a');

    ok(couchService.isAChildOfB(c, a), 'c is a child of a' );
    ok(couchService.isAChildOfB(a, c) === false, 'a is not a child of c');
});

test('it should detect a being a child alias of b', function() {

    var a = {
        urlId: 'a'
    };

    var b = {
        urlId: 'b',
        children:[
            { urlId: 'x'},
            { urlId: 'a'}
        ]
    };

    var couchService = createCouchService(createHttpService());

    ok(couchService.isAChildAliasOfB(a, b), 'a is a child alias of b');
    // ok(couchService.isAParentOfB(b, a) === false, 'b is not a parent of a');

    // ok(couchService.isAChildOfB(b, a), 'b is a child of a' );
    // ok(couchService.isAChildOfB(a, b) === false, 'a is not a child of b');
});

test('it should detect no relationship', function() {

    var a = {
        urlId: 'a'
    };

    var b = {
        urlId: 'b',
        parent: a
    };

    var a2 = {
        urlId: 'a2'
    };

    var b2 = {
        urlId: 'b2',
        parent: a2
    };

    var couchService = createCouchService(createHttpService());

    ok(couchService.isAParentOfB(a, b2) === false, 'a is not a parent of b2');
    ok(couchService.isAChildOfB(a, b2) === false, 'a is not a child of b2');

    ok(couchService.isAParentOfB(b2, a) === false, 'b2 is not a parent of a');
    ok(couchService.isAChildOfB(b2, a) === false, 'b2 is not a child of a');
});


asyncTest('can get category', function() {
    expect(1);
    var httpService = createHttpService();

    var categoryUrlId = 'child1';

    var url =cc.Config.categoryJson;

    httpService.when('get', url).respond(categories);

    var couchService = createCouchService(httpService);

    couchService
        .getCategory(categoryUrlId)
        .then(function(data){
            ok(data.label === 'child 1', 'got root category');
            start();
        });
});

asyncTest('if a category has aliases it should return the category with children', function() {
    expect(2);
    var httpService = createHttpService();

    var categoryUrlId = 'child2';

    var url =cc.Config.categoryJson;

    httpService.when('get', url).respond(categories);

    var couchService = createCouchService(httpService);

    couchService
        .getCategory(categoryUrlId)
        .then(function(data){
            ok(data.label === 'child 2', 'got root category');
            ok(data.children && data.children.length === 2, 'returned the category with children');
            start();
        });
});

asyncTest('can get products', function() {
    expect(1);
    var httpService = createHttpService();

    var categoryUrlId = 'root';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    couchService
        .getProducts(categoryUrlId)
        .then(function(data){
            ok(data.length === 16, 'retrieves 16 products');
            start();
        });
});

asyncTest('can get a single product', function() {
    expect(1);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-vieille-prune-obstbrand-pflaume-40-0-7l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    couchService
        .getProduct(categoryUrlId, productUrlId)
        .then(function(product){
            ok(product.id === 204, 'retrieves product with id 204');
            start();
        });
});

asyncTest('can get the next product of the same category (with cached products)', function() {
    expect(2);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-vieille-prune-obstbrand-pflaume-40-0-7l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    couchService
        .getProduct(categoryUrlId, productUrlId)
        .then(function(product){
            ok(product.id === 204, 'retrieves product with id 204');

            couchService
                .getNextProduct(product)
                .then(function(nextProduct){
                    ok(nextProduct.id === 662, 'retrieves the next product');
                    start();
                });
        });
});

asyncTest('can get the next product of the same category (WITHOUT cached products)', function() {
    expect(1);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-vieille-prune-obstbrand-pflaume-40-0-7l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    var product = {
        urlKey: productUrlId,
        categoryUrlId: categoryUrlId
    };

    couchService
                .getNextProduct(product)
                .then(function(nextProduct){
                    ok(nextProduct.id === 662, 'retrieves the next product');
                    start();
                });
});

asyncTest('returns "null" for the next product when reached the end', function() {
    expect(2);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-vieille-framboise-alter-himbeerbrand-obstbrand-40-0-7l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    couchService
        .getProduct(categoryUrlId, productUrlId)
        .then(function(product){
            ok(product.id === 2720, 'retrieves product with id 2720');

            couchService
                .getNextProduct(product)
                .then(function(nextProduct){
                    ok(nextProduct === null, 'has no further product');
                    start();
                });
        });
});

asyncTest('returns the first product of the category for the next product when reached the end and using the circle parameter', function() {
    expect(2);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-vieille-framboise-alter-himbeerbrand-obstbrand-40-0-7l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    couchService
        .getProduct(categoryUrlId, productUrlId)
        .then(function(product){
            ok(product.id === 2720, 'retrieves product with id 2720');

            couchService
                .getNextProduct(product, true)
                .then(function(nextProduct){
                    ok(nextProduct.id === 1036, 'returns the first product because of the circle parameter');
                    start();
                });
        });
});

asyncTest('can get the previous product of the same category (with cached products)', function() {
    expect(2);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-obstbrand-walderdbeeren-reserve-privee-43-0-5-l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    couchService
        .getProduct(categoryUrlId, productUrlId)
        .then(function(product){
            ok(product.id === 662, 'retrieves product with id 662');

            couchService
                .getPreviousProduct(product)
                .then(function(nextProduct){
                    ok(nextProduct.id === 204, 'retrieves the previous product');
                    start();
                });
        });
});

asyncTest('can get the previous product of the same category (WITHOUT cached products)', function() {
    expect(1);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-obstbrand-walderdbeeren-reserve-privee-43-0-5-l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    var product = {
        urlKey: productUrlId,
        categoryUrlId: categoryUrlId
    };

    couchService
                .getPreviousProduct(product)
                .then(function(nextProduct){
                    ok(nextProduct.id === 204, 'retrieves the previous product');
                    start();
                });
});

asyncTest('returns null for the previous product when reached the start', function() {
    expect(2);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-brut-de-fut-williams-obstbrand-53-2-0-5-l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    couchService
        .getProduct(categoryUrlId, productUrlId)
        .then(function(product){
            ok(product.id === 1036, 'retrieves product with id 662');

            couchService
                .getPreviousProduct(product)
                .then(function(nextProduct){
                    ok(nextProduct === null, 'has no previous product');
                    start();
                });
        });
});

asyncTest('returns the last product of the category for the previous product when reached the start and using the circle parameter', function() {
    expect(2);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-brut-de-fut-williams-obstbrand-53-2-0-5-l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    couchService
        .getProduct(categoryUrlId, productUrlId)
        .then(function(product){
            ok(product.id === 1036, 'retrieves product with id 662');

            couchService
                .getPreviousProduct(product, true)
                .then(function(nextProduct){
                    ok(nextProduct.id === 2720, 'returns the last product of the category');
                    start();
                });
        });
});


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
module('cc.qService.tests');

test('can create qService instance', function() {

    var qService = new cc.QService();

    ok(qService, 'Created qService instance' );
});


test('can resolve synchronously', function() {

    var qService = new cc.QService();
    var deferred = qService.defer();
    deferred.resolve(true);

    deferred.promise.then(function(data){
        ok(data, 'is true');
    });
});

asyncTest('can resolve asynchronously', function() {

    expect(1);

    var qService = new cc.QService();
    var deferred = qService.defer();


    setTimeout(function(){
        deferred.resolve(true);
    }, 100);

    
    deferred.promise.then(function(data){
        ok(data, 'is true');
        start();
    });
});
module('cc.searchService.tests');

//we set the debounce rate to 50ms for the tests to run faster
cc.Config.searchDebounceMs = 50;

var _configService = new cc.ConfigService();
var _searchUrl = _configService.get('searchUrl') + '?callback=JSON_CALLBACK&len=100';
var _storeCode = _configService.get('storeCode');
var _searchFields = 'text, categoryUrlKey, categoryName, productUrlKey, productImageUrl';

var createHttpService = function(){
    return new cc.mocks.httpService(new cc.QService());
};

test('can create searchService instance', function() {

    var searchService = new cc.SearchService(_configService, createHttpService(), new cc.QService());

    ok(searchService, 'Created searchService instance' );
});

asyncTest('normalizes umlauts', function() {
    expect(5);
    var httpService = createHttpService();

    var umlauts                     = 'áàâäúùûüóòôöéèêëß';
    var normalizedUmlauts           = 'aaaauuuuooooeeeess';
    var reversedNormalizedUmlauts   = 'sseeeeoooouuuuaaaa';

    var searchCommand = '(text:' + normalizedUmlauts + '* OR reverse_text:' + reversedNormalizedUmlauts + '*) AND storeCode:' + _configService.get('storeCode');
    httpService.when('JSONP', _searchUrl, { q: searchCommand, fetch: _searchFields }).respond({
        results: [
            'car',
            'carmaker'
        ]
    });

    var searchService = new cc.SearchService(_configService, httpService, new cc.QService());

    var $q = new cc.QService();

    searchService
        .search(umlauts)
        .then(function(response){
            ok(response, 'has response');
            var results = response.data.results;
            ok(results !== undefined, 'has payload');
            equal(results[0], 'car', 'has result');
            equal(results[1], 'carmaker', 'has result');
        });

    setTimeout(function(){
        start();
        var httpCallParams = httpService.getLastCallParams();
        ok(httpCallParams.url === _searchUrl, 'hits configured entpoint');
    }, 100);
});

asyncTest('calls searchService.search() 3 times but only makes 2 request which respond out of order.', function() {
    expect(6);

    /*
    Ok, this test is scary so let's break down what it does.

    It makes three calls to the searchService in a very specific order and timing.

    0ms  : searchService.search('ca');
    0ms  : searchService.search('car');
    50ms : searchService.search('carm');

    The first call with the searchString 'ca' should not even hit the backend
    as we debounce calls by a configureable time span.

    The second and the third call DO hit the backend. However, the call for
    'car' takes longer than the call for 'carm' which would normally result
    in showing the user results for 'car' even so 'carm' was what he had on
    the screen when he finished typing. But our searchService knows how to 
    deal with out-of-order-responses. This test proofs everything.
    */

    //the number of actual requests made against the backend
    var EXPECTED_OUTGOING_REQUESTS_COUNT = 2;
    //the number of requests returned to the user code by the searchService
    var EXPECTED_RETURNED_REQUESTS = 1;

    var httpService = createHttpService();

    //that's the response for the first request, it takes longer then the second
    //so that it arrives *after* the second request
    httpService.when('JSONP', _searchUrl, { q: '(text:car* OR reverse_text:rac*) AND storeCode:' + _storeCode, fetch: _searchFields }).respond({
        results: [
            'car',
            'carmaker'
        ]
    }, 150);

    //the response for the second request returns much quicker.
    httpService.when('JSONP', _searchUrl, { q: '(text:carm* OR reverse_text:mrac*) AND storeCode:' + _storeCode, fetch: _searchFields }).respond({
        results: [
            'carmaker'
        ]
    }, 50);

    var searchService = new cc.SearchService(_configService, httpService, new cc.QService());

    var $q = new cc.QService();

    var handledRequests = 0;

    //let's call this request zero because it will never hit the backend since searchService.search() 
    //internally debounces calls by a configured time span.
    searchService.search('ca');

    //that's the first real request that hit's the backend
    searchService
        .search('car')
        .then(function(response){
            //this should not happen because the request for 'car' should
            //be cancelled out by the request for 'carm'
            handledRequests++;
        });

    //that's the second request. It needs to run x ms after the last call, otherwise it 
    //would directly cancel out the previous so that the previous would not even hit the backend
    setTimeout(function(){
        searchService
            .search('carm')
            .then(function(response){
                handledRequests++;
                ok(response, 'has response');
                var results = response.data.results;
                ok(results !== undefined, 'has payload');
                equal(results[0], 'carmaker', 'has result');
            });
    }, 50);

    setTimeout(function(){
        start();
        ok(handledRequests === EXPECTED_RETURNED_REQUESTS, 'should not have handled first request');
        equal(httpService.getRequestQueue().length, EXPECTED_OUTGOING_REQUESTS_COUNT, 'makes two requests');

        var httpCallParams = httpService.getLastCallParams();
        ok(httpCallParams.url === _searchUrl, 'hits configured entpoint');

    }, 250);
});

asyncTest('calls searchService.search() 2 times and also makes 2 request to the search backend', function() {
    expect(10);

    /*
    In this case the second request does not cancel out the first one because the first one is long
    finished. So this test is basically just proving that we can use the searchService.search() method
    multiple times on it's own.
    */

    //the number of actual requests made against the backend
    var EXPECTED_OUTGOING_REQUESTS_COUNT = 2;
    //the number of requests returned to the user code by the searchService
    var EXPECTED_RETURNED_REQUESTS = 2;

    var httpService = createHttpService();

    httpService.when('JSONP', _searchUrl, { q: '(text:car* OR reverse_text:rac*) AND storeCode:' + _storeCode, fetch: _searchFields }).respond({
        results: [
            'car',
            'carmaker'
        ]
    }, 25);

    httpService.when('JSONP', _searchUrl, { q: '(text:carm* OR reverse_text:mrac*) AND storeCode:' + _storeCode, fetch: _searchFields }).respond({
        results: [
            'carmaker'
        ]
    }, 25);

    var searchService = new cc.SearchService(_configService, httpService, new cc.QService());

    var $q = new cc.QService();

    var handledRequests = 0;

    //that's the first real request that hit's the backend
    searchService
        .search('car')
        .then(function(response){
            //this should not happen because the request for 'car' should
            //be cancelled out by the request for 'carm'
            handledRequests++;
            ok(response, 'has response');
            var results = response.data.results;
            ok(results !== undefined, 'has payload');
            equal(results[0], 'car', 'has result');
            equal(results[1], 'carmaker', 'has result');
        });

    setTimeout(function(){
        searchService
            .search('carm')
            .then(function(response){
                handledRequests++;
                ok(response, 'has response');
                var results = response.data.results;
                ok(results !== undefined, 'has payload');
                equal(results[0], 'carmaker', 'has result');
            });
    }, 100);


    setTimeout(function(){
        start();
        ok(handledRequests === EXPECTED_RETURNED_REQUESTS, 'should have handled both requests');
        equal(httpService.getRequestQueue().length, EXPECTED_OUTGOING_REQUESTS_COUNT, 'makes two requests');

        var httpCallParams = httpService.getLastCallParams();
        ok(httpCallParams.url === _searchUrl, 'hits configured entpoint');

    }, 250);
});

asyncTest('groupes response by the given grouping definition', function() {
    expect(11);
    var httpService = createHttpService();

    var searchString = "f";
    var searchCommand = '(text:' + searchString + '* OR reverse_text:' + searchString + '*) AND storeCode:' + _configService.get('storeCode');
    httpService.when('JSONP', _searchUrl, { q: searchCommand, fetch: _searchFields }).respond({
        results: [
            { 
                categoryName: 'A',
                categoryUrlKey: '_A',
                text: 'Product of A 1'
            },
            { 
                categoryName: 'B',
                categoryUrlKey: '_B',
                text: 'Product of B 1'
            },
            { 
                categoryName: 'A',
                categoryUrlKey: '_A',
                text: 'Product of A 2'
            }
        ]
    });

    var searchService = new cc.SearchService(_configService, httpService, new cc.QService());

    var $q = new cc.QService();

    searchService
        .search(searchString, { groupKey: 'categoryUrlKey', groupText: 'categoryName'})
        .then(function(response){
            ok(response, 'has response');
            var results = response.data.results;
            var groupedResults = response.data.groupedResults;
            ok(results !== undefined, 'has payload');
            equal(results[0].text, 'Product of A 1', 'has result');
            equal(results[1].text, 'Product of B 1', 'has result');

            equal(groupedResults[0].groupKey, '_A', 'has grouped result');
            equal(groupedResults[1].groupKey, '_B', 'has grouped result');
            
            equal(groupedResults[0].groupText, 'A', 'has grouped result');
            equal(groupedResults[1].groupText, 'B', 'has grouped result');

            equal(groupedResults[0].items.length, 2, 'has 2 item');
            equal(groupedResults[1].items.length, 1, 'has 1 item');

            /*
            [
                {
                    groupKey: key-of-category,
                    groupText: text of category,
                    items: [
                            // just as in results
                           ]
                },{
                    groupKey: key-of-2nd-category,
                    groupText: text of 2nd category,
                    items: [
                            // just as in results
                           ]
                }
            ]
            */

        });

    setTimeout(function(){
        start();
        var httpCallParams = httpService.getLastCallParams();
        ok(httpCallParams.url === _searchUrl, 'hits configured entpoint');
    }, 100);
});


module('cc.Util.tests');

test('every returns true or false correctly', function() {

    var testData = [{
                        qty: 1
                    },{
                        qty: 1
                    },{
                        qty: 1
                    }];

    var result = cc.Util.every(testData, function(item){
        return item.qty === 1;
    });

    var proof = cc.Util.every(testData, function(item){
        return item.qty < 1;
    });
    
    ok(result, 'all have a qty of 1');
    ok(!proof, 'not all have a qty with less than 1');

    var otherData = [{
                    qty: 1
                },{
                    qty: 2
                },{
                    qty: 1
                }];

    var otherResult = cc.Util.every(otherData, function(item){
        return item.qty === 1;
    });

    ok(!proof, 'not all have a qty of 1');
});



test('can loop the children of categories using tree algorithms', function() {

    var categories = {
        'label': 'parent',
        'children': [{
            'label': 'child 1',
            'children': [{
                'label': 'grandchild 1'
            }, {
                'label': 'grandchild 2'
            }, {
                'label': 'grandchild 3'
            }]
        }, {
            'label': 'child 2',
            'children': [{
                'label': 'grandchild 4'
            }, {
                'label': 'grandchild 5'
            }]
        }]
    };

    var results, iterator;


    iterator = new cc.util.TreeIterator(categories, 'children');

    results = [];

    iterator.iterateChildren(function(category, parent) {
        results.push({
            category:category,
            parent:parent
        });
    });

    ok(results[0].category.label === 'parent', 'iterator matches expected output');
    ok(results[0].parent === undefined, 'iterator matches expected output');

    ok(results[1].category.label === 'child 1', 'iterator matches expected output');
    ok(results[1].parent === categories, 'iterator matches expected output');

    ok(results[2].category.label === 'grandchild 1', 'iterator matches expected output');
    ok(results[2].parent === categories.children[0], 'iterator matches expected output');

    ok(results[3].category.label === 'grandchild 2', 'iterator matches expected output');
    ok(results[3].parent === categories.children[0], 'iterator matches expected output');

    ok(results[results.length - 1].category.label === 'grandchild 5', 'iterator matches expected output');
    ok(results[results.length - 1].parent === categories.children[1], 'iterator matches expected output');

});