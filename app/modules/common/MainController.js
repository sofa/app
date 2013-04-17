'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'MainController',
    [
        '$scope',
        function MainController($scope) {

            var ui = {
                header: 'modules/common/header/defaultheader.tpl.html',
                footer: ''
            };

            $scope.ui = ui;;
        }
    ]);
