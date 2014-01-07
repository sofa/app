'use strict';

angular.module('chayns', [])
    .run(function() {
        var params = {};

        if (location.search) {
            var parts = location.search.substring(1).split('&');

            for (var i = 0; i < parts.length; i++) {
                var nv = parts[i].split('=');
                if (!nv[0]) continue;
                params[nv[0]] = nv[1] || true;
            }
        }

        if ( params.chayns ) {
            setTimeout(function() {
                location.href = "chayns://chaynsCall(0,false)";
            }, 1);
        }
    });