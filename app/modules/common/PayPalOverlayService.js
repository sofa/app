angular
    .module('CouchCommerceApp')
    .factory('payPalOverlayService',['$q', 'dialog', 'checkoutService', 'configService', function ($q, dialog, checkoutService, configService) {

            'use strict';

            var self = {};

            self.startPayPalCheckout = function(){

                var deferred = $q.defer();

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
                                templateUrl: 'modules/cart/cc-paypal-overlay.tpl.html',
                                controller: 'PayPalOverlayController',
                                backdropClick: true,
                                resolve: {
                                    checkoutInfo: function() {
                                        return data;
                                    }
                                }
                            })
                            .result
                            //todo change this to catch() once we update angular
                            .then(null,function(result){
                                deferred.reject(result);
                            });
                        }
                    });

                return deferred.promise;
            };

            return self;
        }
    ]);
