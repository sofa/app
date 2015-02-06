'use strict';

/* global sofa */

angular
    .module('sofa.product')
    .controller('ProductController', function ProductController($rootScope, $scope, $filter, configService, basketService, navigationService, product, category, $sce, categoryTreeViewRemote, snapRemote, productService, titleService, imagePreloadService) {

        var self = this;

        if (!product || !category) {
            return;
        }

        console.log(product, category);

        // TODO: consider using device service to get image sizes which are optimized for the very view port
        var IMAGE_MAX_WIDTH = $rootScope.isTabletSize ? 500 : 300,
            IMAGE_MAX_HEIGHT = IMAGE_MAX_WIDTH,
            ZOOM_IMAGE_MAX_WIDTH = $rootScope.isTabletSize ? 2000 : 1200,
            ZOOM_IMAGE_MAX_HEIGHT = ZOOM_IMAGE_MAX_WIDTH;

        var isVariantSelected = function () {
            return product.hasVariants() ? self.variants.selectedVariant : true;
//            if (product.hasVariants() && !self.variants.selectedVariant) {

                // TODO: add a smarter warning in another place
//                var missingProperties = '';
//
//                for (var key in self.variants.selectedProperties) {
//                    if (!self.variants.selectedProperties[key]) {
//                        missingProperties += key + ', ';
//                    }
//                }
//
//                dialog
//                    .messageBox($scope.ln.btnWarning, cc.Lang.missingVariantAttributeText + missingProperties, [
//                        {result: 'ok', label: $scope.ln.btnOk}
//                    ]);

//                return false;
//            }
//            return true;
        };

        titleService.setTitleWithSuffix(product.name);
        categoryTreeViewRemote.setActive(category);

        self.product = product;
        // yep, that's a hack to trick our sofa-go-back-control. Seems reasonable though.
        self.upCategory = { parent: categoryTreeViewRemote };
        self.images = product.getAllImages();

        self.variants = {
            selectedVariant: null,
            selectedProperties: null
        };

        self.navigateToShippingCostsPage = function () {
            navigationService.navigateToShippingCostsPage();
        };

        self.hasInfo = function () {
            return product.description || product.hasAttributes();
        };

        self.getTrustedHtml = function (htmlStr) {
            return $sce.trustAsHtml(htmlStr);
        };

        self.price = product.getPrice();
        self.specialPrice = product.getSpecialPrice();
        self.vat = product.getVat();

        self.getBasePriceInfo = function () {
            return productService.getBasePriceInfo(product, self.variants.selectedVariant);
        };

        self.addToBasket = function (product) {
            if (!isVariantSelected(product)) {
                return;
            }

            basketService.addItem(product, 1, self.variants.selectedVariant);
            snapRemote.open('right');
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
//        product.variants = [
//            {
//                id: '1',
//                stock: 1,
//                properties: {
//                    color: 'red',
//                    size: 'XL'
//                },
//                prices: {
//                    normal: 89.99,
//                    special: 20.00
//                }
//            },
//            {
//                id: '2',
//                stock: 1,
//                properties: {
//                    color: 'green',
//                    size: 'XL'
//                },
//                prices: {
//                    normal: 89.99,
//                    special: 89.99
//                }
//            },
//            {
//                id: '3',
//                stock: 1,
//                properties: {
//                    color: 'green',
//                    size: 'L'
//                },
//                prices: {
//                    normal: 89.99,
//                    special: 39.90
//                }
//            }
//        ];

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
            if (variant) {
                if (variant.images && variant.images[0]) {
                    self.images = variant.images;
                    self.productImages = imagePreloadService.getResizedProductImages(self.images, imagePreloaderOptions);
                    self.selectedImage = self.productImages[0].image;
                }
                if (variant.price) {
                    self.price = variant.price.normal;
                    self.specialPrice = variant.price.special || null;
                }
            } else {
                self.price = product.getPrice();
                self.specialPrice = product.getSpecialPrice();
            }
        });

    });
