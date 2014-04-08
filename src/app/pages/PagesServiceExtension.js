'use strict';

angular.module('CouchCommerceApp')
       .factory('pagesServiceExtension', function PagesServiceExtension() {

    // the whole purpose of this service is to reuse the PagesController in
    // scenarios where pages are not tied to URLs (read: ContextViewService).
    // For instance, we open terms of service etc from the summary page via
    // the ContextViewService.

    // This allows us to set the pageId programatically and use this if no
    // pageId is provided via the URL.
    return {
        currentPageId: null
    };
});
