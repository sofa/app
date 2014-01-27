'use strict';
/* global document */

angular.module('CouchCommerceApp')
.factory('scrollPositionService', function ($rootScope, $location, $state, deviceService, requestAnimationFrame) {

    var self =  {},
        cache = {},
        usesNonBodyScroller = deviceService.hasOverflowSupport(),
        scroller = !usesNonBodyScroller ? document.body : null;

    $rootScope.$on('$locationChangeStart', function (evt, newUrl, oldUrl) {
        if (!scroller) {
            return;
        }
        cache[oldUrl] = {
            scrollOffset: scroller.scrollTop
        };
    });

    self.setActiveScroller = function (element) {
        if (usesNonBodyScroller) {
            scroller = element;
        }
    };

    $rootScope.$on('stateChangeService.stateChangeSuccess', function (evt, data) {

        var url = null,
            cachedValue = null;

        if (data.move === 'productToProducts' ||
            data.move === 'productsToCategory' ||
            data.move === 'categoryToParentCategory') {

            url = $location.absUrl();
            cachedValue = cache[url];
        }

        requestAnimationFrame(function () {
            scroller.scrollTop = cachedValue ? cachedValue.scrollOffset : 0;
        });
    });

    return self;
});
