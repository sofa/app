cc.define('cc.UrlConstructionService', function(configService){
    var self = {};

    self.createUrlForProducts = function(categoryUrlId){
        return '/cat/' + categoryUrlId + '/products';
    };

    self.createUrlForProduct = function(product){
        return '/cat/' + product.categoryUrlId + '/product/' + product.urlKey;
    };

    self.createUrlForCategory = function(categoryUrlId){
        return '/cat/' + categoryUrlId;
    };

    self.createUrlForRootCategory = function(){
        return '';
    };

    self.createUrlForCart = function(){
        return '/cart';
    };

    self.createUrlForCheckout = function(){
        return '/checkout';
    };

    self.createUrlForSummary = function(token){
        return '/summary/' + token;
    };

    self.createUrlForShippingCostsPage = function(){
        return '/pages/' + configService.get('linkShippingCosts', '');
    };

    return self;
});