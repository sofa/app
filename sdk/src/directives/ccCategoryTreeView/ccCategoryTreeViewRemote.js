angular.module('sdk.directives.ccCategoryTreeView')
    .factory('categoryTreeViewRemote', [function() {

        'use strict';

        var self = {};

        self.toggleVisibility = function(item){
            asurePrivateStore(item);
            item._categoryTreeView.isVisible = !item._categoryTreeView.isVisible;
        };

        self.setItemLevel = function(item, level){
            asurePrivateStore(item);
            item._categoryTreeView.level = level;
        };

        var asurePrivateStore = function(item){
            if (!item._categoryTreeView){
                item._categoryTreeView = { isVisible: false };
            }
        };

        return self;
    }]);