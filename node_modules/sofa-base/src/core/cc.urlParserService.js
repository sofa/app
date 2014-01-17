/**
 * @name UrlParserService
 * @namespace cc.UrlParserService
 *
 * @description
 * This service provides a clean interface when it comes to accessing url ids
 * for categories and products.
 */
cc.define('cc.UrlParserService', function($location){
    var self = {};

    var views = {
        product: /\/cat\/.*\/product\//i,
        products: /\/cat\/.*\/products/i,
        categories: /\/cat\/[^/]+$/i
    };

    var utilityRegex = {
        urlBeforeCategory: /.*cat\//,
        urlBeforeProduct: /.*\/product\//,
        urlRightFromSlash: /\/.*/
    };

    /**
     * @method isView
     * @memberof cc.UrlParserService
     *
     * @description
     * Returns true if given `viewName` is a view.
     *
     * @param {string} viewName View name.
     * @return {boolean}
     */
    self.isView = function(viewName){
        var regex = views[viewName];

        if(!regex){
            throw new Error(viewName + "unknown");
        }

        return regex.test($location.path());
    };

    /**
     * @method isRootCategory
     * @memberof cc.UrlParserService
     *
     * @description
     * Returns true if current location path is a root category.
     *
     * @return {boolean}
     */
    self.isRootCategory = function(){
        var path = $location.path();
        return path === '/' || path === '/cat/' ;
    };

    /**
     * @method getCategoryUrlId
     * @memberof cc.UrlParserService
     * 
     * @description
     * Extracts a category url id from a URL for you and returns it.
     *
     * @return {string} Category url id.
     */
    self.getCategoryUrlId = function(){
        return $location.path()
                        .replace(utilityRegex.urlBeforeCategory,'')
                        .replace(utilityRegex.urlRightFromSlash, '');
    };

    /**
     * @method getProductUrlId
     * @memberof cc.UrlParserService
     *
     * @description
     * Extracts a Product url id from a URL for you and returns it.
     *
     * @return {string} Product url id.
     */
    self.getProductUrlId = function(){
        return $location.path()
                        .replace(utilityRegex.urlBeforeProduct,'')
                        .replace(utilityRegex.urlRightFromSlash, '');
    };

    return self;
});
