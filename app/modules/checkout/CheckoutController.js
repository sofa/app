'use strict'

angular
    .module('CouchCommerceApp')
    .controller('CheckoutController',
    [
        '$scope','basketService', 'navigationService', 'checkoutService', 'userService', 'configService', '$dialog',
        function CheckoutController($scope, basketService, navigationService, checkoutService, userService, configService, $dialog) {

            //should we abstract this into something reusable for the SDK?
            var checkoutModel = {
                billingAddress: userService.getInvoiceAddress(),
                shippingAddress: userService.getShippingAddress(),
                supportedShippingMethods: [],
                supportedPaymentMethods: [],
                selectedPaymentMethod: null,
                selectedShippingMethod: null,
                addressEqual: true,
                surchargeHint: ''
            };

            $scope.checkoutService = checkoutService;
            $scope.configService = configService;
            $scope.basketService = basketService;
            $scope.navigationService = navigationService;

            $scope.checkoutModel = checkoutModel;

            var validateCheckout = function(){
                checkoutService
                    .getSupportedCheckoutMethods(checkoutModel)
                    .then(function(data){
                        if(data){
                            checkoutModel.supportedPaymentMethods = data.paymentMethods;
                            checkoutModel.supportedShippingMethods = data.shippingMethods;
                        }
                    });
            };

            var checkSurcharge = function(){
                if (checkoutModel.selectedPaymentMethod &&
                    checkoutModel.selectedPaymentMethod.surcharge > 0){
                    //to keep compatibility to our current language file we need to
                    //deal with the {surcharge} marker in the language value and replace it with the
                    //surcharge value
                    checkoutModel.surchargeHint = $scope.ln.surChargeWarning
                                                            .replace(/{\s*surcharge\s*}/, 
                                                                checkoutModel.selectedPaymentMethod.surcharge + ' ' + cc.Config.currencySign);
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

            //validate the checkout on load
            validateCheckout();

            //set summary on load
            updateSummary();

            //validate the checkout, each time one of the following changes
            [
                'checkoutModel.selectedPaymentMethod',
                'checkoutModel.selectedShippingMethod',
                'checkoutModel.billingAddress.country',
                'checkoutModel.shippingAddress.country'
            ].forEach(function(exp){
                $scope.$watch(exp, function(oldValue, newValue){
                    //we need to check for equality rather than for reference equality 
                    //to avoid unneccesary processing.
                    if(angular.equals(oldValue, newValue)){
                        return;
                    }
                    validateCheckout();
                    checkSurcharge();
                    updateSummary();
                    saveAddresses();
                });
            });

            $scope.canProceed = function(){
                return  $scope.billingAddressForm.$valid &&
                        (checkoutModel.addressEqual || $scope.shippingAddressForm.$valid);
            };

            $scope.proceed = function(){
                saveAddresses();
                checkoutService
                    .checkoutWithCouchCommerce(checkoutModel)
                    .then(function(token){
                        navigationService.navigateToSummary(token);
                    });
            };
        }
    ]);
