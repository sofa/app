'use strict';
/* global sofa */
/**
 * @name StateResolver
 * @namespace sofa.StateResolver
 *
 * @description
 * `StateResolver` is used within the`StateResolverService` to resolve a state
 * for a given url. It can easily be overwritten to swap out the resolve strategy.
 */
sofa.define('sofa.StateResolver', function ($q, $http, configService) {
    var STATES_ENDPOINT = configService.get('esEndpoint') + '_search?&size=1';

    return function (config) {

        // products and categories both have a "originFullUrl.category" property,
        // so we need to either find a match for the "originFullUrl.product"
        // or make sure any matching "originFullUrl.category" item is of type "category"
        var query = {
            query: {
                filtered: {
                    filter: {
                        or: [
                            {
                                term: {'routes.productUrl': config.url}
                            },
                            {
                                bool: {
                                    must: [
                                        {
                                            term: {'route': config.url}
                                        },
                                        {
                                            term: {'_type': 'category'}
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        };


        return $http({
            method: 'POST',
            url: STATES_ENDPOINT,
            data: query
        })
        .then(function (data) {
            var hits = data.data.hits.hits;
            var stateType, stateData;

            if (!data.data.hits.hits.length) {
                return $q.reject('can not resolve state');
            } else {
                stateType = hits[0]._type;
                stateData = hits[0]._source;
            }

            if (stateType === 'category') {
                return {
                    data: {
                        url: config.url,
                        stateName: 'categories',
                        stateParams: {
                            category: stateData.id
                        }
                    }
                };
            } else if (stateType === 'product') {
                return {
                    data: {
                        url: config.url,
                        stateName: 'product',
                        stateParams: {
                            category: stateData.categories[0].id,
                            productUrlKey: stateData.id
                        }
                    }
                };
            }
        });
    };
});
