'use strict';

/* global sofa */

angular
    .module('sofa.product')
    .controller('ProductController', function ProductController($rootScope, $scope, $filter, configService, basketService, navigationService, product, category, dialog, $sce, categoryTreeViewRemote, snapRemote, productService, titleService, imagePreloadService) {

        var self = this;

        if (!product || !category) {
            return;
        }

        // TODO: consider using device service to get image sizes which are optimized for the very view port
        var IMAGE_MAX_WIDTH = $rootScope.isTabletSize ? 500 : 300,
            IMAGE_MAX_HEIGHT = IMAGE_MAX_WIDTH,
            ZOOM_IMAGE_MAX_WIDTH = $rootScope.isTabletSize ? 2000 : 1200,
            ZOOM_IMAGE_MAX_HEIGHT = ZOOM_IMAGE_MAX_WIDTH;

        titleService.setTitleWithSuffix(product.name);
        categoryTreeViewRemote.setActive(category);

        self.product = product;
        // yep, that's a hack to trick our sofa-go-back-control. Seems reasonable though.
        self.upCategory = { parent: category };
        self.images = product.getAllImages();

        self.navigateToShippingCostsPage = function () {
            navigationService.navigateToShippingCostsPage();
        };

        self.hasInfo = function () {
            return product.description || product.hasAttributes();
        };

        self.getTrustedHtml = function (htmlStr) {
            return $sce.trustAsHtml(htmlStr);
        };

        self.getBasePriceInfo = function () {
            return productService.getBasePriceInfo(product, self.variants.selectedVariant);
        };

        var isVariantSelected = function (product) {
            if (product.hasVariants() && !self.variants.selectedVariant) {

                var missingProperties = '';

                for (var key in self.variants.selectedProperties) {
                    if (!self.variants.selectedProperties[key]) {
                        missingProperties += key + ', ';
                    }
                }

                dialog
                    .messageBox($scope.ln.btnWarning, cc.Lang.missingVariantAttributeText + missingProperties, [
                        {result: 'ok', label: $scope.ln.btnOk}
                    ]);

                return false;
            }
            return true;
        };

        self.addToBasket = function (product) {
            if (!isVariantSelected(product)) {
                return;
            }

            basketService.addItem(product, 1, self.variants.selectedVariant);
            snapRemote.open('right');
        };

        self.variants = {
            selectedVariant: null,
            selectedProperties: null
        };

        var imagePreloaderOptions = [{
                type: 'image',
                maxwidth: IMAGE_MAX_WIDTH,
                maxheight: IMAGE_MAX_HEIGHT,
                quality: 80
            }, {
                type: 'zoomImage',
                maxwidth: ZOOM_IMAGE_MAX_WIDTH,
                maxheight: ZOOM_IMAGE_MAX_HEIGHT,
                quality: 80
            }
        ];

        self.productImages = imagePreloadService.getResizedProductImages(self.images, imagePreloaderOptions);
        self.selectedImage = self.productImages[0].image;

        var getFormattedShippingCost = function (shippingCost) {
            return $filter('stringReplace')($scope.ln.shippingCosts, $filter('currency')(shippingCost));
        };

        var shippingCost = configService.get('shippingCost');
        self.shippingCost = sofa.Util.isNotNullNorUndefined(shippingCost) ? getFormattedShippingCost(shippingCost) : null;

        //keep that in for debugging variants
        // $scope.product.variants = [

        // {
        //     variantID: 1,
        //     stock: 1,
        //     properties: {
        //         color: 'red',
        //         size: 'XL',
        //         zipside: 'left'
        //     }
        // },
        // {
        //     variantID: 2,
        //     stock: 1,
        //     properties: {
        //         color: 'green',
        //         size: 'XL',
        //         zipside: 'right'
        //     }
        // },
        // {
        //     variantID: 3,
        //     stock: 1,
        //     properties: {
        //         color: 'green',
        //         size: 'L',
        //         zipside: 'left'
        //     }
        // }

        // ];



        $scope.shared = {};
        $scope.shared.slideIndex = 0;

        // For the full page view
        var originalSliderScope,
            cloneSliderScope;

        $scope.setOriginalState = function (fullPageViewScope) {
            originalSliderScope = originalSliderScope ||
                angular.element(fullPageViewScope.originalElement[0].querySelector('.sofa-touch-slider')).scope();

            originalSliderScope.setToIndex($scope.shared.slideIndex);
        };

        $scope.setCloneState = function (fullPageViewScope) {
            cloneSliderScope = cloneSliderScope ||
                angular.element(fullPageViewScope.cloneElement[0].querySelector('.sofa-touch-slider')).scope();

            cloneSliderScope.reset();
            cloneSliderScope.setToIndex($scope.shared.slideIndex);
        };

        $scope.$watch(function () { 
            return self.variants.selectedVariant; 
        }, function (variant) {
            if (variant && variant.images && variant.images[0]) {
                self.images = variant.images;
                self.productImages = imagePreloadService.getResizedProductImages(self.images, imagePreloaderOptions);
                self.selectedImage = self.productImages[0].image;
            }
        });

    });
