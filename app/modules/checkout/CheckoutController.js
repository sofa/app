

angular
    .module('CouchCommerceApp')
    .controller('CheckoutController',
    [
        '$scope','basketService', 'navigationService',
        'checkoutService', 'userService', 'configService',
        'dialog', 'payPalOverlayService', 'shippingMethodFormatter',
        function CheckoutController($scope, basketService, navigationService,
                                    checkoutService, userService, configService,
                                    dialog, payPalOverlayService, shippingMethodFormatter) {

            'use strict';

            var PAYPAL_EXPRESS_ID = 'paypal_express';

            var lastUsedPaymentMethod = checkoutService.getLastUsedPaymentMethod();

            //should we abstract this into something reusable for the SDK?
            var checkoutModel = {
                billingAddress: userService.getInvoiceAddress(),
                shippingAddress: userService.getShippingAddress(),
                supportedShippingMethods: [],
                supportedPaymentMethods: [],
                selectedPaymentMethod: lastUsedPaymentMethod && lastUsedPaymentMethod.method !== PAYPAL_EXPRESS_ID ? lastUsedPaymentMethod : null,
                selectedShippingMethod: checkoutService.getLastUsedShippingMethod(),
                addressEqual: true,
                surchargeHint: '',
                salutations: [$scope.ln.salutationMale, $scope.ln.salutationFemale],
                salutation: null
            };

            $scope.checkoutService = checkoutService;
            $scope.configService = configService;
            $scope.basketService = basketService;
            $scope.navigationService = navigationService;

            $scope.checkoutModel = checkoutModel;

            $scope.shippingMethodFormatter = shippingMethodFormatter;

            var validateCheckout = function(){
                checkoutService
                    .getSupportedCheckoutMethods(checkoutModel)
                    .then(function(data){
                        if(data){

                            if (!checkoutModel.selectedPaymentMethod &&
                                data.paymentMethods.length > 1 &&
                                data.paymentMethods[0].method === PAYPAL_EXPRESS_ID){
                                checkoutModel.selectedPaymentMethod = data.paymentMethods[1];
                            }

                            checkoutModel.supportedPaymentMethods = data.paymentMethods;
                            checkoutModel.supportedShippingMethods = data.shippingMethods;
                        }
                    });
            };

            var findFirstNonePayPalMethod = function(paymentMethods){
                return cc.Util.find(paymentMethods, function(method){
                    return method.method !== PAYPAL_EXPRESS_ID;
                });
            };

            var checkSurcharge = function(){
                if ( $scope.summary.surcharge ) {
                    //to keep compatibility to our current language file we need to
                    //deal with the {surcharge} marker in the language value and replace it with the
                    //surcharge value
                    if ( $scope.summary.surcharge > 0 ) {
                        checkoutModel.surchargeHint = $scope.ln.surChargeWarning
                                                        .replace(/{\s*surcharge\s*}/,
                                                        $scope.summary.surchargeStr + ' ' + cc.Config.currencySign);
                    }
                    else if ( $scope.summary.surcharge < 0 ) {
                        checkoutModel.surchargeHint = $scope.ln.discountWarning
                                                        .replace(/{\s*surcharge\s*}/,
                                                        Math.abs(parseFloat($scope.summary.surchargeStr)).toFixed(2) + ' ' + cc.Config.currencySign);
                    }
                }
                else{
                    checkoutModel.surchargeHint = '';
                }
            };

            var updateSummary = function(){
                $scope.summary = basketService.getSummary({
                    paymentMethod: checkoutModel.selectedPaymentMethod,
                    shippingMethod: checkoutModel.selectedShippingMethod
                });
            };

            var saveAddresses = function(){
                userService.updateInvoiceAddress(checkoutModel.billingAddress);
                userService.updateShippingAddress(checkoutModel.shippingAddress);
            };

            //those methods we want to run everytime the user enters the view
            validateCheckout();
            updateSummary();
            checkSurcharge();

            //validate the checkout, each time one of the following changes
            [
                'checkoutModel.selectedPaymentMethod',
                'checkoutModel.selectedShippingMethod',
                'checkoutModel.billingAddress.country',
                'checkoutModel.shippingAddress.country'
            ].forEach(function(exp){
                $scope.$watch(exp, function(newValue, oldValue){
                    //we need to check for equality rather than for reference equality
                    //to avoid unneccesary processing.
                    if(angular.equals(newValue, oldValue)){
                        return;
                    }
                    validateCheckout();
                    updateSummary();
                    checkSurcharge();
                    saveAddresses();
                });
            });

            $scope.$watch('checkoutModel.selectedPaymentMethod', function(newValue, oldValue){
                if(!angular.equals(newValue, oldValue) && newValue && newValue.method === PAYPAL_EXPRESS_ID){
                    payPalOverlayService
                        .startPayPalCheckout()
                        //todo change this to catch() once we update angular
                        .then(null, function(){
                            checkoutModel.selectedPaymentMethod = findFirstNonePayPalMethod(checkoutModel.supportedPaymentMethods);
                        });
                }
            });

            $scope.canProceed = function(){
                return  $scope.billingAddressForm.$valid &&
                        (checkoutModel.addressEqual || $scope.shippingAddressForm.$valid) &&
                        checkoutModel.selectedPaymentMethod &&
                        checkoutModel.selectedPaymentMethod.method !== PAYPAL_EXPRESS_ID;
            };

            $scope.proceed = function(){
                saveAddresses();
                checkoutService
                    .checkoutWithCouchCommerce(checkoutModel)
                    .then(function(token){
                        navigationService.navigateToSummary(token);
                    }, function(){
                        dialog
                            .messageBox(
                                $scope.ln.btnWarning,
                                $scope.ln.errorGettingPaymentDetails,
                                [{result: 'ok', label: $scope.ln.btnOk}]
                            );
                    });
            };
        }
    ]);
