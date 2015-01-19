'use strict';
/* global sofa */
/**
 * @name SingleProductResolver
 * @namespace sofa.SingleProductResolver
 *
 * @description
 * `SingleProductResolver` is used within the`CouchService` 
 * to resolve a singke product for a given categoryUrlId + productUrlKey combination. 
 * It can easily be overwritten to swap out the resolve strategy.
 */
sofa.define('sofa.SingleProductResolver', function (couchService, $http, $q, configService) {

    var url = configService.get('esEndpoint') + 'product/_search?size=1';

    return function (categoryUrlId, productUrlKey) {
        return $http({
            method: 'POST',
            url: url,
            data: {
                'query': {
                    'filtered': {
                        'filter': {
                            'term': {
                                'id': productUrlKey
                            }
                        }
                    }
                }
            }
        })
        .then(function (data) {
            return data.data.hits.hits.length > 0 ? data.data.hits.hits[0] : null;
        });
    };
});
