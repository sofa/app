'use strict';

/* global sofa */

angular
    .module('sofa.checkout')
    .controller('StepController', function StepController($scope, checkoutService, $q, shippingMethodFormatter, $exceptionHandler) {
        var self = this;
        var PAYPAL_EXPRESS_ID = 'paypal_express';
        var lastQuoteWrapper = null;

        var getPaymentMethodsWithoutPayPal = function (allMethods) {
             return allMethods.filter(function (method) {
                 return method.method !== PAYPAL_EXPRESS_ID;
             });
        };

        var deactivateMethods = function (methods) {
            if (!methods) {
                return;
            }
            methods.forEach(function (methodName) {
                self.steps[methodName].active = false;
            });
        };

        var finishStep = function (current, next) {
            current.mode = 'summary';
            current.valid = true;

            if (next) {
                next.active = true;
                if (next.valid) {
                    self.proceedFrom(current.next);
                }
            }
        };

        var createSequence = function (currentStep, nextStep) {

            var hasOnLeave = angular.isFunction(currentStep.onLeave),
                hasOnEnter = nextStep && angular.isFunction(nextStep.onEnter);

            return hasOnLeave && hasOnEnter ? currentStep.onLeave().then(nextStep.onEnter) :
                   hasOnLeave && !hasOnEnter ? currentStep.onLeave() :
                   !hasOnLeave && hasOnEnter ? nextStep.onEnter() : $q.when();
        };

        self.editSection = function (section) {
            self.steps[section].mode = 'edit';
            deactivateMethods(self.steps[section].deactivates);
        };

        self.proceedFrom = function (current) {
            var deferred = $q.defer();
            var currentStep = self.steps[current];
            var nextStep = self.steps[currentStep.next];
            
            createSequence(currentStep, nextStep)
                .then(function () {
                    finishStep(currentStep, nextStep);
                    deferred.resolve();
                }, function (e) {
                    deferred.reject();
                    $exceptionHandler(new Error('Could not proceed from checkout step "' + currentStep.name + '", due to "' + e + '"'));
                });

            return deferred.promise;
        };

        self.finishSteps = function () {
            self.steps.shippingMethod.onLeave()
                .then(function () {
                    $scope.checkoutController.proceed();
                }, function (e) {
                    $exceptionHandler(new Error('Could not proceed to summary page due to ' + e));
                });
        };

        self.steps = {
            shippingAddress: {
                name: 'ShippingAddress',
                active: true,
                mode: 'edit', // [summary]
                valid: false,
                next: 'billingAddress',
                deactivates: ['billingAddress', 'paymentMethod', 'shippingMethod'],
                useParcelStation: false,
                onLeave: function () {
                    var deferred = $q.defer();
                    // save shipping Address to storage
                    checkoutService.updateShippingAddress($scope.checkoutModel.shippingAddress);

                    // There might be some intercepting address validation one day...
                    deferred.resolve();

                    return deferred.promise;
                }
            },
            billingAddress: {
                name: 'BillingAddress',
                active: false,
                mode: 'edit',
                valid: false,
                next: 'paymentMethod',
                deactivates: ['paymentMethod', 'shippingMethod'],
                sameAsShipping: !checkoutService.hasExistingBillingAddress(),
                onLeave: function () {
                    if (!self.steps.billingAddress.sameAsShipping) {
                        checkoutService.updateBillingAddress($scope.checkoutModel.billingAddress);
                    }
                    $scope.checkoutModel.addressEqual = self.steps.billingAddress.sameAsShipping;

                    // TODO: if quote exists, reuse and update
                    return checkoutService
                        .createQuote($scope.checkoutModel)
                        .then(function(quoteWrapper) {
                            lastQuoteWrapper = quoteWrapper;
                        }, function (e) {
                            $q.reject();
                            $exceptionHandler(new Error('Error creating a quote: ', e));
                        });
                }
            },
            paymentMethod: {
                name: 'PaymentMethod',
                active: false,
                mode: 'edit',
                valid: false,
                next: 'shippingMethod',
                deactivates: ['shippingMethod'],
                extraFields: {},
                onEnter: function () {
                    var deferred = $q.defer();

                    var existingPayment = checkoutService.getPaymentMethod();

                    $scope.checkoutController.viewModel.supportedPaymentMethods = getPaymentMethodsWithoutPayPal(lastQuoteWrapper.quote.allowedPaymentMethods);
//                    $scope.checkoutController.viewModel.supportedShippingMethods = data.shippingMethods;

                    if (existingPayment && existingPayment.methodCode) {
                        $scope.checkoutController.viewModel.selectedPaymentMethod =
                            checkoutService.getPaymentMethodByCode(existingPayment.methodCode, lastQuoteWrapper.quote.allowedPaymentMethods);
                        $scope.checkoutController.viewModel.paymentExtraFields = existingPayment.methodDetails || {};
                    }

                    if (!$scope.checkoutController.viewModel.supportedPaymentMethods.length) {
                        deferred.reject('No payment methods available');
                    } else {
                        deferred.resolve();
                    }
                    // checkoutService
                    //     .getAvailableCheckoutMethods($scope.checkoutModel)
                    //     .then(function (data) {
                    //         var existingPayment = checkoutService.getPaymentMethod();

                    //         $scope.checkoutController.viewModel.supportedPaymentMethods = getPaymentMethodsWithoutPayPal(data.paymentMethods);
                    //         $scope.checkoutController.viewModel.supportedShippingMethods = data.shippingMethods;

                    //         if (existingPayment && existingPayment.methodCode) {
                    //             $scope.checkoutController.viewModel.selectedPaymentMethod =
                    //                 checkoutService.getPaymentMethodByCode(existingPayment.methodCode, data.paymentMethods);
                    //             $scope.checkoutController.viewModel.paymentExtraFields = existingPayment.methodDetails || {};
                    //         }

                    //         deferred.resolve();
                    //     }, function () {
                    //         // TODO: we need some sane message here to display to the user
                    //         deferred.reject('CheckoutService did not respond');
                    //     });

                    return deferred.promise;
                },
                onLeave: function () {
                    var deferred = $q.defer();
                    var paymentMethod;

                    if (sofa.Util.isEmpty($scope.checkoutController.viewModel.selectedPaymentMethod)) {
                        deferred.reject('No payment method selected');
                    } else {
                        paymentMethod = {
                            methodCode: $scope.checkoutController.viewModel.selectedPaymentMethod.code,
                            methodDetails: $scope.checkoutController.viewModel.paymentExtraFields
                        };

                        // Save payment method data to storage
                        checkoutService.updatePaymentMethod(paymentMethod);
                        // Save payment method data to checkoutModel
                        $scope.checkoutModel.payment =
                            checkoutService.getPaymentBackendModel(paymentMethod.methodCode, paymentMethod.methodDetails);

                        // There might be some intercepting validation one day...
                        deferred.resolve();
                    }

                    return deferred.promise;
                }
            },
            shippingMethod: {
                name: 'ShippingMethod',
                active: false,
                mode: 'edit',
                valid: false,
                hasMethods: true,
                formatter: shippingMethodFormatter,
                onEnter: function () {
                    var deferred = $q.defer();

                    if (!$scope.checkoutController.viewModel.supportedShippingMethods.length) {
                        deferred.reject('No shipping methods available');
                    } else {
                        // Preselect the first shipping option
                        if (sofa.Util.isEmpty($scope.checkoutController.viewModel.selectedShippingMethod)) {
                            $scope.checkoutController.viewModel.selectedShippingMethod = $scope.checkoutController.viewModel.supportedShippingMethods[0];
                        }

                        deferred.resolve();
                    }

                    self.steps.shippingMethod.hasMethods = !!$scope.checkoutController.viewModel.supportedShippingMethods.length;

                    return deferred.promise;
                },
                onLeave: function () {
                    var deferred = $q.defer();

                    if (sofa.Util.isEmpty($scope.checkoutController.viewModel.selectedShippingMethod)) {
                        deferred.reject('No shipping method selected');
                    } else {
                        // Save shipping method data to storage
                        checkoutService.updateShippingMethod($scope.checkoutController.viewModel.selectedShippingMethod);
                        // Save shipping method data to checkoutModel
                        $scope.checkoutModel.shipping =
                            checkoutService.getShippingBackendModel($scope.checkoutController.viewModel.selectedShippingMethod.methodCode);

                        deferred.resolve();
                    }

                    return deferred.promise;
                }
            }
        };

        // initially check, if we can speed up the checkout process
        var unwatchShippingAddress = $scope.$watch('shippingAddressForm.$valid', function (nv) {
            if (nv && !$scope.shippingAddressForm.$dirty) {
                return self.proceedFrom('shippingAddress')
                    .then(function () {
                        return self.proceedFrom('billingAddress');
                    })
                    .then(function () {
                        if (checkoutService.getPaymentMethod()) {
                            return self.proceedFrom('paymentMethod');
                        }
                    })
                    .then(function () {
                        unwatchShippingAddress();
                    }, unwatchShippingAddress);
            }
        });
    });
