'use strict';

sofa.define('sofa.ElasticSearchService', function () {
    var self = {};

    /**
     * Builds an elasticSearch term query object and returns it.
     *
     * @param field Name of the elasticSearch field to be searched in
     * @param term The term to search for
     * @returns {object} A term query object
     */
    self.getTermQuery = function (field, term) {
        var query = {};

        query.term = {};
        query.term[field] = term;

        return query;
    };

    /**
     * Builds an elasticSearch bool query object and returns it.
     * WARNING: Currently only supports term queries inside.
     *
     * @param type Type of bool query ['must', 'should', 'must_not']
     * @param field
     * @param terms
     * @returns {object} A bool query object
     */
    // TODO: just works with term queries inside. This is probably insufficient...
    self.getBoolQuery = function (type, field, terms) {
        var query = {};
        var termArray = [];

        terms.forEach(function (term) {
            termArray.push(self.getTermQuery(field, term));
        });

        query.bool = {
            must:   type === 'must' ? termArray : [],
            should: type === 'should' ? termArray : [],
            must_not: type === 'must_not' ? termArray: []
        };

        return query;
    };

    self.getOrQuery = function (queries) {
        var query = {};
        var orArray = [];

        queries.forEach(function (query) {
            orArray.push(query);
        });

        query.or = orArray;

        return query;
    };

    /**
     * Builds an elasticSearch range query object and returns it.
     *
     * @param field elasticSearch field to apply the range to.
     * @param min Min value for the range
     * @param max Max value for the range
     * @returns {object} A range query object
     */
    self.getRangeQuery = function (field, min, max) {
        var query = {};

        query.range = {};
        query.range[field] = {
            gte: min,
            lte: max
        };

        return query;
    };

    return self;
});
