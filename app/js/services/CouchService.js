'use strict';

/* Services */

//This code can probably be improved.
//it's probably unefficient since it doesn't screen level by level
//instead it goes deep down all levels of each categories and then hops
//over to the next category.
var TreeIterator = function(tree, childNodeProperty){
    var me = this,
        continueIteration = true;

    me.iterateChildren = function(fn){
        continueIteration = true;
        return _iterateChildren(tree, fn);
    };

    var _iterateChildren = function(rootCategory, fn, parent){
        continueIteration = fn(rootCategory, parent);

        if (rootCategory[childNodeProperty] && continueIteration !== false){
            rootCategory[childNodeProperty].forEach(function(category){
                if (continueIteration !== false){
                    _iterateChildren(category, fn, rootCategory);
                }
            });
        }
    }
};

angular
    .module('CouchCommerceApp')
    .factory('couchService', ['$http', '$q', function($http, $q){
        var self = {},
            currentCategory = null;

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

        self.getProducts = function(categoryUrlId){
            return $http
                    .jsonp(cc.Config.apiUrl +
                    '?&stid=' +
                    cc.Config.storeId +
                    '&cat=' + categoryUrlId +
                    '&callback=JSON_CALLBACK')
                    .then(function(data){
                       return data.data.products;
                    });
        };

        self.getCurrentCategory = function(){
            return currentCategory;
        };

        var fetchAllCategories = function(){
            return $http
                .get('data/dasgibtesnureinmal/categories.json')
                .then(function(data){
                    self.categories = data.data;
                    augmentCategories(self.categories);
                    currentCategory = self.categories;
                    return data.data;
                });
        };

        var augmentCategories = function(categories){
            var iterator = new TreeIterator(categories, 'children');
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
            var iterator = new TreeIterator(rootCategory, 'children');
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
}]);


