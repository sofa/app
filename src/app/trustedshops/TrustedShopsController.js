'use strict';

angular.module('CouchCommerceApp').controller('TrustedShopsController', function ($scope, $modalInstance, trustedShopsService) {

    $scope.locale = trustedShopsService.locale;

    $scope.ok = function () {
        $modalInstance.close();
    };
});
