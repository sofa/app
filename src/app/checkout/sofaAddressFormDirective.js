'use strict';

/**
 *
 */

angular
    .module('sofa.checkout')
    .directive('sofaAddressForm', ['localeService', function (localeService) {

        var instanceCount = 0;

        return {
            restrict: 'E',
            replace: true,
            scope: {
                addressModel: '=ngModel',
                addressOptions: '=',  // salutations, countries
                optionalFields: '=?', // company, phone, streetExtra, ...
                parcelStation: '=?'
            },
            require: ['ngModel'],
            templateUrl: 'checkout/sofa-address-form.tpl.html',
            link: function (scope, element, attrs, controllers) {

                scope.modelController = controllers[1];

                scope.instance = ++instanceCount;

                scope.ln = localeService.getTranslation('sofaAddressForm');
            }
        };
    }]);
