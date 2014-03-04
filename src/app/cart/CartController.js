'use strict';
/* globals requestAnimationFrame */

angular.module('CouchCommerceApp')
.controller('CartController', function ($scope, basketService, navigationService, checkoutService, configService, payPalOverlayService, dialog, couponService) {

    $scope.basketService = basketService;
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

            $scope.coupons = basketService.getActiveCoupons();

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

    $scope.decreaseItem = function (item) {
        if (item.quantity > 1) {
            basketService.decreaseOne(item);
        } else {
            dialog.messageBox($scope.ln.btnWarning, $scope.ln.cartDelMsg, [
                {
                    result: 'cancel',
                    label: $scope.ln.btnCancel
                },
                {
                    result: 'ok',
                    label: $scope.ln.btnYes
                }
            ])
            .result
            .then(function (result) {
                if (result === 'ok') {
                    basketService.decreaseOne(item);
                }
            });
        }
    };

    $scope.checkoutWithPayPal = function () {
        payPalOverlayService.startPayPalCheckout();
    };

    $scope.promotionCodeModel = {
        code: '',
        showForm: false,
        canRedeemCode: true
    };

    $scope.canRedeemCode = function () {
        return $scope.promotionCodeModel.canRedeemCode && $scope.promotionCodeModel.code.length;
    };

    $scope.redeemCode = function () {
        $scope.promotionCodeModel.canRedeemCode = false;

        couponService.submitCode($scope.promotionCodeModel.code)
        .then(function () {
            $scope.promotionCodeModel.canRedeemCode = true;
            $scope.promotionCodeModel.showForm = false;
            $scope.promotionCodeModel.code = '';
            updateModels();
        }, function (err) {
            var message = $scope.ln.errorSubmitPromotionCode;
            if (err === 'Invalid') {
                message = $scope.ln.errorInvalidPromotionCode;
            }
            else {
                $scope.promotionCodeModel.showForm = false;
                $scope.promotionCodeModel.code = '';
            }
            dialog
                .messageBox(
                    $scope.ln.btnWarning,
                    message,
                    [{result: 'ok', label: $scope.ln.btnOk}]
                );
            $scope.promotionCodeModel.canRedeemCode = true;
        });
    };

});
