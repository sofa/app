'use strict';

angular.module('CouchCommerceApp').factory('trustedShopsService', function (configService) {

    var self = {};

    var locale = configService.get('locale').split('-');
    locale = locale[0] + '-' + locale[1].toUpperCase();
    self.locale = locale;

    self.convertPaymentIdentifier = function (identifier) {
        //We need to map payment identifier from our identifiers to the ones trust shops uses.
        //Ideally the backend will send those.
        switch (identifier) {
        case 'PayPal':
            return 'PAYPAL';
        }
    };

    return self;
});
