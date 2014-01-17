
angular
    .module('CouchCommerceApp')
    .directive('ccScrollerAnnouncer', ['scrollPositionService', function(scrollPositionService) {

        'use strict';

        return {
            restrict: 'A',
            link: function(scope, $element, attrs){
                scrollPositionService.setActiveScroller($element[0]);
            }
        };
    }]);