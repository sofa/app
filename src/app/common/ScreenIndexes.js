'use strict';

var screenIndexMap = {
    '-999999': 'unknown',
    '-1'     : 'pages',
    '0'      : 'category',
    '1'      : 'products',
    '2'      : 'product',
    '3'      : 'cart',
    '4'      : 'checkout',
    '5'      : 'summary',
    '6'      : 'thankyou'
};

//allow reverse lookups
angular.forEach(screenIndexMap, function (value, key) {
    screenIndexMap[value] = parseInt(key, 10);
});

angular.module('CouchCommerceApp')
.constant('screenIndexes', screenIndexMap);
