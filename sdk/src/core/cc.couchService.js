cc.define('cc.CouchService', function($http, $q){

    'use strict';

    var self = {},
        products = {},
        currentCategory = null;


    /**
     * Fetches all subcategories of a given category
     * If no category is specified, the method
     * defaults to the root category 
     * 
     * Options:
     * 
     *   - `rootCategory` the category used as a starting point
     * 
     */
    self.getCategories = function(rootCategory){
        if (!rootCategory && !self.categories){
            return fetchAllCategories();
        }
        else if(!rootCategory && self.categories){
            var deferredCategories = $q.defer();
            deferredCategories.resolve(self.categories);
            return deferredCategories.promise;
        }
        else if(rootCategory && rootCategory.length > 0 && !self.categories){
            return fetchAllCategories()
                    .then(function(data){
                        return findChildCategory(data, rootCategory);
                    });
        }
        else if(rootCategory && rootCategory.length > 0 && self.categories){
            return findChildCategoriesAndReturnPromise(self.categories, rootCategory);
        }
    };

    /**
     * Fetches all products of a given category
     * 
     * Options:
     * 
     *   - `categoryUrlId` the urlId of the category to fetch the products from
     * 
     */
    self.getProducts = function(categoryUrlId){

        if(!products[categoryUrlId]){
            return $http({
                method: cc.Config.apiHttpMethod,
                url: cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeId +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK'
            })
            .then(function(data){
                var products = augmentProducts(data.data.products, categoryUrlId);
                //FixMe we are effectively creating a memory leak here by caching all
                //seen products forever. This needs to be more sophisticated
                products[categoryUrlId] = products;
                return products;
            });
        }

        var deferredProducts = $q.defer();
        deferredProducts.resolve(products[categoryUrlId]);
        return deferredProducts.promise;
    };

    //it's a bit akward that we need to do that. It should be adressed
    //directly on our server API so that this extra processing can be removed.
    var augmentProducts = function(products, categoryUrlId){
        
        products.forEach(function(product){
            product.categoryUrlId = categoryUrlId;
        });

        return products;
    };

    /**
     * Fetches a single product.
     * Notice that both the `categoryUrlId` and the `productUrlId` need
     * to be specified in order to get the product.
     * 
     * Options:
     * 
     *   - `categoryUrlId` the urlId of the category the product belongs to
     *   - `productUrlId` the urlId of the product itself
     * 
     */
    self.getProduct = function(categoryUrlId, productUrlId){
        if(!products[categoryUrlId]){
            return self.getProducts(categoryUrlId)
                .then(function(data){
                    return getProduct(data, productUrlId)
                });
        }

        var deferredProduct = $q.defer();
        deferredProduct.resolve(getProduct(products[categoryUrlId], productUrlId));
        return deferredProduct.promise;
    };

    var getProduct = function(products, productUrlId){
        for (var i = 0; i < products.length; i++) {
            var product = products[i];
            if (product.urlKey === productUrlId){
                return product;
            }
        };

        return null;
    };

    self.getCurrentCategory = function(){
        return currentCategory;
    };

    var fetchAllCategories = function(){
        return $http({
            method: 'get',
            url: 'data/dasgibtesnureinmal/categories.json'
        })  
        .then(function(data){
            self.categories = data.data;
            augmentCategories(self.categories);
            currentCategory = self.categories;
            return data.data;
        });
    };

    var augmentCategories = function(categories){
        var iterator = new cc.util.TreeIterator(categories, 'children');
        iterator.iterateChildren(function(category, parent){
            category.parent = parent;
            category.image = cc.Config.mediaFolder + category.urlId + "." + cc.Config.mediaImgExtension;
        });
    };

    var findChildCategoriesAndReturnPromise = function(data, rootCategory){
        var childCategory = findChildCategory(data, rootCategory);
        var deferred = $q.defer();
        deferred.resolve(childCategory);
        return deferred.promise;
    };

    var findChildCategory = function(rootCategory, urlId){
        var iterator = new cc.util.TreeIterator(rootCategory, 'children');
        var matchedCategory;

        iterator.iterateChildren(function(category){
            if(category.urlId === urlId){
                matchedCategory = category;
                return false;
            }
        });

        currentCategory = matchedCategory;

        return matchedCategory;
    };

    return self;
});