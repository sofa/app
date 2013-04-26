'use strict';

//This code can probably be improved.
//it's probably unefficient since it doesn't screen level by level
//instead it goes deep down all levels of each categories and then hops
//over to the next category.
cc.define('cc.util.TreeIterator', function(tree, childNodeProperty){
    var me = this,
        continueIteration = true;

    me.iterateChildren = function(fn){
        continueIteration = true;
        return _iterateChildren(tree, fn);
    };

    var _iterateChildren = function(rootCategory, fn, parent){
        continueIteration = fn(rootCategory, parent);

        if (rootCategory[childNodeProperty] && continueIteration !== false){
            rootCategory[childNodeProperty].forEach(function(category){
                if (continueIteration !== false){
                    _iterateChildren(category, fn, rootCategory);
                }
            });
        }
    }
});