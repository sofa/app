angular.module('sdk.directives.ccGoUpButton', ['src/directives/ccGoUpButton/cc-go-up-button.tpl.html']);

angular.module('sdk.directives.ccGoUpButton')
    .directive('ccGoUpButton', ['navigationService', function(navigationService) {

        'use strict';

        return {
            restrict: 'EA',
            templateUrl: 'src/directives/ccGoUpButton/cc-go-up-button.tpl.html',
            scope: {},
            replace: true,
            link: function($scope, element, attributes, controller){

                $scope.goUp = function(){
                    navigationService.goUp();
                };
            }
        };
    }]);