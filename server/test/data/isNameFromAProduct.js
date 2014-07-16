'use strict';

var data = require('../../data');

exports.testSomething = function (test) {

    test.ok(data.isNameFromAProduct('pai-mu-tan-tee-weiss'), 'pai-mu-tan-tee-weiss is a product');
    test.done();

};
