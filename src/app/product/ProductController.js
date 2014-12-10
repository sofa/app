'use strict';

/* global Image */

angular
    .module('CouchCommerceApp')
    .controller('ProductController', function ($rootScope, $scope, $filter, configService, basketService, navigationService, product, category, dialog, $sce, categoryTreeViewRemote, snapRemote, productService, titleService, imageResizeService, $q) {

        if (!product || !category) {
            return;
        }

        // Set maximum dimensions for the imageResizeService
        var IMAGE_MAX_WIDTH = $rootScope.isTabletSize ? 500 : 300,
            IMAGE_MAX_HEIGHT = IMAGE_MAX_WIDTH,
            ZOOM_IMAGE_MAX_WIDTH = $rootScope.isTabletSize ? 2000 : 1200,
            ZOOM_IMAGE_MAX_HEIGHT = ZOOM_IMAGE_MAX_WIDTH;

        categoryTreeViewRemote.setActive(category);

        $scope.navigationService = navigationService;
        $scope.product = product;

        //yep, that's a hack to trick our cc-go-up-control. Seems reasonable though.
        $scope.upCategory = { parent: category };
        $scope.images = product.getAllImages();

        $scope.$sce = $sce;

        $scope.variants = {
            selectedVariant: null,
            selectedProperties: null
        };

        titleService.setTitleWithSuffix(product.name);

        //update the price when the selected variant changes
        $scope.$watch('variants.selectedVariant', function (variant) {
            $scope.selectedVariant = variant;
            if (variant && variant.images && variant.images[0]) {
                $scope.images = variant.images;
                $scope.productImages = getResizedProductImages();
                $scope.selectedImage = $scope.productImages[0].image;
            }
        });

        var preloadImage = function (imageUrl) {
            var deferred = $q.defer(),
                img = new Image();

            img.onload = function () {
                deferred.resolve(true);
            };
            img.src = imageUrl;

            return deferred.promise;
        };

        var getResizedProductImages = function () {

            var resizedCollection = [];

            angular.forEach($scope.images, function (image, index) {
                resizedCollection[index] = {
                    image: {
                        url: imageResizeService.resize(image.url, {
                            maxwidth: IMAGE_MAX_WIDTH,
                            maxheight: IMAGE_MAX_HEIGHT,
                            quality: 90
                        }),
                        loaded: false
                    },
                    zoomImage: {
                        url: imageResizeService.resize(image.url, {
                            maxwidth: ZOOM_IMAGE_MAX_WIDTH,
                            maxheight: ZOOM_IMAGE_MAX_HEIGHT,
                            quality: 85
                        }),
                        loaded: false
                    }
                };

                preloadImage(resizedCollection[index].image.url).then(function (state) {
                    resizedCollection[index].image.loaded = state;
                    preloadImage(resizedCollection[index].zoomImage.url).then(function (state) {
                        resizedCollection[index].zoomImage.loaded = state;
                    });
                });
            });

            return resizedCollection;
        };

        $scope.productImages = getResizedProductImages();
        $scope.selectedImage = $scope.productImages[0].image;

        $scope.getBasePriceInfo = function () {
            return productService.getBasePriceInfo($scope.product, $scope.variants.selectedVariant);
        };

        var formattedShippingCosts = $filter('currency')(configService.get('shippingCost'));
        $scope.shippingCosts = $scope.ln.shippingCosts.replace('{shipping}', formattedShippingCosts);

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

        //to keep compatibility to our current language file we need to
        //deal with the {tax} marker in the language value and replace it with the
        //products tax.
        $scope.productTaxText = $scope.ln.productTaxText.replace(/{\s*tax\s*}/, $scope.product.tax);

        $scope.checkVariantsSelected = function (product) {
            if (product.hasVariants() && !$scope.variants.selectedVariant) {

                var missingProperties = '';

                for (var key in $scope.variants.selectedProperties) {
                    if (!$scope.variants.selectedProperties[key]) {
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

        $scope.addToBasket = function (product) {
            if (!$scope.checkVariantsSelected(product)) {
                return;
            }

            basketService.addItem(product, 1, $scope.variants.selectedVariant);
            snapRemote.open('right');
        };

        $scope.shared = {};
        $scope.shared.slideIndex = 0;
        $scope.maxImageZoom = ZOOM_IMAGE_MAX_WIDTH / IMAGE_MAX_WIDTH;

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
    });
