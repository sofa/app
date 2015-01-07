'use strict';

angular
    .module('sofa.checkout')
    .controller('CheckoutController', function CheckoutController($scope, basketService, navigationService, checkoutService, configService, dialog, $filter, titleService, $controller) {

        var self = this;
        $scope.stepCtrl = $controller('StepController', {$scope: $scope});

        self.viewModel = {
            supportedShippingMethods: [],
            supportedPaymentMethods: [],
            selectedPaymentMethod: {},
            paymentExtraFields: {},
            selectedShippingMethod: {},
            addressEqual: true,
            surchargeHint: ''
        };

        titleService.setTitleWithSuffix($scope.ln.checkout);

        // API Model
        $scope.checkoutModel = checkoutService.getCleanCheckoutModel();
        $scope.checkoutModel.billingAddress = checkoutService.getBillingAddress() || {};
        $scope.checkoutModel.shippingAddress = checkoutService.getShippingAddress() || {};

        // TODO: bring back the surcharge
//        var checkSurcharge = function () {
//            if ($scope.summary.surcharge) {
//                //to keep compatibility to our current language file we need to
//                //deal with the {surcharge} marker in the language value and replace it with the
//                //surcharge value
//                if ($scope.summary.surcharge > 0) {
//                    $scope.checkoutModel.surchargeHint = $scope.ln.surChargeWarning
//                        .replace(/{\s*surcharge\s*}/,
//                        $filter('currency')($scope.summary.surchargeStr));
//                } else if ($scope.summary.surcharge < 0) {
//                    $scope.checkoutModel.surchargeHint = $scope.ln.discountWarning
//                        .replace(/{\s*surcharge\s*}/,
//                        $filter('currency')(Math.abs($scope.summary.surchargeStr)));
//                }
//            } else {
//                $scope.checkoutModel.surchargeHint = '';
//            }
//        };
//
//        // TODO: what about these?
//        var updateSummary = function () {
//            $scope.summary = basketService.getSummary({
//                paymentMethod: $scope.checkoutModel.selectedPaymentMethod,
//                shippingMethod: $scope.checkoutModel.selectedShippingMethod
//            });
//        };

//    $scope.canProceed = function () {
//        return $scope.paymentMethodForm.$valid && $scope.shippingMethodForm.$valid &&
//            $scope.shippingAddressForm.$valid &&
//            (checkoutModel.addressEqual || $scope.billingAddressForm.$valid) &&
//            checkoutModel.selectedShippingMethod &&
//            checkoutModel.supportedShippingMethods.length &&
//            checkoutModel.selectedPaymentMethod &&
//            checkoutModel.selectedPaymentMethod.method !== PAYPAL_EXPRESS_ID;
//    };

        self.proceed = function () {
            // TODO: add a final validator here (do we have to? should all have been checked within the respective steps)

            checkoutService
                .checkoutWithCouchCommerce($scope.checkoutModel)
                .then(function (token) {
                    navigationService.navigateToSummary(token);
                }, function () {
                    // TODO: did we introduce improved error messaging here?
                    dialog.messageBox($scope.ln.btnWarning, $scope.ln.errorGettingPaymentDetails, [
                        {result: 'ok', label: $scope.ln.btnOk}
                    ]);
                });
        };

        self.viewModel.addressOptions = {
            salutations: configService.get('salutations'),
            countries: configService.getSupportedCountries()
        };

        // TODO: this should come from a config object
        self.viewModel.optionalFields = {
            shipping: {
                salutation: true,
                company: true,
                phone: false,
                streetAdditional: false
            },
            billing: {
                salutation: true,
                company: false,
                phone: false,
                streetAdditional: false
            }
        };

        $scope.$watch(function () {
            return self.viewModel.selectedPaymentMethod;
        }, function () {
            if (self.viewModel.selectedPaymentMethod && self.viewModel.selectedPaymentMethod.extraFields) {
                $scope.stepCtrl.steps.paymentMethod.extraFields = self.viewModel.selectedPaymentMethod.extraFields;
            }
        });

    });
