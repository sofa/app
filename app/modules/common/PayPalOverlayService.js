angular
    .module('CouchCommerceApp')
    .factory('payPalOverlayService',['dialog', 'checkoutService', 'configService', function (dialog, checkoutService, configService) {

            'use strict';

            var self = {};

            self.startPayPalCheckout = function(){
                dialog.
                    loading();

                checkoutService
                    .getShippingMethodsForPayPal()
                    .then(function(data){

                        dialog.closeLoading();

                        if (data.shippingMethods.length === 1 && configService.getSupportedCountries().length === 1){
                            checkoutService.checkoutWithPayPal(data.shippingMethods[0]);
                        }
                        else {
                            dialog.open({
                                templateUrl: 'modules/cart/paypaloverlay.tpl.html',
                                controller: 'PayPalOverlayController',
                                backdropClick: true,
                                resolve: {
                                    checkoutInfo: function() {
                                        return data;
                                    }
                                }
                            });
                        }
                    });
            };

            return self;
        }
    ]);
