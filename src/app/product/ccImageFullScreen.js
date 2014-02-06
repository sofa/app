'use strict';

angular
    .module('CouchCommerceApp')
    .directive('ccImageFullScreen', function (deviceService, ccImageFullScreenService) {

            return {
                restrict: 'A',
                link: function (scope, $element) {

                    if (!ccImageFullScreenService.enabled) {
                        return;
                    }

                    $element.bind('click', function () {
                        ccImageFullScreenService.toFullScreen($element);
                    });
                }
            };
        }
    );