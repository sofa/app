'use strict';

describe('CouchCommerceApp', function () {

    beforeEach(module('CouchCommerceApp'));

    describe('CartController', function () {

        var CartController, $scope;

        beforeEach(inject(function (_$rootScope_, _$controller_) {
            $scope = _$rootScope_.$new();
            CartController = _$controller_('CartController', {
                '$scope': $scope
            });
        }));

        it('should be defined', function () {
            expect(CartController).toBeDefined();
        });

        it('should have navigationService defined on $scope', function () {
            expect($scope.navigationService).toBeDefined();
        });

        it('shoud have configService defined on $scope', function () {
            expect($scope.configService).toBeDefined();
        });

        describe('CartController#decreaseItem', function () {

            it('should be defined', function () {
                expect($scope.decreaseItem).toBeDefined();
            });

            it('should be a function', function () {
                expect(typeof $scope.decreaseItem).toBe('function');
            });

            it('should decrease quantity of a given item', inject(function (basketService) {
                basketService.clear();
                var product = new cc.models.Product();
                var item = basketService.addItem(product, 2);
                $scope.decreaseItem(item);
                expect(item.quantity).toBe(1);
            }));
        });

        describe('CartController#checkoutWithPayPal', function () {

            it('should be defined', function () {
                expect($scope.checkoutWithPayPal).toBeDefined();
            });

            it('should be a function', function () {
                expect(typeof $scope.checkoutWithPayPal).toBe('function');
            });
        });
    });
});
