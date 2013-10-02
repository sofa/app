

angular
    .module('CouchCommerceApp')
    .controller( 'MainController',
    [
        '$scope',
        'slideDirectionService',
        function MainController($scope) {

            'use strict';

            var ui = {
                header: 'modules/common/header/defaultheader.tpl.html',
                footer: ''
            };

            $scope.ui = ui;
        }
    ]);
