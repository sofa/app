'use strict';

angular
    .module('sofa.products')
    .controller('ProductsController', function ProductsController($scope, $stateParams, navigationService, backStepHighlightService, category, selectionService, categoryTreeViewRemote, productService, titleService, $location, deviceService, couchService, configService, productQueryBuilderService) {

        var self = this;

        if (category) {
            categoryTreeViewRemote.setActive(category);
            titleService.setTitleWithSuffix(category.label);
            self.category = category;
        }

        self.headline = category && category.label;
        self.query = {};
        self.query.model = {};

        self.sortModel = {
            sortBy: null,
            sortTypes: [
                {
                    title: $scope.ln.sortPriceAsc,
                    key: 'price',
                    reverse: false
                },
                {
                    title: $scope.ln.sortPriceDesc,
                    key: 'price',
                    reverse: true
                }
            ]
        };

        self.goToProduct = function (product, $event) {
            $event.preventDefault();
            selectionService.select('products_' + $stateParams.categoryId, angular.element($event.currentTarget));
            navigationService.navigateToUrl(product.getUrl(category.getUrl()));
        };

        self.getBasePriceInfo = function (product) {
            return productService.getBasePriceInfo(product);
        };

        self.isHighlighted = function (product) {
            return backStepHighlightService.isHighlighted(product);
        };

        ////////////

        var SHOW_OUT_OF_STOCK = configService.get('showOutOfStock', false);
        var configValue = configService.get('defaultPageSize', [10, 12]);
        var DEFAULT_PAGE_SIZE = configValue[deviceService.isTabletSize() ? 1 : 0];
        var pageConfig;

        var currentLocation = $location.path();

        var getPagingInfo = function (total, collectionCount, size, start) {
            var from = Math.min(1, total),
                to   = start + size;

            if (collectionCount > size) {
                to = Math.min(collectionCount, total);
            }

            if (to > total) {
                to = total;
            }

            self.hasMoreItems = to < total;

            return {
                from: from,
                to: to,
                total: total,
                size: DEFAULT_PAGE_SIZE
            };
        };

        var setPageConfig = function (from) {
            pageConfig = {
                from: from,
                size: DEFAULT_PAGE_SIZE
            };
        };

        // All products that are loaded into the view
        self.products = [];
        // Initial page load
        self.pageLoading = true;
        // re-loading of products
        self.loading = false;
        // Do we need to display the "more items" button?
        self.hasMoreItems = true;
        // Filters are hidden by default
//        self.showFilter = false;

        // Invisible filter which goes to the queryBuilder
        var filterConstraints = [
            {
                type: 'single',
                nested: 'routes',
                indexPath: 'routes.categoryId',
                value: category.id
            }
        ];

        if (!SHOW_OUT_OF_STOCK) {
            filterConstraints.push({
                type: 'single',
                indexPath: 'isInStock',
                value: true
            });
        }

        // This is for displaying info about the currently loaded products
        self.productPaging = {
            from: 0,
            to: 0,
            total: 0,
            size: DEFAULT_PAGE_SIZE
        };

        // If no sorting option is selected, use this
        var sortingDefault = {
//            indexPath: 'seasonRank',
//            order: 'desc',
//            mode: 'max'
        };


        self.loadPage = function (resetItems, next) {
            if (resetItems) {
                setPageConfig(0);
            }

            if (next) {
                setPageConfig(pageConfig.from + pageConfig.size);
            }

            var config = {
                size:  pageConfig.size,
                from:  pageConfig.from,
                sort:  self.query.model.sort,
                query: self.query.model.query
            };

            self.loading = true;

            couchService
                .getProductsByRawOptions(config)
                .then(function (result) {
                    self.pageLoading = false;
                    self.loading = false;

                    if (resetItems) {
                        self.products = [];
                    }

                    // For the initial set, this is directly operating on the cache.
                    // After we sort, it's operating on a new array apart from the cache
                    // We could easily change that to share the same semantics, should we?
                    if (self.products.length) {
                        self.products.push.apply(self.products, result.items);
                    } else {
                        self.products = result.items;
                    }

                    self.productPaging = getPagingInfo(result.meta.total, self.products.length, result.meta.size, result.meta.from);

                }, function () {
                    self.pageLoading = false;
                    self.loading = false;
                });
        };

        productQueryBuilderService.setCacheEntity(currentLocation, 'constraintFilter', filterConstraints);
//        productQueryBuilderService.setCacheEntity(currentLocation, 'sorting', sortingDefault);
        self.query.model = productQueryBuilderService.buildQuery(currentLocation);

        self.loadPage(true);

        self.loadMore = function () {
            self.loadPage(false, true);
        };





    });
