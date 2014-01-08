

angular
    .module('CouchCommerceApp')
    .controller('ThankyouController',
    [
        '$scope', 'navigationService', 'trustedShopsService', 'summaryResponse', 'trackingService', 'basketService',
        function ThankyouController($scope, navigationService, trustedShopsService, summaryResponse, trackingService, basketService) {

            'use strict';

            // It is possible that an error occurs between the summary and thankyou page (e.g. couchpay)
            // There the basket is only cleared when the thankyou page is loaded (as this page will always be shown, regardless of the transaction type)
            basketService.clear();

            trackingService.trackTransaction(summaryResponse.token);

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
