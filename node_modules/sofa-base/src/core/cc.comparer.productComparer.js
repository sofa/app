/**
 * @name ProductComparer
 * @namespace cc.comparer.ProductComparer
 *
 * @description
 *
 */
cc.define('cc.comparer.ProductComparer', function(tree, childNodeProperty){

    'use strict';

    return function(a, b){

        //either compare products by object identity, urlKey identity or id identity
        return  a === b || 
                a.urlKey && b.urlKey && a.urlKey === b.urlKey ||
                a.id && b.id && a.id === b.id;
    };
});
