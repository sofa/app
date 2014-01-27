'use strict';
/* global document */

angular.module('CouchCommerceApp').factory('viewClassService', function ($rootScope, screenIndexes) {

    var self = {},
        $html = angular.element(document.getElementsByTagName('html')[0]),
        VIEW_CLASS_PREFIX = 'cc-view-';

    $rootScope.$on('stateChangeService.stateChangeSuccess', function (evt, data) {
        var previousViewName = screenIndexes[data.previousIndex],
            currentViewName = screenIndexes[data.currentIndex];

        $html.removeClass(VIEW_CLASS_PREFIX + previousViewName);
        $html.addClass(VIEW_CLASS_PREFIX + currentViewName);
    });

    return self;
});
