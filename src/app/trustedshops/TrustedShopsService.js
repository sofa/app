'use strict';

angular.module('CouchCommerceApp').factory('trustedShopsService', function (configService) {

    var self = {};

    var locale = configService.get('locale').split('-');
    locale = locale[0] + '-' + locale[1].toUpperCase();
    self.locale = locale;

    return self;
});
