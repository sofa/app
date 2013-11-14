

angular
    .module('CouchCommerceApp')
    .controller('PayPalOverlayController',
    [
        '$scope','basketService', 'navigationService', 'configService', 'checkoutService', '$dialog', 'checkoutInfo',
        function PayPalOverlayController($scope, basketService, navigationService, configService, checkoutService, $dialog, checkoutInfo) {
            'use strict';

            var vm = {
                countries: configService.getSupportedCountries(),
                selectedCountry: configService.getDefaultCountry(),
                supportedShippingMethods: checkoutInfo.shippingMethods,
                selectedShippingMethod: checkoutInfo.shippingMethods.length > 0 ? checkoutInfo.shippingMethods[0] : null,
                canProceed: true
            };

            $scope.vm = vm;

            $scope.configService = configService;

            $scope.$watch('vm.selectedCountry', function(){
                //don't let the user proceed if we have inflight requests
                vm.canProceed = false;
                checkoutService
                    .getShippingMethodsForPayPal()
                    .then(function(data){
                        vm.canProceed = true;
                        vm.supportedShippingMethods = data.shippingMethods;
                    });
            });

            $scope.proceed = function(){
                $dialog.loading();
                checkoutService.checkoutWithPayPal(vm.selectedShippingMethod, vm.selectedCountry);
            };
        }
    ]);
