angular
    .module('sofa.elasticSearchService', [])
    .factory('elasticSearchService', [function () {

        'use strict';

        return new sofa.ElasticSearchService();
    }]);
