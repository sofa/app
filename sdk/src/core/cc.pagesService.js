/**
 * @name PagesService
 * @namespace cc.PagesService
 *
 * @description
 * This service takes care of accessing static page data.
 */
cc.define('cc.PagesService', function($http, $q, configService){

    'use strict';

    var self = {};

    var RESOURCE_URL = configService.get('resourceUrl') + 'html/',
        ABOUT_PAGES  = configService.get('aboutPages');

    /**
     * @method getPage
     * @memberof cc.PagesService
     *
     * @description
     * Returns a page object by a given id.
     *
     * @param {int} id Page id.
     * @return {object} Page object.
     */
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

    /**
     * @method getPageConfig
     * @memberof cc.PagesService
     * 
     * @description
     * Returns a page configuration object by a given page id.
     *
     * @param {int} id Page id.
     * @return {object} Page configuration
     */
    self.getPageConfig = function(id){
        var page = ABOUT_PAGES.filter(function(page){
            return page.id === id;
        });

        return page.length > 0 && page[0];
    };

    return self;
});
