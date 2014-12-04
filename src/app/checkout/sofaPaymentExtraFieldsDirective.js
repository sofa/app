'use strict';

/**
 *
 */

angular
    .module('sofa.checkout')
    .directive('sofaPaymentExtraFields', ['localeService', function (localeService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                extraFields: '=',
                model: '=ngModel'
            },
            require: ['ngModel'],
            templateUrl: 'checkout/sofa-payment-extra-fields.tpl.html',
            link: function (scope, element, attrs, controllers) {
                scope.modelController = controllers[1];

                scope.ln = localeService.getTranslation('sofaPaymentExtraFields');

                scope.$watch('extraFields', function (nv) {
                    if (nv && nv.length) {
                        nv.forEach(function (fieldData) {
                            fieldData.code = fieldData.name;
                        });
                    }
                });
            }
        };
    }]);
