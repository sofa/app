'use strict';

angular.module('CouchCommerceApp').controller('SummaryController', function ($scope, navigationService, checkoutService, dialog, $stateParams, trustedShopsService, $state) {

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
                dialog
                    .messageBox(
                        $scope.ln.errorGettingPaymentDetails,
                        result.response.error.paymentErrorMsg,
                        [{result: 'ok', label: $scope.ln.btnOk}]
                    )
                .result
                .then(function (result) {
                    if (result === 'ok') {
                        navigationService.navigateToCart();
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
