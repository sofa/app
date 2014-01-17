/**
 * @name SearchService
 * @namespace cc.SearchService
 *
 * @description
 * Search service which let's you query against the CouchCommerce API to search
 * for products.
 */
cc.define('cc.SearchService', function(configService, $http, $q, applier){

    'use strict';

    var self                = {},
        lastRequestToken    = null,
        storeCode           = configService.get('storeCode'),
        debounceMs          = configService.get('searchDebounceMs', 300),
        endpoint            = configService.get('searchUrl') + '?callback=JSON_CALLBACK&len=100';

    /**
     * @method search
     * @memberof cc.SearchService
     *
     * @description
     * Searches for `searchStr` and groups the results if `grouping` is truthy.
     * This search is promise based to let you have flow control. Therefore it
     * returns a promise that gets resolved with the search results.
     *
     * @param {string} searchStr A search string.
     * @param {boolean} grouping Whether to group the results or not.
     *
     * @return {Promise} A promise with the search results.
     */
    self.search = function(searchStr, grouping){

        var deferredResponse = $q.defer();

        debouncedInnerSearch(deferredResponse, searchStr, grouping);

        return deferredResponse.promise;
    };

    var innerSearch = function(deferredResponse, searchStr, grouping){

        lastRequestToken = cc.Util.createGuid();

        var requestToken = lastRequestToken;

        if (!searchStr){
            deferredResponse.resolve({
                data: {
                    results: [],
                    groupedResults: []
                }
            });

        }
        else{
            $http({
                method: 'JSONP',
                url: endpoint,
                params: {
                    q: createSearchCommand(normalizeUmlauts(searchStr)),
                    fetch: 'text, categoryUrlKey, categoryName, productUrlKey, productImageUrl'
                }
            })
            .then(function(response){
                if (requestToken === lastRequestToken){
                    if (grouping){
                        groupResult(response, grouping);
                    }
                    deferredResponse.resolve(response);
                }
            });
        }

        //in an angular context, we need to call the applier to
        //make $http run. For non angular builds, no applier is needed.
        if(applier){
            applier();
        }

        return deferredResponse.promise;
    };

    var groupResult = function(response, grouping){
        var results = response.data.results;
        var grouped = results.reduce(function(prev, curr, index, arr) {
                            if (!prev[curr.categoryUrlKey]){
                                var group = prev[curr.categoryUrlKey] = {
                                    groupKey: curr.categoryUrlKey,
                                    groupText: curr.categoryName,
                                    items: []
                                };

                                prev.items.push(group);
                            }

                            prev[curr.categoryUrlKey].items.push(curr);

                            return prev;

                        }, {items: []});
        //we only care about the array. The object was just for fast lookups!
        response.data.groupedResults = grouped.items;
    };

    var debouncedInnerSearch = cc.Util.debounce(innerSearch, debounceMs);

    var createSearchCommand = function(searchStr){
        var reverseString = searchStr.split('').reverse().join('');
        return '(text:' + searchStr + '* OR reverse_text:' + reverseString + '*) AND storeCode:' + storeCode;
    };

    var normalizeUmlauts = function(searchStr){
        return searchStr
                    .replace(/[áàâä]/g, 'a')
                    .replace(/[úùûü]/g, 'u')
                    .replace(/[óòôö]/g, 'o')
                    .replace(/[éèêë]/g, 'e')
                    .replace(/[ß]/g, 'ss');
    };

    return self;
});
