'use strict';

angular.module('CouchCommerceApp')
.factory('payPalOverlayService', function ($q, dialog, checkoutService, configService, trackingService) {

    var self = {};

    self.startPayPalCheckout = function () {

        trackingService.trackEvent({
            category: 'pageView',
            label: '/checkout/paypal'
        });

        var deferred = $q.defer();

        dialog.loading();

        checkoutService
            .getShippingMethodsForPayPal()
            .then(function (data) {

                dialog.closeLoading();

                if (data.shippingMethods.length === 1 && configService.getSupportedCountries().length === 1) {
                    checkoutService.checkoutWithPayPal(data.shippingMethods[0], configService.getDefaultCountry());
                } else {
                    dialog.open({
                        templateUrl: 'cart/cc-paypal-overlay.tpl.html',
                        controller: 'PayPalOverlayController',
                        backdropClick: true,
                        resolve: {
                            checkoutInfo: function () {
                                return data;
                            }
                        },
                        windowClass: 'cc-bootstrap-modal'
                    })
                    .result
                    //todo change this to catch() once we update angular
                    .then(null, function (result) {
                        deferred.reject(result);
                    });
                }
            });
        return deferred.promise;
    };
    return self;
});
