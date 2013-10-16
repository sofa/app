angular
    .module('CouchCommerceApp')
    .factory('trustedShopsService', ['configService',
        function(configService) {
            'use strict';

            var self = {};

            var locale = configService.get("locale").split("-");
            locale = locale[0] + "-" + locale[1].toUpperCase();
            self.locale = locale;

            return self;
        }
    ]);