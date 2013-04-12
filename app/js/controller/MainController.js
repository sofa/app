'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'MainController',
    [
        '$scope',
        function MainController($scope) {

            var ui = {
                header: 'views/defaultheader.html',
                footer: ''
            };

            $scope.ui = ui;;
        }
    ]);
