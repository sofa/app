'use strict'

angular
    .module('CouchCommerceApp')
    .controller('CartController',
    [
        '$scope','basketService', 'navigationService', '$dialog', 'checkoutService', 'configService',
        function CartController($scope, basketService, navigationService, $dialog, checkoutService, configService) {

            $scope.basketService = basketService;
            $scope.navigationService = navigationService;
            $scope.configService = configService;

            var updateModels = function(){
                $scope.summary = basketService.getSummary();
                $scope.items = basketService.getItems();
                $scope.isEmpty = $scope.items.length === 0;
            };

            updateModels();

            basketService
                .on('cleared', updateModels)
                .on('itemAdded', updateModels)
                .on('itemRemoved', updateModels);

            $scope.decreaseItem = function(item){
                if (item.quantity > 1){
                    basketService.decreaseOne(item);
                }
                else {
                    $dialog
                        .messageBox(
                            $scope.ln.btnWarning,
                            $scope.ln.cartDelMsg,
                            [{result: 'cancel', label: $scope.ln.btnCancel}, {result: 'ok', label: $scope.ln.btnYes}]
                        )
                        .open()
                        .then(function(result){
                            if (result === 'ok'){
                                basketService.decreaseOne(item);
                            }
                        });
                }
            };

            $scope.checkoutWithPayPal = function(){

                $dialog.
                    loading();

                checkoutService
                    .getShippingMethodsForPayPal()
                    .then(function(data){

                        $dialog.closeLoading();

                        if (data.shippingMethods.length === 1 && configService.getSupportedCountries().length === 1){
                            checkoutService.checkoutWithPayPal(data.shippingMethods[0]);
                        }
                        else {
                            $dialog.dialog({
                                templateUrl: 'modules/cart/paypaloverlay.tpl.html',
                                controller: 'PayPalOverlayController',
                                resolve: {
                                    checkoutInfo: function() {
                                        return data;
                                    }
                                }
                            })
                            .open();
                        }
                    });
            };
        }
    ]);
