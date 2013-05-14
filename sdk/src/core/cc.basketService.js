cc.define('cc.BasketService', function(storageService, options){

    'use strict';

    var self = {},
        storePrefix = 'basketService_',
        storeItemsName = storePrefix + 'items',
        items = sanitizeSavedData(storageService.get(storeItemsName)) || [],
        productIdentityFn = options && _.isFunction(options.productIdentityFn) ? 
            options.productIdentityFn : function(productA, productAVariantId, productAOptionId,
                                                 productB, productBVariantId, productBOptionId){

                return productA.id === productB.id &&
                       productAVariantId === productBVariantId &&
                       productAOptionId === productBOptionId;
            };

    
    //allow this service to raise events
    cc.observable.mixin(self);

    //http://mutablethought.com/2013/04/25/angular-js-ng-repeat-no-longer-allowing-duplicates/
    function sanitizeSavedData(data){
        if (!data){
            return data;
        }

        return data.map(function(val){
            delete val['$$hashKey'];

            //on serialization all functions go away. That means, we basically
            //have to create a fresh instance again, once we deserialize again
            var item = cc.Util.deepExtend(new cc.models.BasketItem(), val);

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
     *   - `variantId` the variantID the product should be added with
     *   - `optionId` the optionId the product should be added with
     */
    self.addItem = function(product, quantity, variantId, optionId){
        var basketItem = self.find(createProductPredicate(product, variantId, optionId)),
            exists = !_.isUndefined(basketItem);

        if (!exists){
            basketItem = new cc.models.BasketItem();
            items.push(basketItem);
        }

        basketItem.product = product;
        basketItem.quantity = basketItem.quantity + quantity;
        basketItem.variantId = variantId;
        basketItem.optionId = optionId;

        self.emit('itemAdded', self, basketItem);

        writeToStore();

        return basketItem;
    };

    /**
     * Checks if an product exists in the basket 
     * 
     * Options:
     * 
     *   - `product` the Product object itself
     *   - `variantId` the variantID the basket should be checked for
     *   - `optionId` the optionId the basket should be checked for
     */
    self.exists = function(product, variantId, optionId){
        var basketItem = self.find(createProductPredicate(product, variantId, optionId));
            return !_.isUndefined(basketItem);
    };

    var createProductPredicate = function(productA, productAVariantId, productAOptionId){
        return function(item){
            return productIdentityFn(productA, productAVariantId, productAOptionId,
                                     item.product, item.variantId, item.optionId);
        };
    };

    /**
     * Removes an item from the basket 
     * 
     * Options:
     * 
     *   - `product` the Product that should be removed from the basket
     *   - `quantity` the quantity that should be removed from the basket
     *   - `variantId` the variantID that should be removed from the basket
     *   - `optionId` the optionId that should be removed from the basket
     */
    self.removeItem = function(product, quantity, variantId, optionId){
        var basketItem = self.find(createProductPredicate(product, variantId, optionId));

        if (!basketItem){
            throw new Error('Product id: ' + product.id + 
                ' , variantId: ' + variantId + 
                ', optionId: ' + optionId + 
                '  does not exist in the basket')
        }

        if(basketItem.quantity < quantity){
            throw new Error('remove quantity is higher than existing quantity');
        }

        basketItem.quantity = basketItem.quantity - quantity;

        self.emit('itemRemoved', self, basketItem);

        writeToStore();

        return basketItem;
    };

    /**
     * Removes all items from the basket 
     * 
     * Options:
     * 
     */
    self.clear = function(){
        
        items.length = 0;

        self.emit('cleared', self);

        writeToStore();

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
        return _.find(items, predicate);
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

    self.getSummary = function(){
        var shipping            = cc.Config.shippingCost,
            shippingTax         = cc.Config.shippingTax,
            freeShippingFrom    = cc.Config.freeShippingFrom,
            quantity            = 0,
            sum                 = 0,
            vat                 = 0,
            discount            = 0,
            total               = 0;

        items.forEach(function(item){
            var itemQuantity = parseInt(item.quantity);
            var product = item.product;
            //attention this doesn't take variants into account yet!
            var price = product.price;
            var tax = parseInt(product.tax);
            quantity += itemQuantity;
            sum += price * itemQuantity;
            vat += parseFloat(Math.round((price * tax / (100 + tax) ) * 100) / 100) * itemQuantity;
        });

        //set the shipping to zero if the sum is above the configured free shipping value
        shipping = freeShippingFrom !== null && freeShippingFrom !== undefined && sum >= freeShippingFrom ? 0 : shipping;

        total = sum + shipping + discount;

        vat += parseFloat(Math.round((shipping * shippingTax / (100 + shippingTax) ) * 100) / 100);

        var summary = {
            quantity: quantity,
            sum: sum,
            sumStr: sum.toFixed(2),
            vat: vat,
            vatStr: vat.toFixed(2),
            shipping: shipping,
            shippingStr: shipping.toFixed(2),
            discount: discount,
            total: total,
            totalStr: total.toFixed(2),
            shippingTax: shippingTax
        };

        return summary;
    };

    return self;
});