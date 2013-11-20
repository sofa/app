//We only use the TreeIterator to built a HashMap for fast lookups.
//So it doesn't really care if we use a depth first or a breadth first approach.
cc.define('cc.util.TreeIterator', function(tree, childNodeProperty){

    'use strict';

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
    };
});