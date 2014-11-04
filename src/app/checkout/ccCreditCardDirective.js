'use strict';

// Simple directive to make CC input less painful
// it simply add spaces between groups of numbers of 4
angular.module('CouchCommerceApp').directive('ccCreditCard', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function (newValue) {
                if (newValue) {
                    newValue = newValue.replace(/\s+/g, '');
                    var split = newValue.match(/.{1,4}/g);
                    var newVal = split.join(' ');
                    // Is this the way to go? Is there a way
                    // for me the alter the ngModel directly here?
                    elem[0].value = newVal;
                }
            });
        }
    };
});
