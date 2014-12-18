'use strict';

/* global sofa */

angular
    .module('sofa.checkout')
    .controller('StepController', function StepController($scope, checkoutService, $q, shippingMethodFormatter) {
        var stepController = this;
        var PAYPAL_EXPRESS_ID = 'paypal_express';

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
                stepController.steps[methodName].active = false;
            });
        };

        var finishStep = function (current, next) {
            current.mode = 'summary';
            current.valid = true;

            if (next) {
                next.active = true;
                if (next.valid) {
                    stepController.proceedFrom(current.next);
                }
            }
        };

        var createQueue = function (currentStep, nextStep) {
            var queue = [];

            if (currentStep.onLeave && angular.isFunction(currentStep.onLeave)) {
                queue.push(currentStep.onLeave());
            }

            if (nextStep && nextStep.onEnter && angular.isFunction(nextStep.onEnter)) {
                queue.push(nextStep.onEnter());
            }

            return queue;
        };

        stepController.editSection = function (section) {
            stepController.steps[section].mode = 'edit';
            deactivateMethods(stepController.steps[section].deactivates);
        };

        stepController.proceedFrom = function (current) {
            var deferred = $q.defer();
            var currentStep = stepController.steps[current];
            var nextStep = stepController.steps[currentStep.next];
            var queue = createQueue(currentStep, nextStep);

            if (queue.length) {
                $q.all(queue)
                    .then(function () {
                        finishStep(currentStep, nextStep);
                        deferred.resolve();
                    }, function (e) {
                        console.log('q.all failed', e);
                        deferred.reject(e);
                    });
            } else {
                finishStep(currentStep, nextStep);
                deferred.resolve();
            }

            return deferred.promise;
        };

        stepController.finishSteps = function () {
            stepController.steps.shippingMethod.onLeave()
                .then(function () {
                    $scope.ctrl.proceed();
                }, function (error) {
                    console.log(error);
                });
        };

        stepController.steps = {
            shippingAddress: {
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
                active: false,
                mode: 'edit',
                valid: false,
                next: 'paymentMethod',
                deactivates: ['paymentMethod', 'shippingMethod'],
                sameAsShipping: !checkoutService.hasExistingBillingAddress(),
                onLeave: function () {
                    var deferred = $q.defer();

                    if (!stepController.steps.billingAddress.sameAsShipping) {
                        checkoutService.updateBillingAddress($scope.checkoutModel.billingAddress);
                    }
                    // There might be some intercepting address validation one day...
                    deferred.resolve();

                    return deferred.promise;
                }
            },
            paymentMethod: {
                active: false,
                mode: 'edit',
                valid: false,
                next: 'shippingMethod',
                deactivates: ['shippingMethod'],
                extraFields: {},
                onEnter: function () {
                    var deferred = $q.defer();

                    checkoutService
                        .getAvailableCheckoutMethods($scope.checkoutModel)
                        .then(function (data) {
                            var existingPayment = checkoutService.getPaymentMethod();

                            $scope.ctrl.viewModel.supportedPaymentMethods = getPaymentMethodsWithoutPayPal(data.paymentMethods);
                            $scope.ctrl.viewModel.supportedShippingMethods = data.shippingMethods;

                            if (existingPayment && existingPayment.methodCode) {
                                $scope.ctrl.viewModel.selectedPaymentMethod =
                                    checkoutService.getPaymentMethodByCode(existingPayment.methodCode, data.paymentMethods);
                                $scope.ctrl.viewModel.paymentExtraFields = existingPayment.methodDetails || {};
                            }

                            deferred.resolve();
                        }, function () {
                            // TODO: we need some sane message here to display to the user
                            deferred.reject('CheckoutService did not respond');
                        });

                    return deferred.promise;
                },
                onLeave: function () {
                    var deferred = $q.defer();
                    var paymentMethod;

                    if (sofa.Util.isEmpty($scope.ctrl.viewModel.selectedPaymentMethod)) {
                        deferred.reject('No payment method selected');
                    } else {
                        paymentMethod = {
                            methodCode: $scope.ctrl.viewModel.selectedPaymentMethod.code,
                            methodDetails: $scope.ctrl.viewModel.paymentExtraFields
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
                active: false,
                mode: 'edit',
                valid: false,
                hasMethods: true,
                formatter: shippingMethodFormatter,
                onEnter: function () {
                    var deferred = $q.defer();

                    if (!$scope.ctrl.viewModel.supportedShippingMethods.length) {
                        deferred.reject('No shipping methods available');
                    } else {
                        // Preselect the first shipping option
                        if (sofa.Util.isEmpty($scope.ctrl.viewModel.selectedShippingMethod)) {
                            $scope.ctrl.viewModel.selectedShippingMethod = $scope.ctrl.viewModel.supportedShippingMethods[0];
                        }

                        deferred.resolve();
                    }

                    stepController.steps.shippingMethod.hasMethods = !!$scope.ctrl.viewModel.supportedShippingMethods.length;

                    return deferred.promise;
                },
                onLeave: function () {
                    var deferred = $q.defer();

                    if (sofa.Util.isEmpty($scope.ctrl.viewModel.selectedShippingMethod)) {
                        deferred.reject('No shipping method selected');
                    } else {
                        // Save shipping method data to storage
                        checkoutService.updateShippingMethod($scope.ctrl.viewModel.selectedShippingMethod);
                        // Save shipping method data to checkoutModel
                        $scope.checkoutModel.shipping =
                            checkoutService.getShippingBackendModel($scope.ctrl.viewModel.selectedShippingMethod.methodCode);

                        deferred.resolve();
                    }

                    return deferred.promise;
                }
            }
        };

        // initially check, if we can speed up the checkout process
        var unwatchShippingAddress = $scope.$watch('shippingAddressForm.$valid', function (nv) {
            if (nv && !$scope.shippingAddressForm.$dirty) {
                return stepController.proceedFrom('shippingAddress')
                    .then(function () {
                        return stepController.proceedFrom('billingAddress');
                    })
                    .then(function () {
                        if (checkoutService.getPaymentMethod()) {
                            return stepController.proceedFrom('paymentMethod');
                        }
                    })
                    .then(function () {
                        unwatchShippingAddress();
                    }, unwatchShippingAddress);
            }
        });
    });
