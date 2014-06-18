'use strict';

/* global Image */

angular.module('CouchCommerceApp')
.controller('ProductController', function ($rootScope, $scope, $filter, $location, configService, couchService, basketService, navigationService, product, category, dialog, $sce, categoryTreeViewRemote, snapRemote, productService, titleService, imageResizeService, $q) {

    if (!product || !category) {
        return;
    }

    // Set maximum dimensions for the imageResizeService
    var IMAGE_MAX_HEIGHT     = $rootScope.isTabletSize ? 500 : 300,
        IMAGE_MAX_WIDTH      = $rootScope.isTabletSize ? 500 : 300,
        THUMBNAIL_MAX_WIDTH  = $rootScope.isTabletSize ? 120 : 50,
        THUMBNAIL_MAX_HEIGHT = $rootScope.isTabletSize ? 120 : 50;

    categoryTreeViewRemote.setActive(category);

    $scope.navigationService = navigationService;
    $scope.product = product;

    //yep, that's a hack to trick our cc-go-up-control. Seems reasonable though.
    $scope.upCategory = { parent: category };
    $scope.images = product.getAllImages();

    $scope.$sce = $sce;

    $scope.variants = {
        selectedVariant : null,
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
                thumbnail: imageResizeService.resize(image.url, {
                    maxwidth: THUMBNAIL_MAX_WIDTH,
                    maxheight: THUMBNAIL_MAX_HEIGHT
                }),
                image: {
                    url: imageResizeService.resize(image.url, {
                        maxwidth: IMAGE_MAX_WIDTH,
                        maxheight: IMAGE_MAX_HEIGHT
                    }),
                    loaded: false
                }
            };

            preloadImage(resizedCollection[index].image.url).then(function (state) {
                resizedCollection[index].image.loaded = state;
            });
        });

        return resizedCollection;
    };

    $scope.productImages = getResizedProductImages();
    $scope.selectedImage = $scope.productImages[0].image;

    $scope.changeImage = function (image) {
        $scope.selectedImage = image;
    };

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

    var cycleProducts = true;
    $scope.getPrevProduct = function (product) {
        var prev = couchService.getPreviousProduct(product, cycleProducts);
        //console.log('getPrevProduct', prev);
        return prev;
    };

    $scope.getNextProduct = function (product) {
        var next = couchService.getNextProduct(product, cycleProducts);
        //console.log('getNextProduct', next);
        return next;
    };

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
                .messageBox($scope.ln.btnWarning, cc.Lang.missingVariantAttributeText + missingProperties, [{result: 'ok', label: $scope.ln.btnOk}]);

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

});
