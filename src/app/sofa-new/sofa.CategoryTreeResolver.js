// 'use strict';
// /* global sofa */
// sofa.CategoryTreeResolver = function ($http, $q, configService) {

//     var ENDPOINT = configService.get('esEndpoint') + 'category/_search';

//     var getCategoriesFromLevel = function (all, level) {
//         return all.filter(function (category) {
//             return category.level === level;
//         }); 
//     };

//     var distributeToParents = function(levelCategories, parents) {
//         for (var i = 0; i < parents.length; i++) {
//             var currentParent = parents[i];
//             var categoriesForParent = filterByParent(levelCategories, currentParent.id);
//             currentParent.children = categoriesForParent;
//         };
//     };

//     var filterByParent = function (all, parentId) {
//         return all.filter(function (category) {
//             return category.parentId === parentId;
//         });
//     };

//     var getRootCategoryId = function (categories) {
//         var firstLevelCategories = categories.filter( function (category) {
//             return category.level === 2;
//         });

//         return firstLevelCategories[0].parentId;
//     };

//     return function () {

//         return $http({
//             method: 'POST',
//             url: ENDPOINT,
//             data: {
//                 size: 100000,
//                 query: {
//                     filtered: {
//                         filter: {
//                             term: {
//                                 active: true
//                             }
//                         }
//                     }
//                 }
//             }
//         })
//         .then(function (result) {

//             var hits = result.data.hits.hits,
//                 plainHits = hits.map(function(hit) { 
//                     hit._source.label = hit._source.name;
//                     hit._source.urlId = hit._source.id;
//                     return hit._source 
//                 }),
//                 rootCategory = {
//                     label: '',
//                     id: getRootCategoryId(plainHits),
//                     originFullUrl: '/',
//                     children: []
//                 },
//                 currentLevel = 2,
//                 currentLevelCategories = getCategoriesFromLevel(plainHits, currentLevel),
//                 parents = [rootCategory];

//             while (currentLevelCategories.length > 0) {
//                 distributeToParents(currentLevelCategories, parents);

//                 currentLevel++;
//                 parents = currentLevelCategories;
//                 currentLevelCategories = getCategoriesFromLevel(plainHits, currentLevel);
//             }

//             return { data: rootCategory };
//         });
//     };
// };
