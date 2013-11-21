

angular
    .module('CouchCommerceApp')
    .controller('ThankyouController',
    [
        '$scope', 'navigationService', 'trustedShopsService', 'summaryResponse', 'trackingService',
        function ThankyouController($scope, navigationService, trustedShopsService, summaryResponse, trackingService) {

            'use strict';

            var vm = $scope.vm = {};

            $scope.navigationService = navigationService;
            $scope.trustedShopsService = trustedShopsService;

            vm.summary = summaryResponse.summary;
            vm.trustedShopsPaymentIdentifier = trustedShopsService
                                                    .convertPaymentIdentifier(summaryResponse.response.paymentMethod);

            trackingService.trackEvent({
                category: 'event',
                action: 'google_conversion',
                value: vm.summary.total
            });
        }
    ]);
