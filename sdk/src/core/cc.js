'use strict';

var cc = {};

    /**
     * Creates the given namespace within the cc namespace.
     * The methor returns an object that contains meta data
     *
     * - targetParent (object)
     * - targetName (string)
     * - bind (function) : a convenient function to bind
                           a value to the namespace
     * 
     * Options:
     * 
     *   - `namespaceString` e.g. 'cc.services.FooService'
     * 
     */

cc.namespace = function (namespaceString) {
    var parts = namespaceString.split('.'), parent = cc, i;

    //strip redundant leading global
    if (parts[0] === 'cc') {
        parts = parts.slice(1);
    }

    var targetParent = cc,
        targetName;

    for (i = 0; i < parts.length; i++) {
        //create a propery if it doesn't exist
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }

        if (i === parts.length - 2){
            targetParent = parent[parts[i]]
        }

        targetName = parts[i];

        parent = parent[parts[i]];
    }
    return {
        targetParent: targetParent,
        targetName: targetName,
        bind: function(target){
            targetParent[targetName] = target;
        }
    };
};

cc.define = function(namespace, fn){
    cc.namespace(namespace)
      .bind(fn);
};

