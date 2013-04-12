'use strict'

angular
    .module('CouchCommerceApp')
    .controller( 'MainController',
    [
        '$scope',
        function CategoryController($scope) {

            var ui = {
                header: 'views/defaultheader.html',
                footer: ''
            };

            $scope.ui = ui;;
        }
    ]);
