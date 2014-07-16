'use strict';

var data = require('../../data');

exports.testSomething = function (test) {

    var result = data.findCatByUrlId('genusswelten');

    test.equal(result.label, 'Genusswelten');
    test.done();

};
