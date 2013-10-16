

angular
    .module('CouchCommerceApp')
    .controller('TrustedShopsController',
    [
        '$scope', 'dialog', 'trustedShopsService',
        function TrustedShopsController($scope, dialog, trustedShopsService) {
            'use strict';

            $scope.locale = trustedShopsService.locale;

            $scope.ok = function () {
               dialog.close();
            };
        }
    ]);
