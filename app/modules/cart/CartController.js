'use strict'

angular
    .module('CouchCommerceApp')
    .controller('CartController',
    [
        '$scope','basketService', 'productService', 'navigationService', '$dialog',
        function CartController($scope, basketService, productService, navigationService, $dialog) {

            $scope.basketService = basketService;
            $scope.productService = productService;
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
                            'Artikel entfernen?',
                            'Soll der Artikel entfernt werden?',
                            [{result: 'cancel', label: 'Abbrechen'}, {result: 'ok', label: 'Entfernen'}]
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
