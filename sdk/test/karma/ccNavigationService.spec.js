describe('Testing the NavigationService', function() {

    var _navigationService,
        _$location;

    var  PRODUCT_URL        = 'http://localhost:8888/couchcommerce/couchcommerce-frontend/app/dist/#/cat/deutsch-freizeitwelten-vintage/product/fahrerbrille-chronos',
         PRODUCTS_URL       = 'http://localhost:8888/couchcommerce/couchcommerce-frontend/app/dist/#/cat/deutsch-freizeitwelten-vintage/products',
         CATEGORIES_URL     = 'http://localhost:8888/couchcommerce/couchcommerce-frontend/app/dist/#/cat/deutsch-freizeitwelten',
         CART_URL           = 'http://localhost:8888/couchcommerce/couchcommerce-frontend/app/dist/#/cart',
         PAGES_URL          = 'http://localhost:8888/couchcommerce/couchcommerce-frontend/app/dist/#/pages/neptune',
         PAGES_PRODUCT_URL  = 'http://localhost:8888/couchcommerce/couchcommerce-frontend/app/dist/#/pages/product';

    beforeEach(module('sdk.services.navigationService'));

    beforeEach(inject(function(navigationService, $location) {
        _navigationService = navigationService;
        _$location = $location;
    }));

    it('it should detect it as product url', function() {

        spyOn(_$location, 'path').andReturn(PRODUCT_URL);

        expect(_navigationService.isView('product')).toBe(true);
        expect(_navigationService.isView('products')).toBe(false);
        expect(_navigationService.isView('categories')).toBe(false);
    });

    it('it should detect it as products url', function() {

        spyOn(_$location, 'path').andReturn(PRODUCTS_URL);

        expect(_navigationService.isView('product')).toBe(false);
        expect(_navigationService.isView('products')).toBe(true);
        expect(_navigationService.isView('categories')).toBe(false);
    });

    it('it should detect it as products url', function() {

        spyOn(_$location, 'path').andReturn(CATEGORIES_URL);

        expect(_navigationService.isView('product')).toBe(false);
        expect(_navigationService.isView('products')).toBe(false);
        expect(_navigationService.isView('categories')).toBe(true);
    });
});