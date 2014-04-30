'use strict';

angular.module('CouchCommerceApp')
    .factory('titleService', function ($document) {

        var self = {};

        self.setTitle = function (title) {
            $document.prop('title', title);
        };
        
        return self;
    });
