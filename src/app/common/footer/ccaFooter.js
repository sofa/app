'use strict';

//It might seem odd at first glance to have a cc-footer and cca-footer.
//However, if you think about it the cc-footer is a SDK UI component
//that does exactly one thing: it renders a footer with the footer items
//defined in the config.

//the <cca-footer> in contrast is application specific. It appends
//a "exit webapp" link which is a totally different concern and has
//nothing to do with the footer items.

angular.module('CouchCommerceApp').directive('ccaFooter', function (configService, dialog) {
    return {
        restrict: 'EA',
        replace: true,
        scope: true,
        templateUrl: 'common/footer/cca-footer.tpl.html',
        link: function ($scope) {

            $scope.showAppExitLink = configService.get('showAppExitLink', false);
            $scope.trustedShopsEnabled = configService.get('trustedShopsEnabled', false);

            $scope.exitWebApp = function () {
                window.location.href = configService.get('originalUrl') + configService.get('noRedirectSuffix');
            };

            $scope.showTrustedShopsCertificate = function () {
                dialog.open({
                    templateUrl: 'trustedshops/cc-trusted-shops.tpl.html',
                    controller: 'TrustedShopsController'
                });
            };
        }
    };
});
