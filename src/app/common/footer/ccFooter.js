'use strict';

angular.module('CouchCommerceApp')
    .directive('ccFooter', function (configService, contextViewService) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'common/footer/cc-footer.tpl.html',
            link: function ($scope) {

                $scope.config = {
                    showAppExitLink: configService.get('showAppExitLink'),
                    trustedShopsEnabled: configService.get('trustedShopsEnabled')
                };

                $scope.exitWebApp = function () {
                    window.location.href = configService.get('originalUrl') + configService.get('noRedirectSuffix');
                };

                $scope.showTrustedShopsCertificate = function () {
                    contextViewService.toggleView('trustedshops/cc-trusted-shops.tpl.html', 'TrustedShopsController');
                };
            }
        };
    });
