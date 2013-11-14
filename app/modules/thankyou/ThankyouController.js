

angular
    .module('CouchCommerceApp')
    .controller('ThankyouController',
    [
        '$scope', 'navigationService', 'trustedShopsService', 'summaryResponse',
        function ThankyouController($scope, navigationService, trustedShopsService, summaryResponse) {

            'use strict';

            var vm = $scope.vm = {};

            $scope.navigationService = navigationService;
            $scope.trustedShopsService = trustedShopsService;

            vm.summary = summaryResponse.summary;
            vm.trustedShopsPaymentIdentifier = trustedShopsService
                                                    .convertPaymentIdentifier(summaryResponse.response.paymentMethod);

        }
    ]);
