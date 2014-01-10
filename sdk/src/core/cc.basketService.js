/**
 * @name BasketService
 * @class
 * @namespace cc.BasketService
 *
 * @description
 * `cc.BasketService` is the interface to interact with a shopping cart. It provides
 * methods to add, remove or update basket items. It also takes care of writing
 * updates to an available storage service.
 */
cc.define('cc.BasketService', function(storageService, configService, options){

    'use strict';

    var self = {},
        storePrefix = 'basketService_',
        storeItemsName = storePrefix + 'items',
        items = sanitizeSavedData(storageService.get(storeItemsName)) || [],
        productIdentityFn = options && cc.Util.isFunction(options.productIdentityFn) ?
            options.productIdentityFn : function(productA, productAVariant, productAOptionId,
                                                 productB, productBVariant, productBOptionId){

                return productA.id === productB.id &&
                       productAVariant === productBVariant &&
                       productAOptionId === productBOptionId;
            };


    var SHIPPING_COST       = configService.get('shippingCost'),
        SHIPPING_TAX        = configService.get('shippingTax'),
        FREE_SHIPPING_FROM  = configService.get('freeShippingFrom');


    //allow this service to raise events
    cc.observable.mixin(self);

    //http://mutablethought.com/2013/04/25/angular-js-ng-repeat-no-longer-allowing-duplicates/
    function sanitizeSavedData(data){
        if (!data){
            return data;
        }

        return data.map(function(val){
            delete val.$$hashKey;

            //on serialization all functions go away. That means, we basically
            //have to create a fresh instance again, once we deserialize again
            var item = cc.Util.extend(new cc.models.BasketItem(), val);

            if (item.product){
                item.product = cc.Util.extend(new cc.models.Product(), item.product);
            }

            return item;
        });
    }

    var writeToStore = function(){
        storageService.set(storeItemsName, items);
    };

    writeToStore();

    /**
     * @method addItem
     * @memberof cc.BasketService
     *
     * @description
     * Adds an item to the basket. Returns the added basket item.
     *
     * @example
     * basketService.addItem(product, 1, variants.selectedVariant);
     *
     * @param {object} product The product object itself.
     * @param {number} quantity The number of times the product should be added.
     * @param {object} variant The variant the product should be added with.
     * @param {int} optionId The optionId the product should be added with.
     *
     * @return {object} The added basket item.
     */
    self.addItem = function(product, quantity, variant, optionId){

        if(product.isOutOfStock()){
            throw new Error('product out of stock');
        }

        var basketItem = self.find(createProductPredicate(product, variant, optionId)),
            exists = !cc.Util.isUndefined(basketItem);

        if (!exists){
            basketItem = new cc.models.BasketItem();
            items.push(basketItem);
        }

        basketItem.product = product;
        basketItem.quantity = basketItem.quantity + quantity;
        basketItem.variant = variant;
        basketItem.optionId = optionId;

        writeToStore();

        self.emit('itemAdded', self, basketItem);

        return basketItem;
    };

    /**
     * @method increaseOne
     * @memberof cc.BasketService
     *
     * @description
     * This is actually a shorthand for {@link cc.BasketService#increase cc.BasketService.increase}. It increases the amount of given basket item by one.
     *
     * @example
     * cc.BasketService.increaseOne(basketItem);
     * // is equivalent to
     * cc.BasketService.increase(basketItem, 1);
     *
     * @param {object} basketItem The basketItem that should be increased by one.
     *
     * @return {object} basketItem Updated basket item.
     */
    self.increaseOne = function(basketItem){
        return self.increase(basketItem, 1);
    };

    /**
     * @method increase
     * @memberof cc.BasketService
     *
     * @description
     * Increases the quantity of a given basket item by a given value. Increases
     * by one should be done with {@link cc.BasketService#increaseOne cc.BasketService.increaseOne}.
     *
     * Behind the scenes, this method is actually a shorthand for
     * `basketService.addItem()` with a particular configuration. Therefore this
     * method returns the updated basket item for post processing.
     *
     * @example
     * // getting an item
     * var item = / *** /;
     * // update item
     * item = basetService.increase(item, 3);
     *
     * @param {object} basketItem Basket item to increase.
     * @param {number} number Number to increase.
     *
     * @return {object} Updated basket item.
     */
    self.increase = function(basketItem, number){
        return self.addItem(basketItem.product, number, basketItem.variant, basketItem.optionId);
    };

    /**
     * @method exists
     * @memberof cc.BasketService
     *
     * @description
     * Checks if an product exists in the basket. You have to pass the product to
     * check for. Optionally you can pass a product variant and an option id.
     * Returns `true` or `false` accordingly.
     *
     * @example
     * if (basketService.exists(productX, variantA, optionB)) {
     *  // do sth. with it.
     * }
     *
     * @param {object} product The Product object itself.
     * @param {object} variant The variant the basket should be checked for.
     * @param {int} The optionId the basket should be checked for.
     *
     * @return {bool} True whether the product exists or not.
     */
    self.exists = function(product, variant, optionId){
        var basketItem = self.find(createProductPredicate(product, variant, optionId));
            return !cc.Util.isUndefined(basketItem);
    };

    var createProductPredicate = function(productA, productAVariant, productAOptionId){
        return function(item){
            return productIdentityFn(productA, productAVariant, productAOptionId,
                                     item.product, item.variant, item.optionId);
        };
    };

    /**
     * @method removeItem
     * @memberof cc.BasketService
     *
     * @description
     * Removes an item from the basket.
     *
     * @example
     * basketService.removeItem(product, 1, foo, 3);
     *
     * @param {object} product The Product that should be removed from the basket.
     * @param {number} quantity The quantity that should be removed from the basket.
     * @param {object} variant The variant that should be removed from the basket.
     * @param {int} optionId The optionId that should be removed from the basket.
     *
     * @return {object} Removed basket item.
     */
    self.removeItem = function(product, quantity, variant, optionId){
        var basketItem = self.find(createProductPredicate(product, variant, optionId));

        if (!basketItem){
            throw new Error('Product id: ' + product.id +
                ' , variant: ' + variant +
                ', optionId: ' + optionId +
                '  does not exist in the basket');
        }

        if(basketItem.quantity < quantity){
            throw new Error('remove quantity is higher than existing quantity');
        }

        basketItem.quantity = basketItem.quantity - quantity;

        if (basketItem.quantity === 0){
            cc.Util.Array.remove(items, basketItem);
        }

        writeToStore();

        self.emit('itemRemoved', self, basketItem);

        return basketItem;
    };

    /**
     * @method decreaseOne
     * @memberof cc.BasketService
     *
     * @description
     * Decreases the quantity of a given basket item by one. This is a shorthand
     * method for {@link cc.BasketService#decrease cc.BasketService.decrease} and
     * returns the updated basket item.
     *
     * @example
     * var updatedItem = basketService.decreaseOne(item);
     *
     * @param {object} basketItem The basket item that should be decreased by one
     *
     * @return {object} The updated basket item.
     */
    self.decreaseOne = function(basketItem){
        return self.decrease(basketItem, 1);
    };

    /**
     * @method decrease
     * @memberof cc.BasketService
     *
     * @description
     * Decreases that quantity of a given basket item by a given number. This is
     * shorthand method for {@link cc.BasketService#removeItem cc.BasketItem.removeItem}
     * and therefore returns the updated basket item.
     *
     * @example
     * var item = basketItem.decrease(item, 2);
     *
     * @param {object} basketItem The basketItem that should be decreased by one.
     * @param {number} number Number to decrease.
     *
     * @return {object} Updated basket item.
     */
    self.decrease = function(basketItem, number){
        return self.removeItem(basketItem.product, number, basketItem.variant, basketItem.optionId);
    };

    /**
     * @method clear
     * @memberof cc.BasketService
     *
     * @description
     * Removes all items from the basket.
     *
     * @example
     * basketService.clear();
     *
     * @return {object} BasketService instance for method chaining.
     */
    self.clear = function(){

        items.length = 0;

        writeToStore();

        self.emit('cleared', self);

        //return self for chaining
        return self;
    };

    /**
     * @method find
     * @memberof cc.BasketService
     *
     * @description
     * Finds a basket item by the given predicate function.
     *
     * @example
     * var needle = basketService.find(function () [
     *
     * });
     *
     * @param {function} predicate Function to test the basketItem against.
     *
     * @return {object} Found basket item.
     */
    self.find = function(predicate){
        return cc.Util.find(items, predicate);
    };


    /**
     * @method getItems
     * @memberof cc.BasketService
     *
     * @description
     * Returns all basket items.
     *
     * @example
     * var items = basketItem.getItems();
     *
     * @return {array} Basket items.
     */
    self.getItems = function(){
        return items;
    };

    /**
     * @method getSummary
     * @memberof cc.BasketService
     *
     * @description
     * Returns a summary object of the current basket state.
     *
     * @param {object} options Options object.
     *
     * @return {object} Summary object.
     */
    self.getSummary = function(options){
        var shipping             = SHIPPING_COST || 0,
            shippingTax          = SHIPPING_TAX,
            freeShippingFrom     = FREE_SHIPPING_FROM,
            quantity             = 0,
            sum                  = 0,
            vat                  = 0,
            discount             = 0,
            surcharge            =  options && options.paymentMethod &&
                                    cc.Util.isNumber(options.paymentMethod.surcharge) ?
                                    options.paymentMethod.surcharge : 0,
            surcharge_percentage =  options && options.paymentMethod &&
                                    cc.Util.isNumber(options.paymentMethod.surcharge_percentage) ?
                                    options.paymentMethod.surcharge_percentage : 0,
            total                = 0;

        items.forEach(function(item){
            var itemQuantity = parseInt(item.quantity, 10);
            var product = item.product;
            //attention this doesn't take variants into account yet!
            var price = item.getPrice();
            var tax = parseInt(product.tax, 10);
            quantity += itemQuantity;
            sum += price * itemQuantity;
            vat += parseFloat(Math.round((price * tax / (100 + tax) ) * 100) / 100) * itemQuantity;
        });

        //set the shipping to zero if the sum is above the configured free shipping value
        shipping = freeShippingFrom !== null && freeShippingFrom !== undefined && sum >= freeShippingFrom ? 0 : shipping;

        //if a valid shipping method is provided, use the price and completely ignore
        //the freeShippingFrom config as it's the backend's responsability to check that.
        if (options && options.shippingMethod && cc.Util.isNumber(options.shippingMethod.price)){
            shipping = options.shippingMethod.price;
        }

        total = sum + shipping + discount;

        if ( surcharge_percentage ) {
            surcharge = total * (surcharge_percentage/100.0);
        }

        total += surcharge;

        vat += parseFloat(Math.round((shipping * shippingTax / (100 + shippingTax) ) * 100) / 100);

        var summary = {
            quantity: quantity,
            sum: sum,
            sumStr: sum.toFixed(2),
            vat: vat,
            vatStr: vat.toFixed(2),
            shipping: shipping,
            shippingStr: shipping.toFixed(2),
            surcharge: surcharge,
            surchargeStr: surcharge.toFixed(2),
            discount: discount,
            total: total,
            totalStr: total.toFixed(2),
            shippingTax: shippingTax
        };

        return summary;
    };

    return self;
});
