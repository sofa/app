cc.define('cc.CouchService', function($http, $q, configService){

    'use strict';

    var self = {},
        products = {},
        productComparer = new cc.comparer.ProductComparer(),
        categoryMap = null;

    var MEDIA_FOLDER        = configService.get('mediaFolder'),
        MEDIA_IMG_EXTENSION = configService.get('mediaImgExtension'),
        API_URL             = configService.get('apiUrl'),
        //this is not exposed to the SAAS hosted product, hence the default value
        API_HTTP_METHOD     = configService.get('apiHttpMethod', 'jsonp'),
        STORE_CODE          = configService.get('storeCode'),
        CATEGORY_JSON       = configService.get('categoryJson');

    /**
     * Checks whether a given category a exists as an child
     * on another category b. Taking only direct childs into account.
     * 
     * Options:
     * 
     *   - `a` category a
     *   - `b` category b 
     */
    self.isAChildAliasOfB = function(categoryA, categoryB){
        if (!categoryB.children || categoryB.children.length === 0){
            return false;
        }

        var alias = cc.Util.find(categoryB.children, function(child){
            return child.urlId === categoryA.urlId;
        });

        return !cc.Util.isUndefined(alias);
    };

    /**
     * Checks whether a given category is the parent
     * of another category taking n hops into account
     * 
     * Options:
     * 
     *   - `a` category a
     *   - `b` category b 
     */
    self.isAParentOfB = function(categoryA, categoryB){
        //short circuit if it's a direct parent, if not recursively check
        return categoryB.parent === categoryA || 
               (categoryB.parent && self.isAParentOfB(categoryA, categoryB.parent)) === true;
    };

    /**
     * Checks whether a given category is the child
     * of another category taking n hops into account
     * 
     * Options:
     * 
     *   - `a` category a
     *   - `b` category b 
     */
    self.isAChildOfB = function(categoryA, categoryB){
        return self.isAParentOfB(categoryB, categoryA);
    };

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
        if (!category && !categoryMap){
            return fetchAllCategories();
        }
        else if(!category && categoryMap){
            return $q.when(categoryMap.rootCategory);
        }
        else if(category && category.length > 0 && !categoryMap){
            return fetchAllCategories()
                    .then(function(data){
                        return categoryMap.getCategory(category);
                    });
        }
        else if(category && category.length > 0 && categoryMap){
            return $q.when(categoryMap.getCategory(category));
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
                method: API_HTTP_METHOD,
                url: API_URL +
                '?&stid=' +
                STORE_CODE +
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

        return $q.when(products[categoryUrlId]);
    };

    //it's a bit akward that we need to do that. It should be adressed
    //directly on our server API so that this extra processing can be removed.
    var augmentProducts = function(products, categoryUrlId){
        return products.map(function(product){
            product.categoryUrlId = categoryUrlId;
            // the backend is sending us prices as strings.
            // we need to fix that up for sorting and other things to work
            product.price = parseFloat(product.price, 10);
            return cc.Util.extend(new cc.models.Product(), product);
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
        };

        return getPreviousOrNextProduct(product, circle, getTargetProduct);
    };

    var getPreviousOrNextProduct = function(product, circle, productFindFn){
        var cachedProducts = products[product.categoryUrlId];

        if (cachedProducts){
            return $q.when(productFindFn(cachedProducts, product));
        }
        else {
            return  self.getProducts(product.categoryUrlId)
                        .then(function(catProducts){
                            return productFindFn(catProducts, product);
                        });
        }
    };

    var getIndexOfProduct = function(productTable, product){
        for (var i = 0; i < productTable.length; i++) {
            if (productComparer(productTable[i], product)){
                return i;
            }
        }

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
                            return getProduct(data, productUrlId);
                        });
        }

        return $q.when(getProduct(products[categoryUrlId], productUrlId));
    };

    var getProduct = function(products, productUrlId){
        for (var i = 0; i < products.length; i++) {
            var product = products[i];
            if (product.urlKey === productUrlId){
                return product;
            }
        }

        return null;
    };

    var fetchAllCategories = function(){
        return $http({
            method: 'get',
            url: CATEGORY_JSON
        })  
        .then(function(data){
            var rootCategory = data.data;
            categoryMap = new cc.util.CategoryMap();
            categoryMap.rootCategory = rootCategory;
            augmentCategories(rootCategory);
            return rootCategory;
        });
    };

    var augmentCategories = function(categories){
        //we need to fix the urlId for the rootCategory to be empty
        categories.urlId = '';
        var iterator = new cc.util.TreeIterator(categories, 'children');
        iterator.iterateChildren(function(category, parent){
            category.parent = parent;
            category.image = MEDIA_FOLDER + category.urlId + "." + MEDIA_IMG_EXTENSION;
            categoryMap.addCategory(category);
        });
    };

    return self;
});