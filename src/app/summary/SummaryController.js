'use strict';

angular.module('CouchCommerceApp').controller('SummaryController', function ($scope, navigationService, checkoutService, dialog, $stateParams, trustedShopsService, $state, snapRemote, basketService, titleService) {

    titleService.setTitleWithSuffix($scope.ln.summary);
    var vm = $scope.vm = {};

    vm.THANK_YOU_PAGE = 'thankyou';
    vm.SUMMARY_PAGE = 'summary';
    vm.page = vm.SUMMARY_PAGE;

    $scope.navigationService = navigationService;
    $scope.trustedShopsService = trustedShopsService;


    checkoutService
        .getSummary($stateParams.token)
        .then(function (result) {

            if (result.response.error) {

                // this means the user tries to access the summary page with an invalid token.
                // Probably something he has still left in his browser history.
                if (basketService.isEmpty()) {
                    navigationService.navigateToRootCategory();
                    return;
                }

                dialog
                    .messageBox(
                        $scope.ln.errorGettingPaymentDetails,
                        result.response.error,
                        [{result: 'ok', label: $scope.ln.btnOk}]
                    )
                .result
                .then(function (result) {
                    if (result === 'ok') {
                        snapRemote.open('right');
                    }
                });
                return;
            }

            vm.invoiceAddress   = result.invoiceAddress;
            vm.shippingAddress  = result.shippingAddress;
            vm.paymentMethod    = result.response.paymentMethod;
            vm.shippingMethod   = result.response.shippingMethod;
            vm.items            = result.response.items;
            //we directly set this one on the scope to gain reuse of the included template
            $scope.summary      = result.summary;
            $scope.coupons      = result.response.coupons;

        }, function () {

            dialog
                .messageBox(
                    $scope.ln.btnWarning,
                    $scope.ln.errorGettingPaymentDetails,
                    [{result: 'ok', label: $scope.ln.btnOk}]
                );
        });

    vm.showAgeAgreement = !!cc.Config.showAgeAgreement;
    vm.showGeneralAgreement = !!cc.Config.showGeneralAgreement;

    $scope.acceptedAgreements = function () {
        return  (!vm.showGeneralAgreement || vm.generalAgreement) &&
            (!vm.showAgeAgreement || vm.ageAgreement);
    };

    $scope.proceed = function () {
        checkoutService
            .activateOrder($stateParams.token)
            .then(function () {
                $state.transitionTo('thankyou');
            }, function () {
                dialog
                    .messageBox(
                        $scope.ln.btnWarning,
                        $scope.ln.errorGettingPaymentDetails,
                        [{result: 'ok', label: $scope.ln.btnOk}]
                    );
            });
    };
});
