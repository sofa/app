cc.define('cc.CouchService', function($http, $q){

    'use strict';

    var self = {},
        products = {},
        currentCategory = null,
        productComparer = new cc.comparer.ProductComparer();


    /**
     * Fetches the category with the given categoryUrlId
     * If no category is specified, the method
     * defaults to the root category 
     * 
     * Options:
     * 
     *   - `categoryUrlId` the category to be fetched
     * 
     */
    self.getCategory = function(category){
        if (!category && !self.categories){
            return fetchAllCategories();
        }
        else if(!category && self.categories){
            var deferredCategories = $q.defer();
            deferredCategories.resolve(self.categories);
            return deferredCategories.promise;
        }
        else if(category && category.length > 0 && !self.categories){
            return fetchAllCategories()
                    .then(function(data){
                        return findChildCategory(data, category);
                    });
        }
        else if(category && category.length > 0 && self.categories){
            return findChildCategoriesAndReturnPromise(self.categories, category);
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
                var tempProducts = augmentProducts(data.data.products, categoryUrlId);
                //FixMe we are effectively creating a memory leak here by caching all
                //seen products forever. This needs to be more sophisticated
                products[categoryUrlId] = tempProducts;
                return tempProducts;
            });
        }

        var deferredProducts = $q.defer();
        deferredProducts.resolve(products[categoryUrlId]);
        return deferredProducts.promise;
    };

    var resolveWith = function(data){
        var deferred = $q.defer();
        deferred.resolve(data);
        return deferred.promise;
    };

    //it's a bit akward that we need to do that. It should be adressed
    //directly on our server API so that this extra processing can be removed.
    var augmentProducts = function(products, categoryUrlId){
        return products.map(function(product){
            product.categoryUrlId = categoryUrlId;
            return cc.Util.deepExtend(new cc.models.Product(), product);
        });
    };

    /**
     * Fetches the next product within the product's category
     * 
     * Options:
     * 
     *   - `product` the product to find the neighbour of
     * 
     */
    self.getNextProduct = function(product, circle){
        
        var getTargetProduct = function(categoryProducts){
            var index = getIndexOfProduct(categoryProducts, product);
            if (index > -1){
                var nextProduct = categoryProducts[index + 1];
                var targetProduct = !nextProduct && circle ?
                                    categoryProducts[0] : nextProduct || null;

                return targetProduct;
            }
        };

        return getPreviousOrNextProduct(product, circle, getTargetProduct);
    };

    /**
     * Fetches the previous product within the product's category
     * 
     * Options:
     * 
     *   - `product` the product to find the neighbour of
     * 
     */
    self.getPreviousProduct = function(product, circle){

        var getTargetProduct = function(categoryProducts, baseProduct){
            var index = getIndexOfProduct(categoryProducts, baseProduct);
            if (index > -1){
                var previousProduct = categoryProducts[index - 1];
                var targetProduct = !previousProduct && circle ? 
                                    categoryProducts[categoryProducts.length - 1] : 
                                    previousProduct || null;

                return targetProduct;
            }
        }

        return getPreviousOrNextProduct(product, circle, getTargetProduct);
    };

    var getPreviousOrNextProduct = function(product, circle, productFindFn){
        var cachedProducts = products[product.categoryUrlId];

        if (cachedProducts){
            return resolveWith(productFindFn(cachedProducts, product));
        }
        else {
            return  self.getProducts(product.categoryUrlId)
                        .then(function(catProducts){
                            return resolveWith(productFindFn(catProducts, product));
                        });
        }
    }

    var getIndexOfProduct = function(productTable, product){
        for (var i = 0; i < productTable.length; i++) {
            if (productComparer(productTable[i], product)){
                return i;
            }
        };

        return -1;
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
            return  self.getProducts(categoryUrlId)
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
            url: cc.Config.categoryJson
        })  
        .then(function(data){
            self.categories = data.data;
            augmentCategories(self.categories);
            currentCategory = self.categories;
            return data.data;
        });
    };

    var augmentCategories = function(categories){
        //we need to fix the urlId for the rootCategory to be empty
        categories.urlId = '';
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