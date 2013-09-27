cc.define('cc.SearchService', function(configService, $http, $q){

    'use strict';

    var self                = {},
        lastRequestToken    = null,
        storeCode           = configService.get('storeCode'),
        debounceMs          = configService.get('searchDebounceMs', 300),
        endpoint            = configService.get('searchUrl');

    self.search = function(searchStr){

        var deferredResponse = $q.defer();

        debouncedInnerSearch(deferredResponse, searchStr);

        return deferredResponse.promise;
    };

    var innerSearch = function(deferredResponse, searchStr){

        lastRequestToken = cc.Util.createGuid();

        var requestToken = lastRequestToken;

        $http({
            method: 'JSONP',
            url: endpoint,
            data: {
                q: createSearchCommand(normalizeUmlauts(searchStr)),
                fetch: 'text, categoryUrlKey, categoryName, productUrlKey'
            }
        })
        .then(function(response){
            if (requestToken === lastRequestToken){
                deferredResponse.resolve(response);
            }
        });

        return deferredResponse.promise;
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