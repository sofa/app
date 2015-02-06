'use strict';

/* global sofa */

angular
    .module('CouchCommerceApp')
    .factory('productQueryBuilderService', function (elasticSearchService, hashService) {

        // Properties from the category.filters object we want to copy over to the filter config
        // (only those we need for the query)
        var FILTER_PROPERTIES  = ['type', 'nested', 'indexPath', 'limits'];

        var self  = this;
        var cache = {};

        self.setCacheEntity = function (path, name, value) {
            var key = hashService.hashString(path);
            cache[key] = cache[key] || {};
            cache[key][name] = value;
        };

        self.getCacheValue = function (path, entityName) {
            var key = hashService.hashString(path);
            return cache[key] && cache[key][entityName];
        };

        self.getFilterConfigByName = function (path, filterName) {
            var filterData = self.getCacheValue(path, 'categoryFilterAttributes');
            var config     = self.getCacheValue(path, 'filterConfig_' + filterName);

            if (config) {
                return config;
            } else {
                config = {};
            }

            angular.forEach(filterData[filterName].config, function (value, name) {
                if (FILTER_PROPERTIES.indexOf(name) > -1) {
                    config[name] = value;
                }
            });

            self.setCacheEntity('filterConfig_' + filterName, config);

            return config;
        };

        self.getFilterConfigByObject = function (filterObject) {
            var config = {};

            angular.forEach(filterObject, function (value, name) {
                if (FILTER_PROPERTIES.indexOf(name) > -1) {
                    config[name] = value;
                }
            });

            return config;
        };

        self.getActiveFilter = function (path, filter) {
            var constraints = self.getCacheValue(path, 'constraintFilter');
            var activeFilter = {};

            angular.forEach(filter, function (filterValue, filterName) {
                if (!filterValue || (angular.isArray(filterValue) && !filterValue.length)) {
                    return;
                }
                activeFilter[filterName] = {
                    options: filterValue,
                    config: self.getFilterConfigByName(path, filterName)
                };
            });

            if (constraints && constraints.length) {
                angular.forEach(constraints, function (constraint, i) {
                    activeFilter['constraint_' + i] = {
                        options: constraint.value,
                        config: self.getFilterConfigByObject(constraint)
                    };
                });
            }

            return activeFilter;
        };

        self.getFullFilterQuery = function (filterArray) {
            return {
                query: {
                    filtered: {
                        filter: {
                            bool: {
                                must: filterArray
                            }
                        }
                    }
                }
            };
        };

        self.getSortingQuery = function (sortingObj) {
            var obj = {};

            obj[sortingObj.indexPath] = {};
            obj[sortingObj.indexPath].mode  = sortingObj.mode;
            obj[sortingObj.indexPath].order = sortingObj.order;

            return obj;
        };

        self.getSortingConstraintsQuery = function (constraints) {
            return constraints.map(function (constraint) {
                return self.getSortingQuery(constraint);
            });
        };

        self.buildQuery = function (path) {
            var query;
            var sorting = self.getCacheValue(path, 'sorting');
            var sortingConstraints = self.getCacheValue(path, 'constraintSorting');
            var filter  = self.getCacheValue(path, 'filter');
            var activeFilter = self.getActiveFilter(path, filter);

            var must = [];

            angular.forEach(activeFilter, function (data) {
                var esFilter = {};
                var innerFilter;
                var type = data.config.type;
                var indexField = data.config.indexPath;
                var options = data.options;

                if (type === 'multiple') {
                    // bool with "should"
                    innerFilter = elasticSearchService.getBoolQuery('should', indexField, options);
                } else if (type === 'single') {
                    // term
                    innerFilter = elasticSearchService.getTermQuery(indexField, options);
                } else if (type === 'range') {
                    // range with min/max
                    innerFilter = elasticSearchService.getRangeQuery(indexField, options.min, options.max);
                }

                if (data.config.nested) {
                    esFilter.nested = {};
                    esFilter.nested.path = data.config.nested;
                    esFilter.nested.filter = innerFilter;
                } else {
                    esFilter = innerFilter;
                }

                must.push(esFilter);
            });

            query = self.getFullFilterQuery(must);

            if (sorting && !sofa.Util.isEmptyObject(sorting) || sortingConstraints && sortingConstraints.length) {
                query.sort = [];

                if (!sofa.Util.isEmptyObject(sorting)) {
                    query.sort.push(self.getSortingQuery(sorting));
                }

                // FIXME: This is actually the wrong order. A sorting constraint should be the first sorting
                // parameter. Moreover should it be filled with a boolean property since everything
                // else would break the intended behaviour.
                if (sortingConstraints && sortingConstraints.length) {
                    query.sort = query.sort.concat(self.getSortingConstraintsQuery(sortingConstraints));
                }

            }

            return query;
        };

        return self;
    });
