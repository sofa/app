angular.module('sofa.checkout')
    .config(function ($stateProvider, screenIndexes) {

        'use strict';

        $stateProvider
            .state('checkout', {
                url: '/checkout',
                templateUrl: 'checkout/sofa-checkout.tpl.html',
                controller: 'CheckoutController',
                controllerAs: 'checkoutController',
                onEnter: function (metaService) {
                    metaService.set({
                        description: ''
                    });
                },
                screenIndex: screenIndexes.checkout
            });
    });
