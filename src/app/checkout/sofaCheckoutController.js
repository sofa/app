'use strict';

angular
    .module('sofa.checkout')
    .controller('CheckoutController', function CheckoutController($scope, basketService, navigationService, checkoutService, configService, dialog, $filter, titleService, $controller) {

        var ctrl = this;
        $scope.stepCtrl = $controller('StepController', {$scope: $scope});

        ctrl.viewModel = {
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

        ctrl.proceed = function () {
            // TODO: add a final validator here

            checkoutService
                .checkoutWithCouchCommerce($scope.checkoutModel)
                .then(function (token) {
                    navigationService.navigateToSummary(token);
                }, function () {
                    dialog.messageBox($scope.ln.btnWarning, $scope.ln.errorGettingPaymentDetails, [
                        {result: 'ok', label: $scope.ln.btnOk}
                    ]);
                });
        };

        ctrl.viewModel.addressOptions = {
            salutations: configService.get('salutations'),
            countries: configService.getSupportedCountries()
        };

        // TODO: this should come from a config object
        ctrl.viewModel.optionalFields = {
            shipping: {
                salutation: true,
                company: true,
                phone: false,
                streetExtra: false
            },
            billing: {
                salutation: true,
                company: false,
                phone: false,
                streetExtra: false
            }
        };

        $scope.$watch('ctrl.viewModel.selectedPaymentMethod', function () {
            if (ctrl.viewModel.selectedPaymentMethod && ctrl.viewModel.selectedPaymentMethod.extraFields) {
                $scope.stepCtrl.steps.paymentMethod.extraFields = ctrl.viewModel.selectedPaymentMethod.extraFields;
            }
        });

    });
