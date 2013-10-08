
//It might seem odd at first glance to have a cc-footer and cca-footer.
//However, if you think about it the cc-footer is a SDK UI component
//that does exactly one thing: it renders a footer with the footer items
//defined in the config.

//the <cca-footer> in contrast is application specific. It appends
//a "exit webapp" link which is a totally different concern and has
//nothing to do with the footer items.

angular
    .module('CouchCommerceApp')
    .directive('ccaFooter', ['configService', function(configService) {

        'use strict';

        return {
            restrict: 'EA',
            replace: true,
            scope: true,
            templateUrl: 'modules/common/footer/ccaFooter.tpl.html',
            link: function($scope, element, attrs){

                $scope.showAppExitLink = configService.get('showAppExitLink', false);

                $scope.exitWebApp = function(){
                    window.location.href = configService.get('originalUrl') + configService.get('noRedirectSuffix');
                };
            }
        };
    }]);