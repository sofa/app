'use strict'

angular
    .module('CouchCommerceApp')
    .controller('CartController',
    [
        '$scope','basketService', 'navigationService', '$dialog',
        function CartController($scope, basketService, navigationService, $dialog) {

            $scope.basketService = basketService;
            $scope.navigationService = navigationService;

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
        }
    ]);
