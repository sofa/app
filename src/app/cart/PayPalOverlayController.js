'use strict';

angular.module('CouchCommerceApp')
.controller('PayPalOverlayController', function PayPalOverlayController($scope, configService, checkoutService, dialog, checkoutInfo, shippingMethodFormatter, $modalInstance) {

    var vm = {
        countries: configService.getSupportedCountries(),
        selectedCountry: configService.getDefaultCountry(),
        supportedShippingMethods: checkoutInfo.shippingMethods,
        selectedShippingMethod: checkoutInfo.shippingMethods.length > 0 ? checkoutInfo.shippingMethods[0] : null,
        canProceed: true
    };

    $scope.vm = vm;

    $scope.configService = configService;
    $scope.shippingMethodFormatter = shippingMethodFormatter;
    // For Magento, getShippingMethodsForPayPal() is likely to run about 10 seconds...
    $scope.processing = false;

    $scope.$watch('vm.selectedCountry', function () {
        //don't let the user proceed if we have pending requests
        vm.canProceed = false;
        $scope.processing = true;
        checkoutService
            .getShippingMethodsForPayPal(vm.selectedCountry)
            .then(function (data) {
                $scope.processing = false;
                vm.selectedShippingMethod = null;
                vm.supportedShippingMethods = data.shippingMethods;
                if (vm.supportedShippingMethods.length) {
                    vm.selectedShippingMethod = vm.supportedShippingMethods[0];
                }
            });
    });

    $scope.$watch('vm.selectedShippingMethod', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            vm.canProceed = !!newVal;
        }
    });

    $scope.proceed = function () {
        dialog.loading();
        checkoutService.checkoutWithPayPal(vm.selectedShippingMethod, vm.selectedCountry);
    };

    $scope.close = function () {
        $modalInstance.dismiss();
    };
});
