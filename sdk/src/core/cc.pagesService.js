cc.define('cc.PagesService', function($http, $q){

    'use strict';

    var self = {};

    self.getPage = function(id){
        return $http
                .get(cc.Config.resourceUrl + id + '.html')
                .then(function(result){
                    if (result.data){

                        //we don't want to directly alter the page config, so we create a copy
                        var pageConfig = cc.Util.deepExtend({}, self.getPageConfig(id));

                        pageConfig.content = result.data;

                        return pageConfig;
                    }
                });
    };

    self.getPageConfig = function(id){
        var page = cc.Config.aboutPages.filter(function(page){
            return page.id === id;
        });

        return page.length > 0 && page[0];
    };

    return self;
});