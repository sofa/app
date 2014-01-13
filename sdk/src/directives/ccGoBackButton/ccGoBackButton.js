angular.module('sdk.directives.ccGoBackButton', ['src/directives/ccGoBackButton/cc-go-back-button.tpl.html']);

angular.module('sdk.directives.ccGoBackButton')
    .directive('ccGoBackButton', ['$window', function($window) {

        'use strict';

        return {
            restrict: 'EA',
            templateUrl: 'src/directives/ccGoBackButton/cc-go-back-button.tpl.html',
            scope: {},
            replace: true,
            link: function($scope, element, attributes, controller){

                $scope.goBack = function(){
                    $window.history.back();
                };
            }
        };
    }]);