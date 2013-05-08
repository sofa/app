'use strict';

cc.define('cc.BasketService', function(options){
    var self = {},
        items = [],
        productIdentityFn = options && _.isFunction(options.productIdentityFn) ? 
            options.productIdentityFn : function(productA, productAVariantId, productAOptionId,
                                                 productB, productBVariantId, productBOptionId){

                return productA.id === productB.id &&
                       productAVariantId === productBVariantId &&
                       productAOptionId === productBOptionId;
            };

    //allow this service to raise events
    cc.observable.mixin(self);

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

    self.getSummary = function(){
        var summary = {
            quantity: 0
        };

        items.forEach(function(item){
            summary.quantity += item.quantity;
        });

        return summary;
    };

    return self;
});