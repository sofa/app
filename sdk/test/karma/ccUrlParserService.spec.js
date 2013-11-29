describe('Testing the UrlParserService', function() {

    var _urlParserService,
        _$location;

    var  PRODUCT_URL        = 'http://localhost:8888/couchcommerce/couchcommerce-frontend/app/dist/#/cat/deutsch-freizeitwelten-vintage/product/fahrerbrille-chronos',
         PRODUCTS_URL       = 'http://localhost:8888/couchcommerce/couchcommerce-frontend/app/dist/#/cat/deutsch-freizeitwelten-vintage/products',
         CATEGORIES_URL     = 'http://localhost:8888/couchcommerce/couchcommerce-frontend/app/dist/#/cat/deutsch-freizeitwelten',
         CART_URL           = 'http://localhost:8888/couchcommerce/couchcommerce-frontend/app/dist/#/cart',
         PAGES_URL          = 'http://localhost:8888/couchcommerce/couchcommerce-frontend/app/dist/#/pages/neptune',
         PAGES_PRODUCT_URL  = 'http://localhost:8888/couchcommerce/couchcommerce-frontend/app/dist/#/pages/product';

    beforeEach(module('sdk.services.urlParserService'));

    beforeEach(inject(function(urlParserService, $location) {
        _urlParserService = urlParserService;
        _$location = $location;
    }));

    it('it should detect it as product url', function() {

        spyOn(_$location, 'path').andReturn(PRODUCT_URL);

        expect(_urlParserService.isView('product')).toBe(true);
        expect(_urlParserService.isView('products')).toBe(false);
        expect(_urlParserService.isView('categories')).toBe(false);
    });

    it('it should detect it as products url', function() {

        spyOn(_$location, 'path').andReturn(PRODUCTS_URL);

        expect(_urlParserService.isView('product')).toBe(false);
        expect(_urlParserService.isView('products')).toBe(true);
        expect(_urlParserService.isView('categories')).toBe(false);
    });

    it('it should detect it as products url', function() {

        spyOn(_$location, 'path').andReturn(CATEGORIES_URL);

        expect(_urlParserService.isView('product')).toBe(false);
        expect(_urlParserService.isView('products')).toBe(false);
        expect(_urlParserService.isView('categories')).toBe(true);
    });

    it('it can extract productUrlId from url', function() {

        spyOn(_$location, 'path').andReturn(PRODUCT_URL);

        expect(_urlParserService.getProductUrlId()).toBe('fahrerbrille-chronos');
    });
    
});