'use strict';

angular.module('CouchCommerceApp').factory('titleService', ['$document', 'configService', function ($document, configService) {

    var self = {};

    var storeName = configService.get('storeName');

    self.setTitle = function (title) {
        $document.prop('title', title);
    };

    self.setShopNameTitle = function () {
        $document.prop('title', storeName);
    };

    self.setTitleWithSuffix = function (title) {
        $document.prop('title', title + ' | ' + storeName);
    };
    
    return self;
}]);
