/**
 * @name UrlConstructionService
 * @namespace cc.UrlConstructionService
 *
 * @description
 * As the name says. This service provides methods to construct URLs for
 * different use cases.
 */
cc.define('cc.UrlConstructionService', function(configService){
    var self = {};

    /**
     * @method createUrlForProducts
     * @memberof cc.UrlConstructionService
     *
     * @description
     * Creates url for products.
     *
     * @param {int} categoryUrlId Category url id.
     * @return {string} Url
     */
    self.createUrlForProducts = function(categoryUrlId){
        return '/cat/' + categoryUrlId + '/products';
    };

    /**
     * @method createUrlForProduct
     * @memberof cc.UrlConstructionService
     *
     * @description
     * Creates url for a product.
     *
     * @param {product} product Product object.
     * @return {string} Url
     */
    self.createUrlForProduct = function(product){
        return '/cat/' + product.categoryUrlId + '/product/' + product.urlKey;
    };

    /**
     * @method createUrlForCategory
     * @memberof cc.UrlConstructionService
     *
     * @description
     * Creates url for a category.
     *
     * @param {int} categoryUrlId Category url id.
     * @return {string} Url
     */
    self.createUrlForCategory = function(categoryUrlId){
        return '/cat/' + categoryUrlId;
    };

    /**
     * @method createUrlForRootCategory
     * @memberof cc.UrlConstructionService
     *
     * @description
     * Creates url for root category.
     *
     * @return {string} Url
     */
    self.createUrlForRootCategory = function(){
        return '';
    };

    /**
     * @method createUrlForCart
     * @memberof cc.UrlConstructionService
     *
     * @description
     * Creates url for cart.
     *
     * @return {string} Url
     */
    self.createUrlForCart = function(){
        return '/cart';
    };

    /**
     * @method createUrlForCheckout
     * @memberof cc.UrlConstructionService
     *
     * @description
     * Creates url for checkout.
     *
     * @return {string} Url
     */
    self.createUrlForCheckout = function(){
        return '/checkout';
    };

    /**
     * @method createUrlForSummary
     * @memberof cc.UrlConstructionService
     *
     * @description
     * Creates url for summary.
     *
     * @param {string} token Summary token.
     * @return {string} Url
     */
    self.createUrlForSummary = function(token){
        return '/summary/' + token;
    };

    /**
     * @method createUrlForShippingCostsPage
     * @memberof cc.UrlConstructionService
     *
     * @description
     * Creates url for shipping costs page.
     *
     * @return {string} Url
     */
    self.createUrlForShippingCostsPage = function(){
        return '/pages/' + configService.get('linkShippingCosts', '');
    };

    return self;
});
