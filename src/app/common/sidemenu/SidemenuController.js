'use strict';

angular.module('CouchCommerceApp')
    .controller('SidemenuController', function ($scope) {

        $scope.activeTab = 'categories';

        $scope.activateTab = function (tab) {
            $scope.activeTab = tab;
        };

    });
