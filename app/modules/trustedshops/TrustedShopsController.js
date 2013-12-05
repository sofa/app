

angular
    .module('CouchCommerceApp')
    .controller('TrustedShopsController',
    [
        '$scope', '$modalInstance', 'trustedShopsService',
        function TrustedShopsController($scope, $modalInstance, trustedShopsService) {
            'use strict';

            $scope.locale = trustedShopsService.locale;

            $scope.ok = function () {
               $modalInstance.close();
            };
        }
    ]);
