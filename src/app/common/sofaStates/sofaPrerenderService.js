'use strict';

/* global document */

angular
    .module('sofa.states')
    .factory('preRenderService', function () {

        var self = {};

        self.setStatusMetaTag = function (status) {
            var meta = document.createElement('meta');
            meta.setAttribute('name', 'prerender-status-code');
            meta.setAttribute('content', status);
            document.getElementsByTagName('head')[0].appendChild(meta);
        };

        return self;
    });
