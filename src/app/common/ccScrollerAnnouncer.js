'use strict';

angular.module('CouchCommerceApp').directive('ccScrollerAnnouncer', function (scrollPositionService) {
    return {
        restrict: 'A',
        link: function (scope, $element) {
            scrollPositionService.setActiveScroller($element[0]);
        }
    };
});
