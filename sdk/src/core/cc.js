'use strict';

var cc = {};

cc.namespace = function (namespaceString) {
    var parts = namespaceString.split('.'), parent = cc, i;

    //strip redundant leading global
    if (parts[0] === 'cc') {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i++) {
        //create a propery if it doesn't exist
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};