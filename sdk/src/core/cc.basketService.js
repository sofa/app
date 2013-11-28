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
     * Adds an item to the basket. Returns the added 'BasketItem'
     *
     * Options:
     *
     *   - `product` the Product object itself
     *   - `quantity` the number of times the product should be added
     *   - `variant` the variant the product should be added with
     *   - `optionId` the optionId the product should be added with
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
     * A shorthand for:
     * basketService.increase(basketItem, 1)
     *
     * Options:
     *
     *   - `basketItem` the basketItem that should be increased by one
     */
    self.increaseOne = function(basketItem){
        return self.increase(basketItem, 1);
    };

    /**
     * A shorthand for:
     * basketService.addItem(basketItem.product, number, basketItem.variant, basketItem.optionId)
     *
     * Options:
     *
     *   - `basketItem` the basketItem that should be increased by one
     */
    self.increase = function(basketItem, number){
        return self.addItem(basketItem.product, number, basketItem.variant, basketItem.optionId);
    };

    /**
     * Checks if an product exists in the basket
     *
     * Options:
     *
     *   - `product` the Product object itself
     *   - `variant` the variant the basket should be checked for
     *   - `optionId` the optionId the basket should be checked for
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
     * Removes an item from the basket
     *
     * Options:
     *
     *   - `product` the Product that should be removed from the basket
     *   - `quantity` the quantity that should be removed from the basket
     *   - `variant` the variant that should be removed from the basket
     *   - `optionId` the optionId that should be removed from the basket
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
            cc.Array.remove(items, basketItem);
        }

        writeToStore();

        self.emit('itemRemoved', self, basketItem);

        return basketItem;
    };

    /**
     * A shorthand for:
     * basketService.decrease(basketItem, 1)
     *
     * Options:
     *
     *   - `basketItem` the basketItem that should be decreased by one
     */
    self.decreaseOne = function(basketItem){
        return self.decrease(basketItem, 1);
    };

    /**
     * A shorthand for:
     * basketService.removeItem(basketItem.product, number, basketItem.variant, basketItem.optionId)
     *
     * Options:
     *
     *   - `basketItem` the basketItem that should be decreased by one
     */
    self.decrease = function(basketItem, number){
        return self.removeItem(basketItem.product, number, basketItem.variant, basketItem.optionId);
    };

    /**
     * Removes all items from the basket
     *
     * Options:
     *
     */
    self.clear = function(){

        items.length = 0;

        writeToStore();

        self.emit('cleared', self);

        //return self for chaining
        return self;
    };

    /**
     * Finds a basket item by the given predicate function
     *
     * Options:
     *
     *   - `predicate` function to test the basketItem against
     */

    self.find = function(predicate){
        return cc.Util.find(items, predicate);
    };


    /**
     * Returns all basket items
     *
     */

    self.getItems = function(){
        return items;
    };

    /**
     * Returns a summary object of the current basket state
     *
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