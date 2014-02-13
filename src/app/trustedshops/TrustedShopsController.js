'use strict';

angular.module('CouchCommerceApp')
       .controller('TrustedShopsController', function ($scope, trustedShopsService) {

    $scope.locale = trustedShopsService.locale;
});
