'use strict';

/* globals requestAnimationFrame */

angular
    .module('CouchCommerceApp')
    .controller('CartController', function ($scope, basketService, navigationService, configService, payPalOverlayService, dialog, couponService, sidemenuUiState, $location) {

        $scope.navigationService = navigationService;
        $scope.configService = configService;

        $scope.enablePromotionCodes = configService.get('enablePromotionCodes', false);

        var updateModels = function () {

            // turns out basketService.getSummary() is quite costly.
            // On some devices (iPhone, I'm looking at you) there's not enough
            // time left in our budget to do the calculation within the given frame.
            // This causes quite weird behaviour (dropped frames?) where the screen
            // isn't updated and then when the user tappes the next time the amount of the
            // item jumps two steps (or better that's how it looks for the user, in reality
            // most likely it was just the screen which wasn't updated correctly before)
            // We overcome this by scheduling the getSummary() for the next frame.
            requestAnimationFrame(function () {
                $scope.summary = basketService.getSummary();

                $scope.discountCodes = basketService.getActiveCoupons();

                //that's a bit of a hack. We use the total box for both cart
                //and summary page. In the summary page we always have a server generated
                //shipping. However, in the cart we might want to show a link to the
                //shipping costs page. The total box checks for shipping === null to
                //either show the link or the value.
                if (configService.get('shippingCost') === null) {
                    $scope.summary.shipping = null;
                }

                $scope.$digest();
            });

            $scope.items = basketService.getItems();
            $scope.isEmpty = $scope.items.length === 0;
        };

        updateModels();

        basketService
            .on('cleared', updateModels)
            .on('itemAdded', updateModels)
            .on('itemRemoved', updateModels)
            .on('couponAdded', updateModels)
            .on('couponRemoved', updateModels);


        $scope.navigateToProduct = function (product) {
            if ($location.path().indexOf(product.getOriginFullUrl()) > -1) {
                sidemenuUiState.closeSidemenu();
            } else {
                navigationService.navigateToUrl(product.getOriginFullUrl());
            }
        };

        $scope.removeItem = function (item) {
            basketService.removeItem(item.product, item.variant);
        };

        $scope.increaseItem = function (item) {
            if (basketService.canBeIncreasedBy(item, 1)) {
                basketService.increaseOne(item);
            }
        };

        $scope.decreaseItem = function (item) {
            if (item.quantity > 1) {
                basketService.decreaseOne(item);
            }
        };

        $scope.checkoutWithPayPal = function () {
            payPalOverlayService.startPayPalCheckout();
        };

        $scope.discountModel = {
            code: '',
            showForm: false,
            canRedeemCode: true
        };

        $scope.toggleDiscountCodeForm = function () {
            $scope.discountModel.showForm = !$scope.discountModel.showForm;
        };

        $scope.removeDiscountCode = function (obj) {
            basketService.removeCoupon(obj.code);
        };

        $scope.canRedeemCode = function () {
            return $scope.discountModel.canRedeemCode && $scope.discountModel.code.length;
        };

        $scope.redeemCode = function () {
            $scope.discountModel.canRedeemCode = false;

            couponService.submitCode($scope.discountModel.code)
                .then(function () {
                    $scope.discountModel.canRedeemCode = true;
                    $scope.discountModel.showForm = false;
                    $scope.discountModel.code = '';
                    updateModels();
                }, function (err) {
                    var message = $scope.ln.errorSubmitPromotionCode;
                    if (err === 'Invalid') {
                        message = $scope.ln.errorInvalidPromotionCode;
                    }
                    else {
                        $scope.discountModel.showForm = false;
                        $scope.discountModel.code = '';
                    }
                    dialog
                        .messageBox(
                            $scope.ln.btnWarning,
                            message,
                            [
                                {result: 'ok', label: $scope.ln.btnOk}
                            ]
                        );
                    $scope.discountModel.canRedeemCode = true;
                });
        };

    });
