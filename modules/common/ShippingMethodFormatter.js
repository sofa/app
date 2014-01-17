angular
    .module('CouchCommerceApp')
    .factory('shippingMethodFormatter',['$filter', function ($filter) {

            'use strict';

            return function(shippingMethod){

                if (!shippingMethod || !shippingMethod.title){
                    return '';
                }

                return shippingMethod.title + ' (' + $filter('currency')(shippingMethod.price) + ')';
            };
        }
    ]);
