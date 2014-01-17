module('cc.Util.tests');

test('every returns true or false correctly', function() {

    var testData = [{
                        qty: 1
                    },{
                        qty: 1
                    },{
                        qty: 1
                    }];

    var result = cc.Util.every(testData, function(item){
        return item.qty === 1;
    });

    var proof = cc.Util.every(testData, function(item){
        return item.qty < 1;
    });
    
    ok(result, 'all have a qty of 1');
    ok(!proof, 'not all have a qty with less than 1');

    var otherData = [{
                    qty: 1
                },{
                    qty: 2
                },{
                    qty: 1
                }];

    var otherResult = cc.Util.every(otherData, function(item){
        return item.qty === 1;
    });

    ok(!proof, 'not all have a qty of 1');
});


