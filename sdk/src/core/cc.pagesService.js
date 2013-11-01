cc.define('cc.PagesService', function($http, $q, configService){

    'use strict';

    var self = {};

    var RESOURCE_URL = configService.get('resourceUrl'),
        ABOUT_PAGES  = configService.get('aboutPages');

    self.getPage = function(id){
        return $http
                .get(RESOURCE_URL + id + '.html')
                .then(function(result){
                    if (result.data){

                        //we don't want to directly alter the page config, so we create a copy
                        var pageConfig = cc.Util.clone(self.getPageConfig(id));

                        pageConfig.content = result.data;

                        return pageConfig;
                    }
                });
    };

    self.getPageConfig = function(id){
        var page = ABOUT_PAGES.filter(function(page){
            return page.id === id;
        });

        return page.length > 0 && page[0];
    };

    return self;
});