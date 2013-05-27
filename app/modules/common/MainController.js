'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'MainController',
    [
        '$scope',
        'slideDirectionService',
        function MainController($scope, slideDirectionService) {

            var ui = {
                header: 'modules/common/header/defaultheader.tpl.html',
                footer: ''
            };

            $scope.ui = ui;
        }
    ]);
