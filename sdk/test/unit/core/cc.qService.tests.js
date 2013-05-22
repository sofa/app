module('cc.qService.tests');

test('can create qService instance', function() {

    var qService = new cc.QService();

    ok(qService, 'Created qService instance' );
});


test('can resolve synchronously', function() {

    var qService = new cc.QService();
    var deferred = qService.defer();
    deferred.resolve(true);

    deferred.promise.then(function(data){
        ok(data, 'is true');
    });
});

asyncTest('can resolve asynchronously', function() {

    expect(1);

    var qService = new cc.QService();
    var deferred = qService.defer();


    setTimeout(function(){
        deferred.resolve(true);
    }, 100);

    
    deferred.promise.then(function(data){
        ok(data, 'is true');
        start();
    });
});