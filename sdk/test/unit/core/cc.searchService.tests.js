module('cc.searchService.tests');

//we set the debounce rate to 50ms for the tests to run faster
cc.Config.searchDebounceMs = 50;

var _configService = new cc.ConfigService();
var _searchUrl = _configService.get('searchUrl') + '?callback=JSON_CALLBACK&len=100';
var _storeCode = _configService.get('storeCode');
var _searchFields = 'text, categoryUrlKey, categoryName, productUrlKey, productImageUrl';

var createHttpService = function(){
    return new cc.mocks.httpService(new cc.QService());
};

test('can create searchService instance', function() {

    var searchService = new cc.SearchService(_configService, createHttpService(), new cc.QService());

    ok(searchService, 'Created searchService instance' );
});

asyncTest('normalizes umlauts', function() {
    expect(5);
    var httpService = createHttpService();

    var umlauts                     = 'áàâäúùûüóòôöéèêëß';
    var normalizedUmlauts           = 'aaaauuuuooooeeeess';
    var reversedNormalizedUmlauts   = 'sseeeeoooouuuuaaaa';

    var searchCommand = '(text:' + normalizedUmlauts + '* OR reverse_text:' + reversedNormalizedUmlauts + '*) AND storeCode:' + _configService.get('storeCode');
    httpService.when('JSONP', _searchUrl, { q: searchCommand, fetch: _searchFields }).respond({
        results: [
            'car',
            'carmaker'
        ]
    });

    var searchService = new cc.SearchService(_configService, httpService, new cc.QService());

    var $q = new cc.QService();

    searchService
        .search(umlauts)
        .then(function(response){
            ok(response, 'has response');
            var results = response.data.results;
            ok(results !== undefined, 'has payload');
            equal(results[0], 'car', 'has result');
            equal(results[1], 'carmaker', 'has result');
        });

    setTimeout(function(){
        start();
        var httpCallParams = httpService.getLastCallParams();
        ok(httpCallParams.url === _searchUrl, 'hits configured entpoint');
    }, 100);
});

asyncTest('calls searchService.search() 3 times but only makes 2 request which respond out of order.', function() {
    expect(6);

    /*
    Ok, this test is scary so let's break down what it does.

    It makes three calls to the searchService in a very specific order and timing.

    0ms  : searchService.search('ca');
    0ms  : searchService.search('car');
    50ms : searchService.search('carm');

    The first call with the searchString 'ca' should not even hit the backend
    as we debounce calls by a configureable time span.

    The second and the third call DO hit the backend. However, the call for
    'car' takes longer than the call for 'carm' which would normally result
    in showing the user results for 'car' even so 'carm' was what he had on
    the screen when he finished typing. But our searchService knows how to 
    deal with out-of-order-responses. This test proofs everything.
    */

    //the number of actual requests made against the backend
    var EXPECTED_OUTGOING_REQUESTS_COUNT = 2;
    //the number of requests returned to the user code by the searchService
    var EXPECTED_RETURNED_REQUESTS = 1;

    var httpService = createHttpService();

    //that's the response for the first request, it takes longer then the second
    //so that it arrives *after* the second request
    httpService.when('JSONP', _searchUrl, { q: '(text:car* OR reverse_text:rac*) AND storeCode:' + _storeCode, fetch: _searchFields }).respond({
        results: [
            'car',
            'carmaker'
        ]
    }, 150);

    //the response for the second request returns much quicker.
    httpService.when('JSONP', _searchUrl, { q: '(text:carm* OR reverse_text:mrac*) AND storeCode:' + _storeCode, fetch: _searchFields }).respond({
        results: [
            'carmaker'
        ]
    }, 50);

    var searchService = new cc.SearchService(_configService, httpService, new cc.QService());

    var $q = new cc.QService();

    var handledRequests = 0;

    //let's call this request zero because it will never hit the backend since searchService.search() 
    //internally debounces calls by a configured time span.
    searchService.search('ca');

    //that's the first real request that hit's the backend
    searchService
        .search('car')
        .then(function(response){
            //this should not happen because the request for 'car' should
            //be cancelled out by the request for 'carm'
            handledRequests++;
        });

    //that's the second request. It needs to run x ms after the last call, otherwise it 
    //would directly cancel out the previous so that the previous would not even hit the backend
    setTimeout(function(){
        searchService
            .search('carm')
            .then(function(response){
                handledRequests++;
                ok(response, 'has response');
                var results = response.data.results;
                ok(results !== undefined, 'has payload');
                equal(results[0], 'carmaker', 'has result');
            });
    }, 50);

    setTimeout(function(){
        start();
        ok(handledRequests === EXPECTED_RETURNED_REQUESTS, 'should not have handled first request');
        equal(httpService.getRequestQueue().length, EXPECTED_OUTGOING_REQUESTS_COUNT, 'makes two requests');

        var httpCallParams = httpService.getLastCallParams();
        ok(httpCallParams.url === _searchUrl, 'hits configured entpoint');

    }, 250);
});

asyncTest('calls searchService.search() 2 times and also makes 2 request to the search backend', function() {
    expect(10);

    /*
    In this case the second request does not cancel out the first one because the first one is long
    finished. So this test is basically just proving that we can use the searchService.search() method
    multiple times on it's own.
    */

    //the number of actual requests made against the backend
    var EXPECTED_OUTGOING_REQUESTS_COUNT = 2;
    //the number of requests returned to the user code by the searchService
    var EXPECTED_RETURNED_REQUESTS = 2;

    var httpService = createHttpService();

    httpService.when('JSONP', _searchUrl, { q: '(text:car* OR reverse_text:rac*) AND storeCode:' + _storeCode, fetch: _searchFields }).respond({
        results: [
            'car',
            'carmaker'
        ]
    }, 25);

    httpService.when('JSONP', _searchUrl, { q: '(text:carm* OR reverse_text:mrac*) AND storeCode:' + _storeCode, fetch: _searchFields }).respond({
        results: [
            'carmaker'
        ]
    }, 25);

    var searchService = new cc.SearchService(_configService, httpService, new cc.QService());

    var $q = new cc.QService();

    var handledRequests = 0;

    //that's the first real request that hit's the backend
    searchService
        .search('car')
        .then(function(response){
            //this should not happen because the request for 'car' should
            //be cancelled out by the request for 'carm'
            handledRequests++;
            ok(response, 'has response');
            var results = response.data.results;
            ok(results !== undefined, 'has payload');
            equal(results[0], 'car', 'has result');
            equal(results[1], 'carmaker', 'has result');
        });

    setTimeout(function(){
        searchService
            .search('carm')
            .then(function(response){
                handledRequests++;
                ok(response, 'has response');
                var results = response.data.results;
                ok(results !== undefined, 'has payload');
                equal(results[0], 'carmaker', 'has result');
            });
    }, 100);


    setTimeout(function(){
        start();
        ok(handledRequests === EXPECTED_RETURNED_REQUESTS, 'should have handled both requests');
        equal(httpService.getRequestQueue().length, EXPECTED_OUTGOING_REQUESTS_COUNT, 'makes two requests');

        var httpCallParams = httpService.getLastCallParams();
        ok(httpCallParams.url === _searchUrl, 'hits configured entpoint');

    }, 250);
});

asyncTest('groupes response by the given grouping definition', function() {
    expect(11);
    var httpService = createHttpService();

    var searchString = "f";
    var searchCommand = '(text:' + searchString + '* OR reverse_text:' + searchString + '*) AND storeCode:' + _configService.get('storeCode');
    httpService.when('JSONP', _searchUrl, { q: searchCommand, fetch: _searchFields }).respond({
        results: [
            { 
                categoryName: 'A',
                categoryUrlKey: '_A',
                text: 'Product of A 1'
            },
            { 
                categoryName: 'B',
                categoryUrlKey: '_B',
                text: 'Product of B 1'
            },
            { 
                categoryName: 'A',
                categoryUrlKey: '_A',
                text: 'Product of A 2'
            }
        ]
    });

    var searchService = new cc.SearchService(_configService, httpService, new cc.QService());

    var $q = new cc.QService();

    searchService
        .search(searchString, { groupKey: 'categoryUrlKey', groupText: 'categoryName'})
        .then(function(response){
            ok(response, 'has response');
            var results = response.data.results;
            var groupedResults = response.data.groupedResults;
            ok(results !== undefined, 'has payload');
            equal(results[0].text, 'Product of A 1', 'has result');
            equal(results[1].text, 'Product of B 1', 'has result');

            equal(groupedResults[0].groupKey, '_A', 'has grouped result');
            equal(groupedResults[1].groupKey, '_B', 'has grouped result');
            
            equal(groupedResults[0].groupText, 'A', 'has grouped result');
            equal(groupedResults[1].groupText, 'B', 'has grouped result');

            equal(groupedResults[0].items.length, 2, 'has 2 item');
            equal(groupedResults[1].items.length, 1, 'has 1 item');

            /*
            [
                {
                    groupKey: key-of-category,
                    groupText: text of category,
                    items: [
                            // just as in results
                           ]
                },{
                    groupKey: key-of-2nd-category,
                    groupText: text of 2nd category,
                    items: [
                            // just as in results
                           ]
                }
            ]
            */

        });

    setTimeout(function(){
        start();
        var httpCallParams = httpService.getLastCallParams();
        ok(httpCallParams.url === _searchUrl, 'hits configured entpoint');
    }, 100);
});

