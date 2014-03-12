'use strict';

angular.module('CouchCommerceApp')
.factory('selectionService', function () {

    var self = {},
        HIGHLIGHT_CLS = 'cc-highlight--in',
        containerMap = {};

    var assertContainer = function (containerKey) {
        if (!containerMap[containerKey]) {
            containerMap[containerKey] = {
                $target: null
            };
        }
        return containerMap[containerKey];
    };

    //ATTENTION: holding references to DOM nodes can create serious
    //memory leaks. We need to investigate further if we need to
    //remove a target on scope's $destroy events

    //ATTENTION: This whole approach of doing the DOM manipulation directly here
    //is a bit anti-angular. However, it's much faster to do it that way than to
    //have a binding on each row that constantly needs to be checked. We might revalidate
    //the approach though.
    self.select = function (containerKey, $target) {
        var container = assertContainer(containerKey);

        if (container.$target) {
            container.$target.removeClass(HIGHLIGHT_CLS);
        }
        $target.addClass(HIGHLIGHT_CLS);
        container.$target = $target;
    };
    return self;
});
