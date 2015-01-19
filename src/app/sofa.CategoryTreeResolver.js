'use strict';
/* global sofa */
sofa.CategoryTreeResolver = function ($http, $q) {

    return function () {
        return $q.when({
            data: {}
        });
    };
};
