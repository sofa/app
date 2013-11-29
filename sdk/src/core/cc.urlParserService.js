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

    self.isView = function(viewName){
        var regex = views[viewName];

        if(!regex){
            throw new Error(viewName + "unknown");
        }

        return regex.test($location.path());
    };

    self.isRootCategory = function(){
        var path = $location.path();
        return path === '/' || path === '/cat/' ;
    };

    self.getCategoryUrlId = function(){
        return $location.path()
                        .replace(utilityRegex.urlBeforeCategory,'')
                        .replace(utilityRegex.urlRightFromSlash, '');
    };

    self.getProductUrlId = function(){
        return $location.path()
                        .replace(utilityRegex.urlBeforeProduct,'')
                        .replace(utilityRegex.urlRightFromSlash, '');
    };

    return self;
});