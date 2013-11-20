cc.define('cc.util.CategoryMap', function(){

    'use strict';

    var self = {};

    var map = {};

    self.addCategory = function(category){
        if (!map[category.urlId]){
            map[category.urlId] = category;
        }
        else{
            //if we had this category before but now have another one aliased with the same id
            //we have to look if this one has children. If it has children, than it should have
            //precedence

            if(category.children && category.children.length > 0){
                map[category.urlId] = category;
            }
        }
    };

    self.getCategory = function(urlId){
        return map[urlId];
    };

    return self;

});