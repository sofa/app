(function(window, undefined){

/**
 * @module sofa
 *
 * @description
 * The web app SDK module contains all SDK components you need to build your
 * custom mobile shop based on CouchCommerce API's.
 */

/**
 * @name cc
 * @class
 * @global
 * @static
 * @namespace cc
 *
 * @description
 * The global `cc` object is a static instance that provides a basic API to create
 * for example namespaces as well as methods for creating inheritance. 
 * In general you'd never use this object directly, since the SDK takes care of
 * that for you.
 */
var cc = window.cc = {};

(function(){

    'use strict';

    /**
     * @method namespace
     * @memberof cc
     * @public
     *
     * @description
     * Creates the given namespace within the 'cc' namespace. The method returns
     * a `namespaceObject` that contains information about the namespace.
     *
     * Simply pass a string that represents a namespace using the dot notation.
     * So a valid namespace would be 'foo.bar.bazinga' as well as 'foo'.
     *
     * It's not required to mention 'cc' as root in the namespace, since this
     * method creates the given namespace automatically under 'cc' namespace.
     * 
     * In case 'cc' is given as root namespace, it gets stripped out, so its more
     * a kind of syntactic sugar to mention 'cc' namespace.
     *
     * @example
     * // creates a namespace for `cc.services.FooService`
     * cc.namespace('cc.services.FooService');
     * 
     * @example
     * // also creates a namespace for `cc.services.FooService`
     * cc.namespace('services.FooService');
     *
     * @param {string} namespaceString A namespace string e.g. 'cc.services.FooService'.
     * @returns {namespaceObject} A namespace object containing information about the current
     * and parent targets.
     */
    cc.namespace = function (namespaceString) {
        var parts = namespaceString.split('.'), parent = cc, i;

        //strip redundant leading global
        if (parts[0] === 'cc') {
            parts = parts.slice(1);
        }

        var targetParent = cc,
            targetName;

        for (i = 0; i < parts.length; i++) {
            //create a propery if it doesn't exist
            if (typeof parent[parts[i]] === "undefined") {
                parent[parts[i]] = {};
            }

            if (i === parts.length - 2){
                targetParent = parent[parts[i]];
            }

            targetName = parts[i];

            parent = parent[parts[i]];
        }

        /**
        * @typdef namespaceObject
        * @type {object}
        * @property {object} targetParent - Parent namespace object.
        * @property {string} targetName - Current namespace name.
        * @property {function} bind - A convenient function to bind a value to the namespace.
        */
        return {
            targetParent: targetParent,
            targetName: targetName,
            bind: function(target){
                targetParent[targetName] = target;
            }
        };
    };

    /**
     * @method define
     * @memberof cc
     * @public
     *
     * @description
     * This method delegates to [cc.namespace]{@link cc#namespace} and binds a new
     * value to it's given namespace. Because of delegation, rules for the given
     * namespace are the same as for `cc.namespace`.
     *
     * As second argument you have to provide a constructor function that will be
     * bound to the given namespace.
     *
     * @example
     * // defining constructor for 'foo.bar'
     * cc.define('foo.bar', function () {
     *  // some logic
     * });
     *
     * @example
     * // of course it's also possible to use named functions
     * var Greeter = function () {
     *  return {
     *    sayHello: function () {
     *      console.log('hello');
     *    }
     *  };
     * };
     *
     * cc.define('greeter', Greeter);
     *
     * @param {string} namespace A namespace string e.g. 'cc.services.FooService".
     * @param {function} fn A constructor function that will be bound to the namespace.
     */
    cc.define = function(namespace, fn){
        cc.namespace(namespace)
          .bind(fn);
    };

    /**
     * @method inherits
     * @memberof cc
     * @public
     *
     * @description
     * Sets up an inheritance chain between two objects
     * (See {@link https://github.com/isaacs/inherits/blob/master/inherits.js}).
     *
     * @example
     * // creating a constructor
     * function Child () {
     *   Child.super.call(this)
     *   console.error([this
     *                ,this.constructor
     *                ,this.constructor === Child
     *                ,this.constructor.super === Parent
     *                ,Object.getPrototypeOf(this) === Child.prototype
     *                ,Object.getPrototypeOf(Object.getPrototypeOf(this))
     *                 === Parent.prototype
     *                ,this instanceof Child
     *                ,this instanceof Parent])
     * }
     *
     * // creating another constructor
     * function Parent () {}
     *
     * cc.inherits(Child, Parent)
     * // getting an instance
     * new Child
     *
     * @param {object} c Child constructor.
     * @param {object} p Parent constructor.
     * @param {object} proto Prototype object.
     */

     /*jshint asi: true*/
    cc.inherits = function (c, p, proto) {
        //this code uses a shitty form of semicolon less
        //writing. We just copied it from:
        //https://github.com/isaacs/inherits/blob/master/inherits.js

        proto = proto || {}
        var e = {}
        ;[c.prototype, proto].forEach(function (s) {
            Object.getOwnPropertyNames(s).forEach(function (k) {
                e[k] = Object.getOwnPropertyDescriptor(s, k)
            })
        })
        c.prototype = Object.create(p.prototype, e)
        c.super = p
    };
    /*jshint asi: false*/
})();

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

/**
 * @name CheckoutService
 * @namespace cc.CheckoutService
 *
 * @description
 * The `cc.CheckoutService` provides methods to perform checkouts as well as giving
 * you information about used and last used payment or shipping methods. There are
 * several checkout types supported, all built behind a clean API.
 */
cc.define('cc.CheckoutService', function($http, $q, basketService, loggingService, configService, trackingService){

    'use strict';

    var self = {};

    var FORM_DATA_HEADERS = {'Content-Type': 'application/x-www-form-urlencoded'},
        CHECKOUT_URL      = configService.get('checkoutUrl'),
        FULL_CHECKOUT_URL = configService.get('checkoutUrl') + 'ajax.php';

    var lastUsedPaymentMethod,
        lastUsedShippingMethod,
        lastSummaryResponse;

    var redirect = null;

    //allow this service to raise events
    cc.observable.mixin(self);

    //we might want to put this into a different service
    var toFormData = function(obj) {
        var str = [];
        for(var p in obj){
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
        return str.join('&');
    };

    var createQuoteData = function(){

        var data = {};
        basketService
            .getItems()
            .forEach(function(item){
                data[item.product.id] = {
                    qty: item.quantity,
                    variantID: item.getVariantID(),
                    //TODO: the option ID lives on the variant on the sencha version. Check again!
                    optionID: item.getOptionID()
                };
            });

        return data;
    };

    //we need to transform the checkoutModel into something the backend understands
    var createRequestData = function(checkoutModel){

        if (!checkoutModel){
            return null;
        }

        var modelCopy = cc.Util.clone(checkoutModel);
        var requestModel = {};

        if (modelCopy.billingAddress && modelCopy.billingAddress.country){
            modelCopy.billingAddress.country = checkoutModel.billingAddress.country.value;
            modelCopy.billingAddress.countryLabel = checkoutModel.billingAddress.country.label;
            requestModel.invoiceAddress = JSON.stringify(modelCopy.billingAddress);
        }

        if (modelCopy.shippingAddress && modelCopy.shippingAddress.country){
            modelCopy.shippingAddress.country = checkoutModel.shippingAddress.country.value;
            modelCopy.shippingAddress.countryLabel = checkoutModel.shippingAddress.country.label;
            requestModel.shippingAddress = JSON.stringify(modelCopy.shippingAddress);
        }

        if (modelCopy.selectedPaymentMethod && modelCopy.selectedPaymentMethod.method){
            requestModel.paymentMethod = modelCopy.selectedPaymentMethod.method;
        }

        if(modelCopy.selectedShippingMethod && modelCopy.selectedShippingMethod.method){
            requestModel.shippingMethod = modelCopy.selectedShippingMethod.method;
        }

        requestModel.quote = JSON.stringify(createQuoteData());

        return requestModel;
    };

    /**
     * @method getLastUsedPaymentMethod
     * @memberof cc.CheckoutService
     *
     * @description
     * Returns the last used payment method.
     *
     * @example
     * checkoutService.getLastUsedPaymentMethod();
     *
     * @return {object} Last used payment method.
     */
    self.getLastUsedPaymentMethod = function(){
        return lastUsedPaymentMethod || null;
    };

    /**
     * @method getLastUsedShippingMethod
     * @memberof cc.CheckoutService
     *
     * @description
     * Returns the last used shipping method.
     *
     * @example
     * checkoutService.getLastUsedShippingMethod()
     *
     * @return {object} Last used shipping method.
     */
    self.getLastUsedShippingMethod = function(){
        return lastUsedShippingMethod || null;
    };

    /**
     * @method getShippingMethodsForPayPal
     * @memberof cc.CheckoutService
     *
     * @description
     * This method delegates to {@link cc.CheckoutService#getSupportedCheckoutMethods cc.CheckoutService.getSupportedCheckoutMethods} end returns the supported shipping
     * methods for PayPal. One has to pass a shipping country to determine the
     * supported shipping methods.
     *
     * @example
     * var methods = checkoutService.getShippingMethodsForPayPal(shippingCountry);
     *
     * @param {int} shippingCountry Shipping country id.
     *
     * @return {object} A promise.
     */
    self.getShippingMethodsForPayPal = function(shippingCountry){
        var checkoutModel = {
            billingAddress: {
                country: shippingCountry || configService.getDefaultCountry()
            },
            shippingAddress: {
                country: shippingCountry || configService.getDefaultCountry()
            },
            selectedPaymentMethod: 'paypal_express'
        };

        return self.getSupportedCheckoutMethods(checkoutModel);
    };

    /**
     * @method getSupportedCheckoutMethods
     * @memberof cc.CheckoutService
     *
     * @description
     * Returns supported checkout methods by a given checkout model.
     *
     * @param {object} checkoutModel A full featured checkout model.
     *
     * @return {object} A promise.
     */
    self.getSupportedCheckoutMethods = function(checkoutModel){

        var requestModel = createRequestData(checkoutModel);
        requestModel.task = 'GETPAYMENTMETHODS';

        if (cc.Util.isObject(checkoutModel.selectedPaymentMethod)){
            lastUsedPaymentMethod = checkoutModel.selectedPaymentMethod;
        }

        if (cc.Util.isObject(checkoutModel.selectedShippingMethod)){
            lastUsedShippingMethod = checkoutModel.selectedShippingMethod;
        }

        return $http({
            method: 'POST',
            url: FULL_CHECKOUT_URL,
            headers: FORM_DATA_HEADERS,
            transformRequest: toFormData,
            data: requestModel
        })
        .then(function(response){
            var data = null;

            if(response.data ){
                data = cc.Util.toJson(response.data);

                if (data){

                    //We need to fix some types. It's a bug in the backend
                    //https://github.com/couchcommerce/admin/issues/42

                    data.paymentMethods = data.paymentMethods
                                            .map(function(method){
                                                method.surcharge = parseFloat(method.surcharge);
                                                if ( method.surcharge_percentage ) {
                                                    method.surcharge_percentage = parseFloat(method.surcharge_percentage);
                                                }
                                                return method;
                                            });

                    data.shippingMethods = data.shippingMethods
                                            .map(function(method){
                                                method.price = parseFloat(method.price);
                                                return method;
                                            });
                }
            }

            return data;
        }, function(fail){
            loggingService.error([
                '[CheckoutService: getSupportedCheckoutMethods]',
                '[Request Data]',
                checkoutModel,
                '[Service answer]',
                fail
            ]);
            return $q.reject(fail);
        });
    };

    /**
     * @method checkoutWithCouchCommerce
     * @memberof cc.CheckoutService
     *
     * @return {object} A promise.
     */
    self.checkoutWithCouchCommerce = function(checkoutModel){

        if(checkoutModel.addressEqual){
            checkoutModel.shippingAddress = checkoutModel.billingAddress;
        }

        var requestModel = createRequestData(checkoutModel);
        requestModel.task = 'CHECKOUT';

        return $http({
            method: 'POST',
            url: FULL_CHECKOUT_URL,
            headers: FORM_DATA_HEADERS,
            transformRequest: toFormData,
            data: requestModel
        })
        .then(function(response){
            var data = null;
            if(response.data){
                data = cc.Util.toJson(response.data);
                data = data.token || null;
            }
            return data;
        }, function(fail){
            loggingService.error([
                '[CheckoutService: checkoutWithCouchCommerce]',
                '[Request Data]',
                checkoutModel,
                '[Service answer]',
                fail
            ]);

            return $q.reject(fail);
        });
    };

    /**
     * @method checkoutWithPayPal
     * @memberof cc.CheckoutService
     *
     * @param {object} shippingMethod Shipping method object.
     * @param {object) shippingCountry Country to ship.
     */
    self.checkoutWithPayPal = function(shippingMethod, shippingCountry){

        var checkoutModel = {
            selectedShippingMethod: shippingMethod,
            selectedPaymentMethod: { method: 'paypal' },
            shippingAddress: {
                country: shippingCountry
            },
            billingAddress: {
                country: shippingCountry
            }
        };

        var requestModel = createRequestData(checkoutModel);
        requestModel.task = 'UPDATEQUOTEPP';

        return $http({
            method: 'POST',
            url: FULL_CHECKOUT_URL,
            headers: FORM_DATA_HEADERS,
            transformRequest: toFormData,
            data: requestModel
        })
        .then(function(response){
            /*jslint eqeq: true*/
            if (response.data == 1){
                //we set the browser to this backend url and the backend in turn
                //redirects the browser to PayPal. Not sure why we don't redirect the
                //browser directly.
                //TODO: ask Felix
                window.location.href = configService.get('checkoutUrl');
            }
            else{
                return $q.reject(new Error('invalid server response'));
            }
        })
        .then(null,function(fail){
            loggingService.error([
                '[CheckoutService: checkoutWithPayPal]',
                '[Request Data]',
                requestModel,
                '[Service answer]',
                fail
            ]);
            return $q.reject(fail);
        });
    };

    var safeUse = function(property){
        return property === undefined || property === null ? '' : property;
    };

    //unfortunately the backend uses all sorts of different address formats
    //this one converts an address coming from a summary response to the
    //generic app address format.
    var convertAddress = function(backendAddress){

        backendAddress = backendAddress || {};

        var country = {
            value: safeUse(backendAddress.country),
            label: safeUse(backendAddress.countryname)
        };

        return {
            company:            safeUse(backendAddress.company),
            salutation:         safeUse(backendAddress.salutation),
            surname:            safeUse(backendAddress.lastname),
            name:               safeUse(backendAddress.firstname),
            street:             safeUse(backendAddress.street1),
            zip:                safeUse(backendAddress.zip),
            city:               safeUse(backendAddress.city),
            country:            !country.value ? null : country,
            email:              safeUse(backendAddress.email),
            telephone:          safeUse(backendAddress.telephone)
        };
    };

    //we want to make sure that the server returned summary can be used
    //out of the box to work with our summary templates/directives, hence
    //we have to convert it (similar to how we do it for the addresses).
    var convertSummary = function(backendSummary){
        backendSummary = backendSummary || {};

        return {
            sum:            safeUse(backendSummary.subtotal),
            shipping:       safeUse(backendSummary.shipping),
            surcharge:      safeUse(backendSummary.surcharge),
            vat:            safeUse(backendSummary.vat),
            total:          safeUse(backendSummary.grandtotal)
        };
    };

    /**
     * @method getSummary
     * @memberof cc.CheckoutService
     *
     * @return {object} A promise.
     */
    self.getSummary = function(token){
        return $http({
            method: 'POST',
            url: CHECKOUT_URL + 'summaryst.php',
            headers: FORM_DATA_HEADERS,
            transformRequest: toFormData,
            data: {
                details: 'get',
                token: token
            }
        })
        .then(function(response){
            var data = {};
            data.response = cc.Util.toJson(response.data);
            data.invoiceAddress = convertAddress(data.response.billing);
            data.shippingAddress = convertAddress(data.response.shipping);
            data.summary = convertSummary(data.response.totals);
            data.token = token;

            lastSummaryResponse = data;

            // For providers such as CouchPay
            if ( data.response.redirect ) {
                redirect = { token: token, redirect: data.response.redirect };
            }
            else {
                redirect = null;
            }

            return data;
        });
    };

    /**
     * @method getLastSummary
     * @memberof cc.CheckoutService
     *
     * @return {object} Last summary response.
     */
    self.getLastSummary = function() {
        return lastSummaryResponse;
    };

    /**
     * @method activateOrder
     * @memberof cc.CheckoutService
     *
     * @return {object} A promise.
     */
    //that's the final step to actually create the order on the backend
    self.activateOrder = function(token){

        // docheckoutst.php cannot be called here if a payment method redirects us
        // as the backend needs to finalize the order
        if (redirect && redirect.token === token) {
            window.location.href = configService.get('checkoutUrl') + redirect.redirect + '?token=' + token;
            throw "stop execution";
        }

        return $http({
            method: 'POST',
            url: CHECKOUT_URL + 'docheckoutst.php',
            headers: FORM_DATA_HEADERS,
            transformRequest: toFormData,
            data: {
                details: 'get',
                token: token
            }
        })
        .then(function(response){
            var json = cc.Util.toJson(response.data);

            return json;
        }, function(fail){
            loggingService.error([
                '[CheckoutService: checkoutWithCouchCommerce]',
                '[Request Data]',
                token,
                '[Service answer]',
                fail
            ]);

            return $q.reject(fail);
        });
    };

    return self;
});

/**
 * @name ProductComparer
 * @namespace cc.comparer.ProductComparer
 *
 * @description
 *
 */
cc.define('cc.comparer.ProductComparer', function(tree, childNodeProperty){

    'use strict';

    return function(a, b){

        //either compare products by object identity, urlKey identity or id identity
        return  a === b || 
                a.urlKey && b.urlKey && a.urlKey === b.urlKey ||
                a.id && b.id && a.id === b.id;
    };
});

/**
 * @name ConfigService
 * @class
 * @namespace cc.ConfigService
 *
 * @description
 * General configuration service which kind of behaves as a registry
 * pattern to make configurations available on all layers.
 */
cc.define('cc.ConfigService', function(){

    'use strict';

    var self = {};

    /**
     * @method getSupportedCountries
     * @memberof cc.ConfigService
     *
     * @description
     * Gets an array of supported countries for shipping and invoicing.
     * 
     * @example
     * // returns supported countries
     * cc.ConfigService.getSupportedCountries();
     *
     * @return {array} Returns an array of strings for supported countries.
     */
    self.getSupportedCountries = function(){
        if (!cc.Config.countries){
            //should we rather throw an exception here?
            return [];
        }

        return cc.Config.countries;
    };

    /**
     * @method getDefaultCountry
     * @memberof cc.ConfigService
     *
     * @description
     * Gets the default country for shipping and invoicing.
     * 
     * @example
     * // returns default country
     * cc.ConfigService.getDefaultCountry();
     *
     * @return {string} Default country.
     */
    self.getDefaultCountry = function(){
        var countries = self.getSupportedCountries();
        return countries.length === 0 ? null : countries[0];
    };

    /**
     * @method getLocalizedPayPalButtonClass
     * @memberof cc.ConfigService
     *
     * @description
     * Returns a localized paypal button css class.
     *
     * @example
     * cc.ConfigService.getLocalizedPayPalButtonClass();
     *
     * @return {string} PayPal button class.
     */
    self.getLocalizedPayPalButtonClass = function(disabled){
        return !disabled ? 'cc-paypal-button--' + self.get('locale') : 
                           'cc-paypal-button--' + self.get('locale') + '--disabled';
    };

    /**
     * @method get
     * @memberof cc.ConfigService
     *
     * @description
     * Generic getter function that returns a config value by a given key.
     * If a default value is passed and no config setting with the given key
     * exists, it is returned.
     *
     * @example
     * // returns config setting for 'foo'
     * cc.ConfigService.get('foo');
     *
     * @example
     * // returns 5 if config for 'foo' doesn't exist
     * cc.ConfigService.get('foo', 5);
     *
     * @param {string} key Key for a certain config value.
     * @param {object} defaultValue A default value which will be returned
     * if given key doesn't exist in config.
     *
     * @return {object} Associative object for `key`.
     */
    self.get = function(key, defaultValue){

        var value = cc.Config[key];

        if (cc.Util.isUndefined(value) && !cc.Util.isUndefined(defaultValue)){
            return defaultValue;
        }

        return value;
    };

    return self;
});

/**
 * @name CouchService
 * @namespace cc.CouchService
 *
 * @description
 * `CouchService` let's you interact with the CouchCommerce API. It provides methods
 * to get products, get preview data or handling with categories.
 */
cc.define('cc.CouchService', function($http, $q, configService){

    'use strict';

    var self = {},
        products = {},
        productComparer = new cc.comparer.ProductComparer(),
        categoryMap = null;

    var MEDIA_FOLDER        = configService.get('mediaFolder'),
        MEDIA_IMG_EXTENSION = configService.get('mediaImgExtension'),
        API_URL             = configService.get('apiUrl'),
        //this is not exposed to the SAAS hosted product, hence the default value
        API_HTTP_METHOD     = configService.get('apiHttpMethod', 'jsonp'),
        STORE_CODE          = configService.get('storeCode'),
        CATEGORY_JSON       = configService.get('categoryJson');

    /**
     * @method isAChildAliasOfB
     * @memberof cc.CouchService
     *
     * @description
     * Checks whether a given category a exists as an child
     * on another category b. Taking only direct childs into account.
     * 
     * @param {object} a Category a.
     * @param {object} b Category b.
     *
     * @return {boolean}
     */
    self.isAChildAliasOfB = function(categoryA, categoryB){
        if (!categoryB.children || categoryB.children.length === 0){
            return false;
        }

        var alias = cc.Util.find(categoryB.children, function(child){
            return child.urlId === categoryA.urlId;
        });

        return !cc.Util.isUndefined(alias);
    };

    /**
     * @method isAParentOfB
     * @memberof cc.CouchService
     *
     * @description
     * Checks whether a given category is the parent of another category taking 
     * n hops into account.
     * 
     * @param {object} a Category a.
     * @param {object} b Category b.
     *
     * @return {boolean}
     */
    self.isAParentOfB = function(categoryA, categoryB){
        //short circuit if it's a direct parent, if not recursively check
        return categoryB.parent === categoryA || 
               (categoryB.parent && self.isAParentOfB(categoryA, categoryB.parent)) === true;
    };

    /**
     * @method isAChildOfB
     * @memberof cc.CouchService
     *
     * @description
     * Checks whether a given category is the child
     * of another category taking n hops into account.
     * 
     * @param {object} a Category a.
     * @param {object} b Category b.
     *
     * @return {boolean}
     */
    self.isAChildOfB = function(categoryA, categoryB){
        return self.isAParentOfB(categoryB, categoryA);
    };

    /**
     * @method getCategory
     * @memberof cc.CouchService
     *
     * @description
     * Fetches the category with the given `categoryUrlId` If no category is 
     * specified, the method defaults to the root category.
     * 
     * @param {object} categoryUrlId The category to be fetched.
     * @return {Promise} A promise.
     */
    self.getCategory = function(category){
        if (!category && !categoryMap){
            return fetchAllCategories();
        }
        else if(!category && categoryMap){
            return $q.when(categoryMap.rootCategory);
        }
        else if(category && category.length > 0 && !categoryMap){
            return fetchAllCategories()
                    .then(function(data){
                        return categoryMap.getCategory(category);
                    });
        }
        else if(category && category.length > 0 && categoryMap){
            return $q.when(categoryMap.getCategory(category));
        }
    };

    /**
     * @method getProducts
     * @memberof cc.CouchService
     *
     * @description
     * Fetches all products of a given category.
     * 
     * @param {int} categoryUrlId The urlId of the category to fetch the products from.
     * @preturn {Promise} A promise that gets resolved with products.
     */
    self.getProducts = function(categoryUrlId){

        if(!products[categoryUrlId]){
            return $http({
                method: API_HTTP_METHOD,
                url: API_URL +
                '?&stid=' +
                STORE_CODE +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK'
            })
            .then(function(data){
                var tempProducts = augmentProducts(data.data.products, categoryUrlId);
                //FixMe we are effectively creating a memory leak here by caching all
                //seen products forever. This needs to be more sophisticated
                products[categoryUrlId] = tempProducts;
                return tempProducts;
            });
        }

        return $q.when(products[categoryUrlId]);
    };

    //it's a bit akward that we need to do that. It should be adressed
    //directly on our server API so that this extra processing can be removed.
    var augmentProducts = function(products, categoryUrlId){
        return products.map(function(product){
            product.categoryUrlId = categoryUrlId;
            // the backend is sending us prices as strings.
            // we need to fix that up for sorting and other things to work
            product.price = parseFloat(product.price, 10);
            return cc.Util.extend(new cc.models.Product(), product);
        });
    };

    /**
     * @method getNextProduct
     * @memberof cc.CouchService
     *
     * @description
     * Fetches the next product within the product's category.
     * 
     * @param {object} product The product to find the neighbour of.
     * @return {object} Next product.
     */
    self.getNextProduct = function(product, circle){
        
        var getTargetProduct = function(categoryProducts){
            var index = getIndexOfProduct(categoryProducts, product);
            if (index > -1){
                var nextProduct = categoryProducts[index + 1];
                var targetProduct = !nextProduct && circle ?
                                    categoryProducts[0] : nextProduct || null;

                return targetProduct;
            }
        };

        return getPreviousOrNextProduct(product, circle, getTargetProduct);
    };

    /**
     * @method getPreviousProduct
     * @memberof cc.CouchService
     *
     * @description
     * Fetches the previous product within the product's category.
     * 
     * @param {object} product The product to find the neighbour of.
     * @return {object} Previous product.
     */
    self.getPreviousProduct = function(product, circle){

        var getTargetProduct = function(categoryProducts, baseProduct){
            var index = getIndexOfProduct(categoryProducts, baseProduct);
            if (index > -1){
                var previousProduct = categoryProducts[index - 1];
                var targetProduct = !previousProduct && circle ? 
                                    categoryProducts[categoryProducts.length - 1] : 
                                    previousProduct || null;

                return targetProduct;
            }
        };

        return getPreviousOrNextProduct(product, circle, getTargetProduct);
    };

    var getPreviousOrNextProduct = function(product, circle, productFindFn){
        var cachedProducts = products[product.categoryUrlId];

        if (cachedProducts){
            return $q.when(productFindFn(cachedProducts, product));
        }
        else {
            return  self.getProducts(product.categoryUrlId)
                        .then(function(catProducts){
                            return productFindFn(catProducts, product);
                        });
        }
    };

    var getIndexOfProduct = function(productTable, product){
        for (var i = 0; i < productTable.length; i++) {
            if (productComparer(productTable[i], product)){
                return i;
            }
        }

        return -1;
    };


    /**
     * @method getProduct
     * @memberof cc.CouchService
     *
     * @description
     * Fetches a single product. Notice that both the `categoryUrlId`
     * and the `productUrlId` need to be specified in order to get the product.
     * 
     * @param {int} categoryUrlId The urlId of the category the product belongs to.
     * @param {int} productUrlId The urlId of the product itself.
     *
     * @return {object} product
     */
    self.getProduct = function(categoryUrlId, productUrlId){
        if(!products[categoryUrlId]){
            return  self.getProducts(categoryUrlId)
                        .then(function(data){
                            return getProduct(data, productUrlId);
                        });
        }

        return $q.when(getProduct(products[categoryUrlId], productUrlId));
    };

    var getProduct = function(products, productUrlId){
        for (var i = 0; i < products.length; i++) {
            var product = products[i];
            if (product.urlKey === productUrlId){
                return product;
            }
        }

        return null;
    };

    var fetchAllCategories = function(){
        return $http({
            method: 'get',
            url: CATEGORY_JSON
        })  
        .then(function(data){
            var rootCategory = data.data;
            categoryMap = new cc.util.CategoryMap();
            categoryMap.rootCategory = rootCategory;
            augmentCategories(rootCategory);
            return rootCategory;
        });
    };

    var augmentCategories = function(categories){
        //we need to fix the urlId for the rootCategory to be empty
        categories.urlId = '';
        var iterator = new cc.util.TreeIterator(categories, 'children');
        iterator.iterateChildren(function(category, parent){
            category.parent = parent;
            category.image = MEDIA_FOLDER + category.urlId + "." + MEDIA_IMG_EXTENSION;
            category.hasChildren = category.children && category.children.length > 0;
            categoryMap.addCategory(category);
        });
    };

    return self;
});

/** * @name DeviceService
 * @namespace cc.DeviceService
 *
 * @description
 * This is a helper service that gives you methods to check for certain contexts
 * on touch devices etc.. It determines the state for the usage of flexbox as well
 * as things like position fixed support.
 */
cc.define('cc.DeviceService', function($window){
    var self = {};

    var ua = navigator.userAgent,
        htmlTag,
        uaindex,
        userOS,
        userOSver;

    var MODERN_FLEXBOX_SUPPORT = 'cc-supports-modern-flexbox';

    // determine OS
    if ( ua.match(/iPad/i) || ua.match(/iPhone/i) ){
        userOS = 'iOS';
        uaindex = ua.indexOf( 'OS ' );
    }
    else if ( ua.match(/Android/i) ){
        userOS = 'Android';
        uaindex = ua.indexOf( 'Android ' );
    }
    else{
        userOS = 'unknown';
    }

    // determine version
    if ( userOS === 'iOS'  &&  uaindex > -1 ){
        userOSver = ua.substr( uaindex + 3, 3 ).replace( '_', '.' );
    }
    else if ( userOS === 'Android'  &&  uaindex > -1 ){
        userOSver = ua.substr( uaindex + 8, 3 );
    }
    else {
        userOSver = 'unknown';
    }

    var dimensions = {};

    var updateDimension = function(){
        dimensions.width = $window.innerWidth;
        dimensions.height = $window.innerHeight;
    };

    updateDimension();

    $window.addEventListener("orientationchange", updateDimension, false);

    var versionStartsWith = function(str){
        var version = self.getOsVersion();
        return version.indexOf(str) === 0;
    };

    /**
     * @method isInPortraitMode
     * @memberof cc.DeviceService
     *
     * @description
     * Returns a bool indicating whether the decice is held in portrait mode.
     *
     * @return {object} HTMLDomObject
     */
    self.isInPortraitMode = function(){
        return dimensions.height > dimensions.width;
    };

    /**
     * @method isLandscapeMode
     * @memberof cc.DeviceService
     *
     * @description
     * Returns a bool indicating whether the decice is held in landscape mode.
     *
     * @return {object} HTMLDomObject
     */
    self.isInLandscapeMode = function(){
        return !self.isInPortraitMode();
    };

    /**
     * @method getHtmlTag
     * @memberof cc.DeviceService
     *
     * @description
     * Returns an HTMLDomObject for HTML.
     *
     * @return {object} HTMLDomObject
     */
    self.getHtmlTag = function(){
        htmlTag = htmlTag || document.getElementsByTagName('html')[0];
        return htmlTag;
    };

    /**
     * @method isTabletSiye
     * @memberof cc.DeviceService
     *
     * @description
     * Returns true if the current device is in "TabletSize". See SO link for more
     * information (http://stackoverflow.com/questions/6370690/media-queries-how-to-target-desktop-tablet-and-mobile).
     *
     * @return {boolean} Whether the device is in tablet size or not.
     */
    self.isTabletSize = function(){
        return $window.screen.width > 641;
    };

    /**
     * @method isStockAndroidBrowser
     * @memberof cc.DeviceService
     *
     * @description
     * Checks if browser is stock android browser or not.
     *
     * @return {boolean}
     */
    self.isStockAndroidBrowser = function(){
        return userOS === 'Android' && ua.indexOf("Chrome") < 0;
    };

    /**
     * @method flagOs
     * @memberof cc.DeviceService
     *
     * @description
     * Flags the current document with an SDK specific class depending on the OS
     * of the device.
     */
    self.flagOs = function(){
        var htmlTag = self.getHtmlTag();
        var version = self.getOsVersion();
        var majorVersion = version.length > 0 ? version[0] : '0';
        htmlTag.className += ' cc-os-' + self.getOs().toLowerCase() + ' cc-osv-' + majorVersion;
    };

    /**
     * @method flagPositionFixedSupport
     * @memberof cc.DeviceService
     *
     * @description
     * Flags the current document with an SDK specific class depending on given
     * position fixed support.
     */
    self.flagPositionFixedSupport = function(){
        var htmlTag = self.getHtmlTag();
        htmlTag.className += self.hasPositionFixedSupport() ? ' cc-supports-position-fixed' : ' cc-no-position-fixed';
    };

     /**
      * @method getUserAgent
      * @memberof cc.DeviceService
      *
      * @description
      *
      * @example
      *
      * @return {string} User agent currently in use
      */
    self.getUserAgent = function(){
        return ua;
    };
    
    /**
     * @method getOs
     * @memberof cc.DeviceService
     *
     * @description
     * Returns OS string.
     *
     * @return {string} Name of OS.
     */
    self.getOs = function(){
        return userOS;
    };

    /**
     * @method getOsVersion
     * @memberof cc.DeviceService
     *
     * @description
     * Returns OS version string.
     *
     * @return {string} Version of OS.
     */
    self.getOsVersion = function(){
        return userOSver;
    };

    /**
     * @method isAndroid2x
     * @memberof cc.DeviceService
     *
     * @description
     * Returns true if device os is Android and version starts with '2'.
     *
     * @return {bool}
     */
    self.isAndroid2x = function () {
      return self.getOs() === 'Android' && versionStartsWith('2');
    };

    /**
     * @method hasPositionFixedSupport
     * @memberof cc.DeviceService
     *
     * @description
     * Checks if the current device kinda supports position fixed.
     * We know, brother sniffing is bad, but for fixed toolbars, 
     * there is no easy solution. 
     *
     * @return {boolean}
     */
     self.hasPositionFixedSupport = function(){
        if (self.getOs() === 'Android'){
            //versions < 2.3 of Android have poor fixed support
            if (versionStartsWith('2')){
                if (versionStartsWith('2.2') || versionStartsWith('2.1') || versionStartsWith('2.0')){
                    return false;
                }
                else{
                    return true;
                }
            }
            //make all other versions except 1.x return true
            return !versionStartsWith(1);
        }
        else if (self.getOs() === 'iOS'){
            return  !versionStartsWith('1') &&
                    !versionStartsWith('2') &&
                    !versionStartsWith('3') &&
                    !versionStartsWith('4');
        }
    };

    /**
     * @method hasModernFlexboxSupport
     * @memberof cc.DeviceService
     *
     * @description
     * Checks if the browser has modern flexbox support or not.
     *
     * @return {boolean}
     */
    self.hasModernFlexboxSupport = function(){

        // Firefox currently has a flexbox bug
        // See http://stackoverflow.com/a/17435156/956278
        if ( ua.match(/Firefox/i) ) {
            return false;
        }

        var supportedValues =   [
                                    '-webkit-flex',
                                    '-moz-flex',
                                    '-o-flex',
                                    '-ms-flex',
                                    'flex'
                                ];

        var testSpan = document.createElement('span');
        supportedValues.forEach(function(value){
            testSpan.style.display = value;
        });

        return supportedValues.indexOf(testSpan.style.display) > -1;
    };

    /**
     * @method flagModernFlexboxSupport
     * @memberof cc.DeviceService
     *
     * @description
     * Flags the document with an SDK specific class for modern flexbox support.
     */
    self.flagModernFlexboxSupport = function(){
        var htmlTag = self.getHtmlTag();
        if (self.hasModernFlexboxSupport()){
            htmlTag.className += ' ' + MODERN_FLEXBOX_SUPPORT;
        }
    };

    return self;
});

/**
 * @name CategoryMap
 * @namespace cc.helper.CategoryMap
 *
 * @description
 * Category mapping service that sets up mappings between category urls and category
 * objects.
 */
cc.define('cc.util.CategoryMap', function(){

    'use strict';

    var self = {};

    var map = {};

    /**
     * @method addCategory
     * @memberof cc.helper.CategoryMap
     *
     * @description
     * Adds a new category to the map.
     *
     * @param {object} category A category object
     */
    self.addCategory = function(category){
        if (!map[category.urlId]){
            map[category.urlId] = category;
        }
        else{
            //if we had this category before but now have another one aliased with the same id
            //we have to look if this one has children. If it has children, than it should have
            //precedence

            if(category.children && category.children.length > 0){
                map[category.urlId] = category;
            }
        }
    };

    /**
     * @method getCategory
     * @memberof cc.CategoryMap
     *
     * @description
     * Returns a category by a given `urlId` from the map.
     *
     * @param {int} urlId Category url id.
     *
     * @return {object} Category object.
     */
    self.getCategory = function(urlId){
        return map[urlId];
    };

    return self;

});

/**
 * @name TreeIterator
 * @namespace cc.helper.TreeIterator
 *
 * @description
 * We only use the TreeIterator to built a HashMap for fast lookups.
 * So it doesn't really care if we use a depth first or a breadth first approach.
 */
cc.define('cc.util.TreeIterator', function(tree, childNodeProperty){

    'use strict';

    var me = this,
        continueIteration = true;
    
    /**
     * @method iterateChildren
     * @memberof cc.helper.TreeIterator
     *
     * @description
     * Iterates over a tree of children and applies a given function to
     * each node.
     *
     * @param {function} fn Map function
     */
    me.iterateChildren = function(fn){
        continueIteration = true;
        return _iterateChildren(tree, fn);
    };

    var _iterateChildren = function(rootCategory, fn, parent){
        continueIteration = fn(rootCategory, parent);

        if (rootCategory[childNodeProperty] && continueIteration !== false){
            rootCategory[childNodeProperty].forEach(function(category){
                if (continueIteration !== false){
                    _iterateChildren(category, fn, rootCategory);
                }
            });
        }
    };
});

/**
 * @name LoggingService
 * @namespace cc.LoggingService
 *
 * @description
 * This service abstracts the concrete console interface away. It provides the same
 * methods for logging like `.log()`, `.info()` etc..
 *
 * Use this service to log within your application.
 */
cc.define('cc.LoggingService', function(configService){
    var self = {};

    var enabled = configService.get('loggingEnabled', false);

    var doIfEnabled = function(fn){
        if (!enabled){
            return;
        }

        fn();
    };

    var dump = function(data){
        var output = '\n'; //allways start with a new line for better alignment

        data.forEach(function(line){
            //for a cleaner output we convert objects to beautified JSON
            output += cc.Util.isString(line) ? line : JSON.stringify(line, null, 4);
            output += '\n';
        });

        return output;
    };

    /**
     * @method info
     * @memberof cc.LogingService
     * @public
     *
     * @description
     * A `console.info()` wrapper to log some info in the console.
     *
     * @param {(array|string)} str String or array to log.
     */
    self.info = function(str){
        doIfEnabled(function(){
            if (cc.Util.isArray(str)){
                console.info(dump(str));
            }
            else{
                console.info(str);
            }
        });
    };

    /**
     * @method log
     * @memberof cc.LoggingService
     * @public
     *
     * @description
     * A `console.log()` wrapper to log to console.
     *
     * @param {(string|array)} str String or array to log.
     */
    self.log = function(str){
        doIfEnabled(function(){
            if (cc.Util.isArray(str)){
                console.log(dump(str));
            }
            else{
                console.log(str);
            }
        });
    };

    /**
     * @method warn
     * @memberof cc.LoggingService
     * @public
     *
     * @description
     * A `console.warn()` wrapper to log warnings to console.
     *
     * @param {(string|array)} str String or array to log.
     */
    self.warn = function(str){
        doIfEnabled(function(){
            if (cc.Util.isArray(str)){
                console.warn(dump(str));
            }
            else{
                console.warn(str);
            }
        });
    };

    /**
     * @method error
     * @memberof cc.LoggingService
     * @public
     *
     * @description
     * A `console.error()` wrapper to log errors to console.
     *
     * @param {(string|array)} str String or array to log.
     */
    self.error = function(str){
        doIfEnabled(function(){
            if (cc.Util.isArray(str)){
                console.error(dump(str));
            }
            else{
                console.error(str);
            }
        });
    };

    return self;
});

/**
 * @name MemoryStorageService
 * @namespace cc.MemoryStorageService
 *
 * @description
 * Simple memory storage service. Provides methods to get and set values in form
 * of simple key - value pairs.
 */
cc.define('cc.MemoryStorageService', function(){
    
    var _storage = {};

    /**
     * @method set
     * @memberof cc.MemoryStorageService
     *
     * @description
     * Sets a value by a given id.
     *
     * @param {string} id Identifier
     * @param {object} data Any kind of data to store under given id.
     */
    var set = function(id, data){
        _storage[id] = data;
    };

    /**
     * @method get
     * @memberof cc.MemoryStorageService
     *
     * @description
     * Gets a value by a given id.
     *
     * @param {string} id Identifier
     *
     * @return {object} Stored data.
     */
    var get = function(id){
        return _storage[id];
    };

    /**
     * @method remove
     * @memberof cc.MemoryStorageService
     *
     * @description
     * Removes a value by a given id.
     *
     * @param {string} id Identifier
     */
    var remove = function(id){
        delete _storage[id];
    };

    return {
        set: set,
        get: get,
        remove: remove
    };
});

/**
 * @name BasketItem
 * @namespace cc.models.BasketItem
 *
 * @description
 * A basket item model that represents basket items. This model provides some methods
 * to access information about the basket item such as the price or the variant id.
 */
cc.define('cc.models.BasketItem', function(){

    'use strict';

    var self = this;

    self.quantity = 0;

    return self;
});

/**
 * @method getPrice
 * @memberof cc.models.BasketItem
 *
 * @description
 * Returns the price of the basket item depending on the variant.
 *
 * @return {float} Price
 */
cc.models.BasketItem.prototype.getPrice = function(){
    return this.variant && cc.Util.isNumeric(this.variant.price) ? this.variant.price : this.product.price;
};

/**
 * @method getTotal
 * @memberof cc.models.BasketItem
 *
 * @description
 * Returns the total price of the basket item considering the quantity.
 *
 * @return {float} Total price
 */
cc.models.BasketItem.prototype.getTotal = function(){
    return cc.Util.round(this.quantity * this.getPrice(), 2);
};

/**
 * @method getVariantID
 * @memberof cc.models.BasketItem
 *
 * @description
 * Returns the variant id of the basket item if it exists.
 *
 * @return {int} Variant id.
 */
cc.models.BasketItem.prototype.getVariantID = function(){
    return this.variant ? this.variant.variantID : null;
};

/**
 * @method getOptionID
 * @memberof cc.models.BasketItem
 *
 * @description
 * Returns the option id of the basket item if it exists.
 *
 * @return {int} Option id.
 */
cc.models.BasketItem.prototype.getOptionID = function(){
    return cc.Util.isNumber(this.optionID) ? this.optionID : null;
};

/**
 * @name Product
 * @namespace cc.models.Product
 *
 * @description
 * A model that represents a Product object and adds convenient methods to it.
 */
cc.define('cc.models.Product', function(){});

/**
 * @method getImage
 * @memberof cc.models.Product
 *
 * @description
 * Returns the url to the product image by a given size. If no image exists in that
 * size, it returns a placeholder image url.
 *
 * @param {string} size Image size identifier.
 * 
 * @return {string} Image url.
 */
cc.models.Product.prototype.getImage = function(size){
    for (var i = 0; i < this.images.length; i++) {
        if (this.images[i].sizeName.toLowerCase() === size){
            return this.images[i].url;
        }
    }

    return cc.Config.mediaPlaceholder;
};

/**
 * @method getAllImages
 * @memberof cc.models.Product
 *
 * @description
 * Returns all images of the product in size 'large'.
 *
 * @return {array} Arraz of image urls.
 */
cc.models.Product.prototype.getAllImages = function(){

    if (!this._allImages){
        this._allImages = [{ url: this.getImage('large') }].concat(this.imagesAlt);
    }

    return this._allImages;
};

/**
 * @method hasMultipleImages
 * @memberof cc.models.Product
 *
 * @description
 * Returns true if a product supports multiple images.
 *
 * @return {boolean}
 */
cc.models.Product.prototype.hasMultipleImages = function(){
    return this.getAllImages().length > 0;
};

/**
 * @method getBasePriceInfo
 * @memberof cc.models.Product
 *
 * @description
 * Returns some additional information about the product.
 * TODO: This is pure shit. I need to talk to Felix got get that clean
 * It's only in here to keep some German clients happy that rely on it.
 * We need to make it more flexibile & localizable
 */
cc.models.Product.prototype.getBasePriceInfo = function(){
    if (this.custom1 > 0){
        if (this.custom3 === 'kg'){
            return 'entspricht ' + cc.Util.toFixed(this.custom1, 2) + ' € pro 1 Kilogramm (kg)';
        }
        else if (this.custom3 === 'St'){
            return 'entpricht ' + cc.Util.toFixed(this.custom1, 2) + ' € pro 1 Stück (St)';
        }
        else if (this.custom3 === 'L'){
            return 'entpricht ' + cc.Util.toFixed(this.custom1, 2) + ' € pro 1 Liter (l)';
        }
        else if (cc.Util.isString(this.custom3) && this.custom3.length > 0){
            return 'entpricht ' + cc.Util.toFixed(this.custom1, 2) + ' € pro ' + this.custom3;
        }
    }

    return '';
};

/**
 * @method hasOldPrice
 * @memberof cc.models.Product
 *
 * @description
 * Returns true if the product has an old price.
 *
 * @return {boolean}
 */
cc.models.Product.prototype.hasOldPrice = function(){
    return cc.Util.isNumeric(this.priceOld) && this.priceOld > 0;
};

/**
 * @method hasVariants
 * @memberof cc.models.Product
 *
 * @description
 * Returns true if the product supports variants.
 *
 * @return {boolean}
 */
cc.models.Product.prototype.hasVariants = function(){
    return this.variants && this.variants.length > 0;
};

/**
 * @method isOutOfStock
 * @memberof cc.models.Product
 *
 * @description
 * Returns true if the product is currently out of stock.
 *
 * @return {boolean}
 */
cc.models.Product.prototype.isOutOfStock = function(){

    //this means, it's always in stock
    if(this.qty === undefined || this.qty === null){
        return false;
    }

    // a product is considered out of stock if:

    // -it has no variants and the qty is less or equal zero
    // -it has variants and all of them have a stock of less or equal zero

    return (!this.hasVariants() && this.qty <= 0) || this.areAllVariantsOutOfStock();
};

/**
 * @method areAllVariantsOutOfStock
 * @memberof cc.models.Product
 *
 * @description
 * Requests if all variants of the product are out of stock.
 *
 * @return {boolean}
 */
cc.models.Product.prototype.areAllVariantsOutOfStock = function(){
    if(this.hasVariants()){
        return cc.Util.every(this.variants, function(variant){
            return variant.stock <= 0;
        });
    }

    return false;
};

/**
 * @name Observable
 * @namespace cc.Observable
 *
 * @description
 *
 */
cc.define('cc.Observable', function(){

    'use strict';

    var self = {
        mixin: function(obj, handlers) {
            // we store the list of handlers as a local variable inside the scope
            // so that we don't have to add random properties to the object we are
            // converting. (prefixing variables in the object with an underscore or
            // two is an ugly solution)
            //      we declare the variable in the function definition to use two less
            //      characters (as opposed to using 'var ').  I consider this an inelegant
            //      solution since smokesignals.convert.length now returns 2 when it is
            //      really 1, but doing this doesn't otherwise change the functionallity of
            //      this module, so we'll go with it for now
            handlers = {};

            // add a listener
            obj.on = function(eventName, handler) {
                // either use the existing array or create a new one for this event
                //      this isn't the most efficient way to do this, but is the shorter
                //      than other more efficient ways, so we'll go with it for now.
                (handlers[eventName] = handlers[eventName] || [])
                    // add the handler to the array
                    .push(handler);

                return obj;
            }

            // add a listener that will only be called once
            obj.once = function(eventName, handler) {
                // create a wrapper listener, that will remove itself after it is called
                function wrappedHandler() {
                    // remove ourself, and then call the real handler with the args
                    // passed to this wrapper
                    handler.apply(obj.off(eventName, wrappedHandler), arguments);
                }
                // in order to allow that these wrapped handlers can be removed by
                // removing the original function, we save a reference to the original
                // function
                wrappedHandler.h = handler;

                // call the regular add listener function with our new wrapper
                return obj.on(eventName, wrappedHandler);
            }

            // remove a listener
            obj.off = function(eventName, handler) {
                // loop through all handlers for this eventName, assuming a handler
                // was passed in, to see if the handler passed in was any of them so
                // we can remove it
                //      it would be more efficient to stash the length and compare i
                //      to that, but that is longer so we'll go with this.
                for (var list = handlers[eventName], i = 0; handler && list && list[i]; i++) {
                    // either this item is the handler passed in, or this item is a
                    // wrapper for the handler passed in.  See the 'once' function
                    list[i] != handler && list[i].h != handler ||
                        // remove it!
                    list.splice(i--,1);
                }
                // if i is 0 (i.e. falsy), then there are no items in the array for this
                // event name (or the array doesn't exist)
                if (!i) {
                    // remove the array for this eventname (if it doesn't exist then
                    // this isn't really hurting anything)
                    delete handlers[eventName];
                }
                return obj;
            }

            obj.emit = function(eventName) {
                // loop through all handlers for this event name and call them all
                //      it would be more efficient to stash the length and compare i
                //      to that, but that is longer so we'll go with this.
                for(var list = handlers[eventName], i = 0; list && list[i];) {
                    list[i++].apply(obj, list.slice.call(arguments, 1));
                }
                return obj;
            }

            return obj;
        }
    };

    return self;
});

cc.observable = new cc.Observable();

/**
 * @name PagesService
 * @namespace cc.PagesService
 *
 * @description
 * This service takes care of accessing static page data.
 */
cc.define('cc.PagesService', function($http, $q, configService){

    'use strict';

    var self = {};

    var RESOURCE_URL = configService.get('resourceUrl') + 'html/',
        ABOUT_PAGES  = configService.get('aboutPages');

    /**
     * @method getPage
     * @memberof cc.PagesService
     *
     * @description
     * Returns a page object by a given id.
     *
     * @param {int} id Page id.
     * @return {object} Page object.
     */
    self.getPage = function(id){
        return $http
                .get(RESOURCE_URL + id + '.html')
                .then(function(result){
                    if (result.data){

                        //we don't want to directly alter the page config, so we create a copy
                        var pageConfig = cc.Util.clone(self.getPageConfig(id));

                        pageConfig.content = result.data;

                        return pageConfig;
                    }
                });
    };

    /**
     * @method getPageConfig
     * @memberof cc.PagesService
     * 
     * @description
     * Returns a page configuration object by a given page id.
     *
     * @param {int} id Page id.
     * @return {object} Page configuration
     */
    self.getPageConfig = function(id){
        var page = ABOUT_PAGES.filter(function(page){
            return page.id === id;
        });

        return page.length > 0 && page[0];
    };

    return self;
});

cc.define('cc.QService', function(){

    'use strict';

    /**
     * Constructs a promise manager.
     *
     * @param {function(function)} nextTick Function for executing functions in the next turn.
     * @param {function(...*)} exceptionHandler Function into which unexpected exceptions are passed for
     *     debugging purposes.
     * @returns {object} Promise manager.
     */
    function qFactory(nextTick, exceptionHandler) {

      /**
       * @ngdoc
       * @name ng.$q#defer
       * @methodOf ng.$q
       * @description
       * Creates a `Deferred` object which represents a task which will finish in the future.
       *
       * @returns {Deferred} Returns a new instance of deferred.
       */
      var defer = function() {
        var pending = [],
            value, deferred;

        deferred = {

          resolve: function(val) {
            if (pending) {
              var callbacks = pending;
              pending = undefined;
              value = ref(val);

              if (callbacks.length) {
                nextTick(function() {
                  var callback;
                  for (var i = 0, ii = callbacks.length; i < ii; i++) {
                    callback = callbacks[i];
                    value.then(callback[0], callback[1], callback[2]);
                  }
                });
              }
            }
          },


          reject: function(reason) {
            deferred.resolve(reject(reason));
          },


          notify: function(progress) {
            if (pending) {
              var callbacks = pending;

              if (pending.length) {
                nextTick(function() {
                  var callback;
                  for (var i = 0, ii = callbacks.length; i < ii; i++) {
                    callback = callbacks[i];
                    callback[2](progress);
                  }
                });
              }
            }
          },


          promise: {
            then: function(callback, errback, progressback) {
              var result = defer();

              var wrappedCallback = function(value) {
                try {
                  result.resolve((callback || defaultCallback)(value));
                } catch(e) {
                  exceptionHandler(e);
                  result.reject(e);
                }
              };

              var wrappedErrback = function(reason) {
                try {
                  result.resolve((errback || defaultErrback)(reason));
                } catch(e) {
                  exceptionHandler(e);
                  result.reject(e);
                }
              };

              var wrappedProgressback = function(progress) {
                try {
                  result.notify((progressback || defaultCallback)(progress));
                } catch(e) {
                  exceptionHandler(e);
                }
              };

              if (pending) {
                pending.push([wrappedCallback, wrappedErrback, wrappedProgressback]);
              } else {
                value.then(wrappedCallback, wrappedErrback, wrappedProgressback);
              }

              return result.promise;
            },
            always: function(callback) {
              
              function makePromise(value, resolved) {
                var result = defer();
                if (resolved) {
                  result.resolve(value);
                } else {
                  result.reject(value);
                }
                return result.promise;
              }
              
              function handleCallback(value, isResolved) {
                var callbackOutput = null;            
                try {
                  callbackOutput = (callback ||defaultCallback)();
                } catch(e) {
                  return makePromise(e, false);
                }            
                if (callbackOutput && callbackOutput.then) {
                  return callbackOutput.then(function() {
                    return makePromise(value, isResolved);
                  }, function(error) {
                    return makePromise(error, false);
                  });
                } else {
                  return makePromise(value, isResolved);
                }
              }
              
              return this.then(function(value) {
                return handleCallback(value, true);
              }, function(error) {
                return handleCallback(error, false);
              });
            }
          }
        };

        return deferred;
      };


      var ref = function(value) {
        if (value && value.then) return value;
        return {
          then: function(callback) {
            var result = defer();
            nextTick(function() {
              result.resolve(callback(value));
            });
            return result.promise;
          }
        };
      };


      /**
       * @ngdoc
       * @name ng.$q#reject
       * @methodOf ng.$q
       * @description
       * Creates a promise that is resolved as rejected with the specified `reason`. This api should be
       * used to forward rejection in a chain of promises. If you are dealing with the last promise in
       * a promise chain, you don't need to worry about it.
       *
       * When comparing deferreds/promises to the familiar behavior of try/catch/throw, think of
       * `reject` as the `throw` keyword in JavaScript. This also means that if you "catch" an error via
       * a promise error callback and you want to forward the error to the promise derived from the
       * current promise, you have to "rethrow" the error by returning a rejection constructed via
       * `reject`.
       *
       * <pre>
       *   promiseB = promiseA.then(function(result) {
       *     // success: do something and resolve promiseB
       *     //          with the old or a new result
       *     return result;
       *   }, function(reason) {
       *     // error: handle the error if possible and
       *     //        resolve promiseB with newPromiseOrValue,
       *     //        otherwise forward the rejection to promiseB
       *     if (canHandle(reason)) {
       *      // handle the error and recover
       *      return newPromiseOrValue;
       *     }
       *     return $q.reject(reason);
       *   });
       * </pre>
       *
       * @param {*} reason Constant, message, exception or an object representing the rejection reason.
       * @returns {Promise} Returns a promise that was already resolved as rejected with the `reason`.
       */
      var reject = function(reason) {
        return {
          then: function(callback, errback) {
            var result = defer();
            nextTick(function() {
              result.resolve((errback || defaultErrback)(reason));
            });
            return result.promise;
          }
        };
      };


      /**
       * @ngdoc
       * @name ng.$q#when
       * @methodOf ng.$q
       * @description
       * Wraps an object that might be a value or a (3rd party) then-able promise into a $q promise.
       * This is useful when you are dealing with an object that might or might not be a promise, or if
       * the promise comes from a source that can't be trusted.
       *
       * @param {*} value Value or a promise
       * @returns {Promise} Returns a promise of the passed value or promise
       */
      var when = function(value, callback, errback, progressback) {
        var result = defer(),
            done;

        var wrappedCallback = function(value) {
          try {
            return (callback || defaultCallback)(value);
          } catch (e) {
            exceptionHandler(e);
            return reject(e);
          }
        };

        var wrappedErrback = function(reason) {
          try {
            return (errback || defaultErrback)(reason);
          } catch (e) {
            exceptionHandler(e);
            return reject(e);
          }
        };

        var wrappedProgressback = function(progress) {
          try {
            return (progressback || defaultCallback)(progress);
          } catch (e) {
            exceptionHandler(e);
          }
        };

        nextTick(function() {
          ref(value).then(function(value) {
            if (done) return;
            done = true;
            result.resolve(ref(value).then(wrappedCallback, wrappedErrback, wrappedProgressback));
          }, function(reason) {
            if (done) return;
            done = true;
            result.resolve(wrappedErrback(reason));
          }, function(progress) {
            if (done) return;
            result.notify(wrappedProgressback(progress));
          });
        });

        return result.promise;
      };


      function defaultCallback(value) {
        return value;
      }


      function defaultErrback(reason) {
        return reject(reason);
      }


      /**
       * @ngdoc
       * @name ng.$q#all
       * @methodOf ng.$q
       * @description
       * Combines multiple promises into a single promise that is resolved when all of the input
       * promises are resolved.
       *
       * @param {Array.<Promise>|Object.<Promise>} promises An array or hash of promises.
       * @returns {Promise} Returns a single promise that will be resolved with an array/hash of values,
       *   each value corresponding to the promise at the same index/key in the `promises` array/hash. If any of
       *   the promises is resolved with a rejection, this resulting promise will be resolved with the
       *   same rejection.
       */
      function all(promises) {
        var deferred = defer(),
            counter = 0,
            results = isArray(promises) ? [] : {};

        forEach(promises, function(promise, key) {
          counter++;
          ref(promise).then(function(value) {
            if (results.hasOwnProperty(key)) return;
            results[key] = value;
            if (!(--counter)) deferred.resolve(results);
          }, function(reason) {
            if (results.hasOwnProperty(key)) return;
            deferred.reject(reason);
          });
        });

        if (counter === 0) {
          deferred.resolve(results);
        }

        return deferred.promise;
      }

      return {
        defer: defer,
        reject: reject,
        when: when,
        all: all
      };
}


    return qFactory(function(fn){
        //This is because this service is an Angular rip off. In Angular they
        //use this hook to trigger the dirty checking. For us it's a noop.
        //We just don't want to change the code too much so that we can maintain
        //compatibility to the Angular $q service easily.
        fn();
    }, function(err){
        //That's the exceptionHandler. For now, just dump all exceptions on the console
        console.log(err);
    });
});
/**
 * @name SearchService
 * @namespace cc.SearchService
 *
 * @description
 * Search service which let's you query against the CouchCommerce API to search
 * for products.
 */
cc.define('cc.SearchService', function(configService, $http, $q, applier){

    'use strict';

    var self                = {},
        lastRequestToken    = null,
        storeCode           = configService.get('storeCode'),
        debounceMs          = configService.get('searchDebounceMs', 300),
        endpoint            = configService.get('searchUrl') + '?callback=JSON_CALLBACK&len=100';

    /**
     * @method search
     * @memberof cc.SearchService
     *
     * @description
     * Searches for `searchStr` and groups the results if `grouping` is truthy.
     * This search is promise based to let you have flow control. Therefore it
     * returns a promise that gets resolved with the search results.
     *
     * @param {string} searchStr A search string.
     * @param {boolean} grouping Whether to group the results or not.
     *
     * @return {Promise} A promise with the search results.
     */
    self.search = function(searchStr, grouping){

        var deferredResponse = $q.defer();

        debouncedInnerSearch(deferredResponse, searchStr, grouping);

        return deferredResponse.promise;
    };

    var innerSearch = function(deferredResponse, searchStr, grouping){

        lastRequestToken = cc.Util.createGuid();

        var requestToken = lastRequestToken;

        if (!searchStr){
            deferredResponse.resolve({
                data: {
                    results: [],
                    groupedResults: []
                }
            });

        }
        else{
            $http({
                method: 'JSONP',
                url: endpoint,
                params: {
                    q: createSearchCommand(normalizeUmlauts(searchStr)),
                    fetch: 'text, categoryUrlKey, categoryName, productUrlKey, productImageUrl'
                }
            })
            .then(function(response){
                if (requestToken === lastRequestToken){
                    if (grouping){
                        groupResult(response, grouping);
                    }
                    deferredResponse.resolve(response);
                }
            });
        }

        //in an angular context, we need to call the applier to
        //make $http run. For non angular builds, no applier is needed.
        if(applier){
            applier();
        }

        return deferredResponse.promise;
    };

    var groupResult = function(response, grouping){
        var results = response.data.results;
        var grouped = results.reduce(function(prev, curr, index, arr) {
                            if (!prev[curr.categoryUrlKey]){
                                var group = prev[curr.categoryUrlKey] = {
                                    groupKey: curr.categoryUrlKey,
                                    groupText: curr.categoryName,
                                    items: []
                                };

                                prev.items.push(group);
                            }

                            prev[curr.categoryUrlKey].items.push(curr);

                            return prev;

                        }, {items: []});
        //we only care about the array. The object was just for fast lookups!
        response.data.groupedResults = grouped.items;
    };

    var debouncedInnerSearch = cc.Util.debounce(innerSearch, debounceMs);

    var createSearchCommand = function(searchStr){
        var reverseString = searchStr.split('').reverse().join('');
        return '(text:' + searchStr + '* OR reverse_text:' + reverseString + '*) AND storeCode:' + storeCode;
    };

    var normalizeUmlauts = function(searchStr){
        return searchStr
                    .replace(/[áàâä]/g, 'a')
                    .replace(/[úùûü]/g, 'u')
                    .replace(/[óòôö]/g, 'o')
                    .replace(/[éèêë]/g, 'e')
                    .replace(/[ß]/g, 'ss');
    };

    return self;
});

/**
 * @name LocalStorageService
 * @namespace cc.LocalStorageService
 *
 * @description
 * We just wrap store.js in a service here.
 */
cc.define('cc.LocalStorageService', function(){
    return store;
});

/**
 * @name GoogleAnalyticsTracker
 * @namespace cc.tracker.GoogleAnalyticsTracker
 *
 * @description
 * A Google Analytics Tracker abstraction layer to connect to the SDK's
 * tracker interface.
 */
cc.define('cc.tracker.GoogleAnalyticsTracker', function(options) {
    'use strict';

    var self = {};

    /**
     * @method setup
     * @memberof cc.tracker.GoogleAnalyticsTracker
     *
     * @description
     * Sets up Google Analytics tracking code snippet with provided client
     * information like account number and domain name.
     */
    self.setup = function() {
        var _gaq = self._gaq = window._gaq = window._gaq || [];

        _gaq.push(['_setAccount', options.accountNumber]);
        _gaq.push(['_setDomainName', options.domainName]);
        _gaq.push(['_setAllowLinker', true]);

        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    };

    /**
     * @method trackEvent
     * @memberof cc.tracker.GoogleAnalyticsTracker
     *
     * @description
     * Explicit event tracking. This method pushes tracking data
     * to Google Analytics.
     *
     * @param {object} eventData Event data object.
     */
    self.trackEvent = function(eventData) {

        eventData.category = eventData.category || '';
        eventData.action = eventData.action || '';
        eventData.label = eventData.label || '';
        eventData.value = eventData.value || '';

        var dataToBePushed = [];

        if (eventData.category === 'pageView') {
            dataToBePushed.push('_trackPageview');
            dataToBePushed.push(eventData.label);
        }
        else {
            // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
            dataToBePushed.push('_trackEvent');
            dataToBePushed.push(eventData.category);
            dataToBePushed.push(eventData.action);
            dataToBePushed.push(eventData.label);

            // value is optional
            if (eventData.value) {
                dataToBePushed.push(eventData.value);
            }

            if ( eventData.action === 'google_conversion' && options.conversionId ) {
                var url = 'http://www.googleadservices.com/pagead/conversion/'+
                    options.conversionId+'/?value='+eventData.value+'&label='+
                    options.conversionLabel+'&guid=ON&script=0';
                var image = new Image(1,1);
                image.src = url;
            }
        }

        _gaq.push(dataToBePushed);

    };

    /**
     * @method trackEvent
     * @memberof cc.tracker.GoogleAnalyticsTracker
     *
     * @description
     * Pushes transaction data using the Google Analytics Ecommerce Tracking API
     *
     * @param {object} transactionData Transaction data object.
     */
    self.trackTransaction = function(transactionData) {
        _gaq.push(['_gat._anonymizeIp']);
        _gaq.push(['_addTrans',
            transactionData.token,               // transaction ID - required
            location.host,                       // affiliation or store name
            transactionData.totals.subtotal,     // total - required; Shown as "Revenue" in the
                                                 // Transactions report. Does not include Tax and Shipping.
            transactionData.totals.vat,          // tax
            transactionData.totals.shipping,     // shipping
            '',                                  // city
            '',                                  // state or province
            transactionData.billing.countryname, // country
        ]);

        transactionData.items.forEach(function(item) {
            _gaq.push(['_addItem',
                transactionData.token,           // transaction ID - necessary to associate item with transaction
                item.productId,                  // SKU/code - required
                item.name,                       // product name - necessary to associate revenue with product
                '',                              // category or variation
                item.price,                      // unit price - required
                item.qty                         // quantity - required
            ]);
        });

        _gaq.push(['_trackTrans']);

    };

    return self;
});

/**
 * @name TrackingService
 * @namespace cc.TrackingService
 *
 * @description
 * Abstraction layer to communicate with concrete tracker services
 * like Google Analytics.
 */
cc.define('cc.TrackingService', function($window, $http, configService){
    'use strict';

    var self = {};
    var trackers = [];

    /**
     * @method addTracker
     * @memberof cc.TrackingService
     *
     * @description
     * Adds a concrete tracker service implementation and also takes care
     * of the setup. It'll throw exceptions if the tracker service
     * doesn't implement the needed API.
     *
     * @param {object} tracker Concrete tracker implementation.
     */
    self.addTracker = function(tracker) {

        if (!tracker.setup){
            throw new Error('tracker must implement a setup method');
        }

        if (!tracker.trackEvent){
            throw new Error('tracker must implement a trackEvent method');
        }

        if (!tracker.trackTransaction){
            throw new Error('tracker must implement a trackTransaction method');
        }

        tracker.setup();

        trackers.push(tracker);
    };

    /**
     * @method trackEvent
     * @memberof cc.TrackingService
     *
     * @description
     * Forces all registered trackers to track an event.
     *
     * @param {object} eventData Event data object.
     */
    self.trackEvent = function(eventData) {
        trackers.forEach(function(tracker){
            tracker.trackEvent(eventData);
        });
    };

    /**
     * @method trackTransaction
     * @memberof cc.TrackingService
     *
     * @description
     * First requests information about a token from the backend, then
     * forces all registered trackers to track the associated transaction.
     *
     * @param {string} token.
     */
    self.trackTransaction = function(token) {

        var requestTransactionDataUrl = configService.get('checkoutUrl') + 'summaryfin.php';

        $http.get(requestTransactionDataUrl+'?token='+token+'&details=get')
        .then(function(response){
            var transactionData = cc.Util.toJson(response.data);

            transactionData.token = token;

            trackers.forEach(function(tracker){
                tracker.trackTransaction(transactionData);
            });
        });

    };

    return self;
});

/**
 * @name UrlConstructionService
 * @namespace cc.UrlConstructionService
 *
 * @description
 * As the name says. This service provides methods to construct URLs for
 * different use cases.
 */
cc.define('cc.UrlConstructionService', function(configService){
    var self = {};

    /**
     * @method createUrlForProducts
     * @memberof cc.UrlConstructionService
     *
     * @description
     * Creates url for products.
     *
     * @param {int} categoryUrlId Category url id.
     * @return {string} Url
     */
    self.createUrlForProducts = function(categoryUrlId){
        return '/cat/' + categoryUrlId + '/products';
    };

    /**
     * @method createUrlForProduct
     * @memberof cc.UrlConstructionService
     *
     * @description
     * Creates url for a product.
     *
     * @param {product} product Product object.
     * @return {string} Url
     */
    self.createUrlForProduct = function(product){
        return '/cat/' + product.categoryUrlId + '/product/' + product.urlKey;
    };

    /**
     * @method createUrlForCategory
     * @memberof cc.UrlConstructionService
     *
     * @description
     * Creates url for a category.
     *
     * @param {int} categoryUrlId Category url id.
     * @return {string} Url
     */
    self.createUrlForCategory = function(categoryUrlId){
        return '/cat/' + categoryUrlId;
    };

    /**
     * @method createUrlForRootCategory
     * @memberof cc.UrlConstructionService
     *
     * @description
     * Creates url for root category.
     *
     * @return {string} Url
     */
    self.createUrlForRootCategory = function(){
        return '';
    };

    /**
     * @method createUrlForCart
     * @memberof cc.UrlConstructionService
     *
     * @description
     * Creates url for cart.
     *
     * @return {string} Url
     */
    self.createUrlForCart = function(){
        return '/cart';
    };

    /**
     * @method createUrlForCheckout
     * @memberof cc.UrlConstructionService
     *
     * @description
     * Creates url for checkout.
     *
     * @return {string} Url
     */
    self.createUrlForCheckout = function(){
        return '/checkout';
    };

    /**
     * @method createUrlForSummary
     * @memberof cc.UrlConstructionService
     *
     * @description
     * Creates url for summary.
     *
     * @param {string} token Summary token.
     * @return {string} Url
     */
    self.createUrlForSummary = function(token){
        return '/summary/' + token;
    };

    /**
     * @method createUrlForShippingCostsPage
     * @memberof cc.UrlConstructionService
     *
     * @description
     * Creates url for shipping costs page.
     *
     * @return {string} Url
     */
    self.createUrlForShippingCostsPage = function(){
        return '/pages/' + configService.get('linkShippingCosts', '');
    };

    return self;
});

/**
 * @name UrlParserService
 * @namespace cc.UrlParserService
 *
 * @description
 * This service provides a clean interface when it comes to accessing url ids
 * for categories and products.
 */
cc.define('cc.UrlParserService', function($location){
    var self = {};

    var views = {
        product: /\/cat\/.*\/product\//i,
        products: /\/cat\/.*\/products/i,
        categories: /\/cat\/[^/]+$/i
    };

    var utilityRegex = {
        urlBeforeCategory: /.*cat\//,
        urlBeforeProduct: /.*\/product\//,
        urlRightFromSlash: /\/.*/
    };

    /**
     * @method isView
     * @memberof cc.UrlParserService
     *
     * @description
     * Returns true if given `viewName` is a view.
     *
     * @param {string} viewName View name.
     * @return {boolean}
     */
    self.isView = function(viewName){
        var regex = views[viewName];

        if(!regex){
            throw new Error(viewName + "unknown");
        }

        return regex.test($location.path());
    };

    /**
     * @method isRootCategory
     * @memberof cc.UrlParserService
     *
     * @description
     * Returns true if current location path is a root category.
     *
     * @return {boolean}
     */
    self.isRootCategory = function(){
        var path = $location.path();
        return path === '/' || path === '/cat/' ;
    };

    /**
     * @method getCategoryUrlId
     * @memberof cc.UrlParserService
     * 
     * @description
     * Extracts a category url id from a URL for you and returns it.
     *
     * @return {string} Category url id.
     */
    self.getCategoryUrlId = function(){
        return $location.path()
                        .replace(utilityRegex.urlBeforeCategory,'')
                        .replace(utilityRegex.urlRightFromSlash, '');
    };

    /**
     * @method getProductUrlId
     * @memberof cc.UrlParserService
     *
     * @description
     * Extracts a Product url id from a URL for you and returns it.
     *
     * @return {string} Product url id.
     */
    self.getProductUrlId = function(){
        return $location.path()
                        .replace(utilityRegex.urlBeforeProduct,'')
                        .replace(utilityRegex.urlRightFromSlash, '');
    };

    return self;
});

/**
 * @name UserService
 * @namespace cc.UserService
 *
 * @description
 * User related service that let's you access things like billing addresses, shipping
 * addresses and similar things.
 */
cc.define('cc.UserService', function(storageService, configService){

    'use strict';

    var self = {},
        STORE_PREFIX = 'basketService_',
        STORE_INVOICE_ADDRESS_KEY = STORE_PREFIX + 'invoiceAddress',
        STORE_SHIPPING_ADDRESS_KEY = STORE_PREFIX + 'shippingAddress';

    /**
     * @method getInvoiceAddress
     * @memberof cc.UserService
     *
     * @description
     * Gets the invoice address for the user.
     *
     * @return {object} address Address object.
     */
    self.getInvoiceAddress = function(){
        var address = storageService.get(STORE_INVOICE_ADDRESS_KEY);

        if (!address){
            address = {
                country: configService.getDefaultCountry()
            };

            self.updateInvoiceAddress(address);
        }

        return address;
    };

    /**
     * @method updateInvoiceAddress
     * @memberof cc.Updates
     *
     * @description
     * Creates/Updates the invoice address for the user.
     *
     * @param {object} invoiceAddress Invoice address object.
     */
    self.updateInvoiceAddress = function(invoiceAddress){
        return storageService.set(STORE_INVOICE_ADDRESS_KEY, invoiceAddress);
    };

    /**
     * @method getShippingAddress
     * @memberof cc.UserService
     *
     * @description
     * Gets the shipping address for the user.
     *
     * @return {object} shipping address object.
     */
    self.getShippingAddress = function(){
        var address = storageService.get(STORE_SHIPPING_ADDRESS_KEY);

        if(!address){
            address = {
                country: configService.getDefaultCountry()
            };
            self.updateInvoiceAddress(address);
        }

        return address;
    };

    /**
     * @method updateShippingAddress
     * @memberof cc.UserService
     *
     * @description
     * Creates/Updates the shipping address for the user.
     *
     * @param {object} invoiceAddress
     */
    self.updateShippingAddress = function(invoiceAddress){
        return storageService.set(STORE_SHIPPING_ADDRESS_KEY, invoiceAddress);
    };

    return self;
});

/**
 * @name Util
 * @namespace cc.Util
 *
 * @description
 * Namespace containing utility functions for compatibility stuff etc.
 *
 */
cc.Util = {
    /**
     * @method isToFixedBroken
     * @memberof cc.Util
     *
     * @description
     * Checks if the <code>toFixed()</code> function in the current JavaScript
     * environment is broken or not. For more info see {@link http://docs.sencha.com/touch/2.2.0/source/Number2.html#Ext-Number-method-toFixed }.
     *
     * @return {boolean} Whether its broken or not.
     */
    isToFixedBroken: (0.9).toFixed() !== '1',
    indicatorObject: {},

    /**
     * @member {object} objectTypes
     * @memberof cc.Util
     *
     * @description
     * Used to determine if values are of the language type Object
     */
    objectTypes: {
        'boolean': false,
        'function': true,
        'object': true,
        'number': false,
        'string': false,
        'undefined': false
    },

    /**
     * @method domReady
     * @memberof cc.Util
     *
     * @description
     * Takes a function and executes it if the document is ready at this point.
     * If its not, it registers the given function as callback.
     *
     * @param {function} fn Callback function to execute once DOM is ready.
     */
    domReady: function(fn){
        if(document.readyState === "complete") {
            fn()
        }
        else {
            window.addEventListener("load", fn, false);
        }
    },
    /**
     * @method round
     * @memberof cc.Util
     *
     * @description
     * Rounds a given value by a number of given places and returns it.
     *
     * @param {(float|number)} value Value to be round.
     * @param {int} places Number of places to round the value.
     *
     * @return {float} Rounded value
     */
    round: function(value, places){
        var multiplier = Math.pow(10, places);
        return (Math.round(value * multiplier) / multiplier);
    },
    /**
     * @method toFixed
     * @memberof cc.Util
     *
     * @description
     * Transformes a given value to a fixed value by a given precision.
     *
     * @param {(number|float)} value Value to fix.
     * @param {number} precision Precision.
     *
     * @return {number} Transformed fixed value.
     */
    toFixed: function(value, precision){

        value = cc.Util.isString(value) ? parseFloat(value) : value;

        if (cc.Util.isToFixedBroken) {
            precision = precision || 0;
            var pow = Math.pow(10, precision);
            return (Math.round(value * pow) / pow).toFixed(precision);
        }

        return value.toFixed(precision);
    },
    /**
     * @method clone
     * @memberof cc.Util
     *
     * @description
     * This method is useful for cloning complex (read: nested) objects without
     * having references from the clone to the original object.
     * (See {@link http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object}).
     *
     * @param {object} obj Object to clone.
     * @return {object} A clone of the given object.
     */
    clone: function(obj) {
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    },
    /**
     * @method extend
     * @memberof cc.Util
     *
     * @description
     * Extends the given object by members of additional given objects.
     *
     * @param {object} dst Destination object to extend.
     *
     * @return {object} Extended destination object.
     */
    extend: function(dst) {
        //strange thing, we can't use forOwn here because
        //phantomjs raises TypeErrors that don't happen in the browser
        for (var i = 0; i < arguments.length; i++) {
            var obj = arguments[i];
            if (obj !== dst){
                for (key in obj){
                    dst[key] = obj[key];
                }
            }
        }
        return dst;
    },
    /*jshint eqeqeq:true, -:true*/
    //this method is ripped out from lo-dash
    /*jshint eqeqeq:false*/
    createCallback: function(func, thisArg, argCount) {
      if (func === null) {
        return identity;
      }
      var type = typeof func;
      if (type != 'function') {
        if (type != 'object') {
          return function(object) {
            return object[func];
          };
        }
        var props = keys(func);
        return function(object) {
          var length = props.length,
              result = false;
          while (length--) {
            if (!(result = isEqual(object[props[length]], func[props[length]], cc.Util.indicatorObject))) {
              break;
            }
          }
          return result;
        };
      }
      if (typeof thisArg == 'undefined') {
        return func;
      }
      if (argCount === 1) {
        return function(value) {
          return func.call(thisArg, value);
        };
      }
      if (argCount === 2) {
        return function(a, b) {
          return func.call(thisArg, a, b);
        };
      }
      if (argCount === 4) {
        return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
      }
      return function(value, index, collection) {
        return func.call(thisArg, value, index, collection);
      };
    },
    /*jshint eqeqeq:true*/
    //this method is ripped out from lo-dash
    findKey: function(object, callback, thisArg) {
      var result;
      callback = cc.Util.createCallback(callback, thisArg);
      cc.Util.forOwn(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    },
    find: function(object, callback, thisArg) {
      var result;
      callback = cc.Util.createCallback(callback, thisArg);
      cc.Util.forOwn(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = value;
          return false;
        }
      });
      return result;
    },
    every: function(collection, callback, thisArg){
        var result = true;

        callback = cc.Util.createCallback(callback, thisArg);

        cc.Util.forOwn(collection, function(value, key, object){
            if (!callback(value, key, object)){
                result = false;
                return false;
            }
        });

        return result;
    },
    //this method is ripped out from lo-dash
    forOwn: function(collection, callback) {
        var index,
            iterable = collection,
            result = iterable;

        if (!iterable) {
            return result;
        }

        if (!cc.Util.objectTypes[typeof iterable]) {
            return result;
        }

        for (index in iterable) {
            if (Object.prototype.hasOwnProperty.call(iterable, index)) {
                if (callback(iterable[index], index, collection) === false) {
                    return result;
                }
            }
        }
        return result;
    },
    debounce: function(func, wait, immediate) {
      var timeout, result;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(context, args);
        return result;
      };
    },
    isObject: function(value){
        return typeof value === 'object';
    },
    isNumber: function(value){
      return typeof value === 'number';
    },
    isNumeric: function(value){
      return !isNaN(parseFloat(value)) && isFinite(value);
    },
    isArray: function(value){
        return toString.call(value) === '[object Array]';
    },
    isFunction: function(value){
        return typeof value === 'function';
    },
    isString: function(value){
        return typeof  value === 'string';
    },
    isUndefined: function(value){
        return typeof value === 'undefined';
    },
    createGuid: function(){
      //http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
    },
    capitalize: function(str){
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    Array: {
        /**
        * @method remove
        * @public
        *
        * @description
        * Removes a given item from a given array and returns the manipulated
        * array.
        *
        * @example
        * var arr = ['foo', 'bar'];
        *
        * var newArr = cc.UtilArray.remove(arr, 'foo');
        *
        * @param {array} arr An array.
        * @param {object} item The item to remove from the array.
        *
        * @return {array} Manipulated array.
        */
        remove: function(arr, item){
            var index = arr.indexOf(item);
            arr.splice(index, 1);
            return arr;
        }
    },

    // The backend is not returning valid JSON.
    // It sends it wrapped with parenthesis.
    //
    // This function will become obselete soon,
    // see https://github.com/couchcommerce/checkout-api/issues/2
    toJson: function(str){

        if (!str || !str.length || str.length < 2){
            return null;
        }

        var jsonStr = str.substring(1, str.length -1);

        return JSON.parse(jsonStr);
    }
};

//we put this here instead of in an seperate file so that the
//order of files doesn't matter for concatenation
cc.Util.domReady(function(){
    FastClick.attach(document.body);
});

/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 0.6.11
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specificed layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 */
function FastClick(layer) {
    'use strict';
    var oldOnClick, self = this;


    /**
     * Whether a click is currently being tracked.
     *
     * @type boolean
     */
    this.trackingClick = false;


    /**
     * Timestamp for when when click tracking started.
     *
     * @type number
     */
    this.trackingClickStart = 0;


    /**
     * The element being tracked for a click.
     *
     * @type EventTarget
     */
    this.targetElement = null;


    /**
     * X-coordinate of touch start event.
     *
     * @type number
     */
    this.touchStartX = 0;


    /**
     * Y-coordinate of touch start event.
     *
     * @type number
     */
    this.touchStartY = 0;


    /**
     * ID of the last touch, retrieved from Touch.identifier.
     *
     * @type number
     */
    this.lastTouchIdentifier = 0;


    /**
     * Touchmove boundary, beyond which a click will be cancelled.
     *
     * @type number
     */
    this.touchBoundary = 10;


    /**
     * The FastClick layer.
     *
     * @type Element
     */
    this.layer = layer;

    if (!layer || !layer.nodeType) {
        throw new TypeError('Layer must be a document node');
    }

    /** @type function() */
    this.onClick = function() { return FastClick.prototype.onClick.apply(self, arguments); };

    /** @type function() */
    this.onMouse = function() { return FastClick.prototype.onMouse.apply(self, arguments); };

    /** @type function() */
    this.onTouchStart = function() { return FastClick.prototype.onTouchStart.apply(self, arguments); };

    /** @type function() */
    this.onTouchMove = function() { return FastClick.prototype.onTouchMove.apply(self, arguments); };

    /** @type function() */
    this.onTouchEnd = function() { return FastClick.prototype.onTouchEnd.apply(self, arguments); };

    /** @type function() */
    this.onTouchCancel = function() { return FastClick.prototype.onTouchCancel.apply(self, arguments); };

    if (FastClick.notNeeded(layer)) {
        return;
    }

    // Set up event handlers as required
    if (this.deviceIsAndroid) {
        layer.addEventListener('mouseover', this.onMouse, true);
        layer.addEventListener('mousedown', this.onMouse, true);
        layer.addEventListener('mouseup', this.onMouse, true);
    }

    layer.addEventListener('click', this.onClick, true);
    layer.addEventListener('touchstart', this.onTouchStart, false);
    layer.addEventListener('touchmove', this.onTouchMove, false);
    layer.addEventListener('touchend', this.onTouchEnd, false);
    layer.addEventListener('touchcancel', this.onTouchCancel, false);

    // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
    // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
    // layer when they are cancelled.
    if (!Event.prototype.stopImmediatePropagation) {
        layer.removeEventListener = function(type, callback, capture) {
            var rmv = Node.prototype.removeEventListener;
            if (type === 'click') {
                rmv.call(layer, type, callback.hijacked || callback, capture);
            } else {
                rmv.call(layer, type, callback, capture);
            }
        };

        layer.addEventListener = function(type, callback, capture) {
            var adv = Node.prototype.addEventListener;
            if (type === 'click') {
                adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
                    if (!event.propagationStopped) {
                        callback(event);
                    }
                }), capture);
            } else {
                adv.call(layer, type, callback, capture);
            }
        };
    }

    // If a handler is already declared in the element's onclick attribute, it will be fired before
    // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
    // adding it as listener.
    if (typeof layer.onclick === 'function') {

        // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
        // - the old one won't work if passed to addEventListener directly.
        oldOnClick = layer.onclick;
        layer.addEventListener('click', function(event) {
            oldOnClick(event);
        }, false);
        layer.onclick = null;
    }
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS4 = FastClick.prototype.deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOSWithBadTarget = FastClick.prototype.deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);


/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
    'use strict';
    switch (target.nodeName.toLowerCase()) {

    // Don't send a synthetic click to disabled inputs (issue #62)
    case 'button':
    case 'select':
    case 'textarea':
        if (target.disabled) {
            return true;
        }

        break;
    case 'input':

        // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
        if ((this.deviceIsIOS && target.type === 'file') || target.disabled) {
            return true;
        }

        break;
    case 'label':
    case 'video':
        return true;
    }

    return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
    'use strict';
    switch (target.nodeName.toLowerCase()) {
    case 'textarea':
        return true;
    case 'select':
        return !this.deviceIsAndroid;
    case 'input':
        switch (target.type) {
        case 'button':
        case 'checkbox':
        case 'file':
        case 'image':
        case 'radio':
        case 'submit':
            return false;
        }

        // No point in attempting to focus disabled inputs
        return !target.disabled && !target.readOnly;
    default:
        return (/\bneedsfocus\b/).test(target.className);
    }
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
    'use strict';
    var clickEvent, touch;

    // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
    if (document.activeElement && document.activeElement !== targetElement) {
        document.activeElement.blur();
    }

    touch = event.changedTouches[0];

    // Synthesise a click event, with an extra attribute so it can be tracked
    clickEvent = document.createEvent('MouseEvents');
    clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
    clickEvent.forwardedTouchEvent = true;
    targetElement.dispatchEvent(clickEvent);
};

FastClick.prototype.determineEventType = function(targetElement) {
    'use strict';

    //Issue #159: Android Chrome Select Box does not open with a synthetic click event
    if (this.deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
        return 'mousedown';
    }

    return 'click';
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
    'use strict';
    var length;

    // Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
    if (this.deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
        length = targetElement.value.length;
        targetElement.setSelectionRange(length, length);
    } else {
        targetElement.focus();
    }
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
    'use strict';
    var scrollParent, parentElement;

    scrollParent = targetElement.fastClickScrollParent;

    // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
    // target element was moved to another parent.
    if (!scrollParent || !scrollParent.contains(targetElement)) {
        parentElement = targetElement;
        do {
            if (parentElement.scrollHeight > parentElement.offsetHeight) {
                scrollParent = parentElement;
                targetElement.fastClickScrollParent = parentElement;
                break;
            }

            parentElement = parentElement.parentElement;
        } while (parentElement);
    }

    // Always update the scroll top tracker if possible.
    if (scrollParent) {
        scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
    }
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
    'use strict';

    // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
    if (eventTarget.nodeType === Node.TEXT_NODE) {
        return eventTarget.parentNode;
    }

    return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
    'use strict';
    var targetElement, touch, selection;

    // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
    if (event.targetTouches.length > 1) {
        return true;
    }

    targetElement = this.getTargetElementFromEventTarget(event.target);
    touch = event.targetTouches[0];

    if (this.deviceIsIOS) {

        // Only trusted events will deselect text on iOS (issue #49)
        selection = window.getSelection();
        if (selection.rangeCount && !selection.isCollapsed) {
            return true;
        }

        if (!this.deviceIsIOS4) {

            // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
            // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
            // with the same identifier as the touch event that previously triggered the click that triggered the alert.
            // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
            // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
            if (touch.identifier === this.lastTouchIdentifier) {
                event.preventDefault();
                return false;
            }

            this.lastTouchIdentifier = touch.identifier;

            // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
            // 1) the user does a fling scroll on the scrollable layer
            // 2) the user stops the fling scroll with another tap
            // then the event.target of the last 'touchend' event will be the element that was under the user's finger
            // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
            // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
            this.updateScrollParent(targetElement);
        }
    }

    this.trackingClick = true;
    this.trackingClickStart = event.timeStamp;
    this.targetElement = targetElement;

    this.touchStartX = touch.pageX;
    this.touchStartY = touch.pageY;

    // Prevent phantom clicks on fast double-tap (issue #36)
    if ((event.timeStamp - this.lastClickTime) < 200) {
        event.preventDefault();
    }

    return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
    'use strict';
    var touch = event.changedTouches[0], boundary = this.touchBoundary;

    if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
        return true;
    }

    return false;
};


/**
 * Update the last position.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchMove = function(event) {
    'use strict';
    if (!this.trackingClick) {
        return true;
    }

    // If the touch has moved, cancel the click tracking
    if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
        this.trackingClick = false;
        this.targetElement = null;
    }

    return true;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
    'use strict';

    // Fast path for newer browsers supporting the HTML5 control attribute
    if (labelElement.control !== undefined) {
        return labelElement.control;
    }

    // All browsers under test that support touch events also support the HTML5 htmlFor attribute
    if (labelElement.htmlFor) {
        return document.getElementById(labelElement.htmlFor);
    }

    // If no for attribute exists, attempt to retrieve the first labellable descendant element
    // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
    return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
    'use strict';
    var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

    if (!this.trackingClick) {
        return true;
    }

    // Prevent phantom clicks on fast double-tap (issue #36)
    if ((event.timeStamp - this.lastClickTime) < 200) {
        this.cancelNextClick = true;
        return true;
    }

    // Reset to prevent wrong click cancel on input (issue #156).
    this.cancelNextClick = false;

    this.lastClickTime = event.timeStamp;

    trackingClickStart = this.trackingClickStart;
    this.trackingClick = false;
    this.trackingClickStart = 0;

    // On some iOS devices, the targetElement supplied with the event is invalid if the layer
    // is performing a transition or scroll, and has to be re-detected manually. Note that
    // for this to function correctly, it must be called *after* the event target is checked!
    // See issue #57; also filed as rdar://13048589 .
    if (this.deviceIsIOSWithBadTarget) {
        touch = event.changedTouches[0];

        // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
        targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
        targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
    }

    targetTagName = targetElement.tagName.toLowerCase();
    if (targetTagName === 'label') {
        forElement = this.findControl(targetElement);
        if (forElement) {
            this.focus(targetElement);
            if (this.deviceIsAndroid) {
                return false;
            }

            targetElement = forElement;
        }
    } else if (this.needsFocus(targetElement)) {

        // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
        // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
        if ((event.timeStamp - trackingClickStart) > 100 || (this.deviceIsIOS && window.top !== window && targetTagName === 'input')) {
            this.targetElement = null;
            return false;
        }

        this.focus(targetElement);

        // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
        if (!this.deviceIsIOS4 || targetTagName !== 'select') {
            this.targetElement = null;
            event.preventDefault();
        }

        return false;
    }

    if (this.deviceIsIOS && !this.deviceIsIOS4) {

        // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
        // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
        scrollParent = targetElement.fastClickScrollParent;
        if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
            return true;
        }
    }

    // Prevent the actual click from going though - unless the target node is marked as requiring
    // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
    if (!this.needsClick(targetElement)) {
        event.preventDefault();
        this.sendClick(targetElement, event);
    }

    return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
    'use strict';
    this.trackingClick = false;
    this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
    'use strict';

    // If a target element was never set (because a touch event was never fired) allow the event
    if (!this.targetElement) {
        return true;
    }

    if (event.forwardedTouchEvent) {
        return true;
    }

    // Programmatically generated events targeting a specific element should be permitted
    if (!event.cancelable) {
        return true;
    }

    // Derive and check the target element to see whether the mouse event needs to be permitted;
    // unless explicitly enabled, prevent non-touch click events from triggering actions,
    // to prevent ghost/doubleclicks.
    if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

        // Prevent any user-added listeners declared on FastClick element from being fired.
        if (event.stopImmediatePropagation) {
            event.stopImmediatePropagation();
        } else {

            // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
            event.propagationStopped = true;
        }

        // Cancel the event
        event.stopPropagation();
        event.preventDefault();

        return false;
    }

    // If the mouse event is permitted, return true for the action to go through.
    return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
    'use strict';
    var permitted;

    // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
    if (this.trackingClick) {
        this.targetElement = null;
        this.trackingClick = false;
        return true;
    }

    // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
    if (event.target.type === 'submit' && event.detail === 0) {
        return true;
    }

    permitted = this.onMouse(event);

    // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
    if (!permitted) {
        this.targetElement = null;
    }

    // If clicks are permitted, return true for the action to go through.
    return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
    'use strict';
    var layer = this.layer;

    if (this.deviceIsAndroid) {
        layer.removeEventListener('mouseover', this.onMouse, true);
        layer.removeEventListener('mousedown', this.onMouse, true);
        layer.removeEventListener('mouseup', this.onMouse, true);
    }

    layer.removeEventListener('click', this.onClick, true);
    layer.removeEventListener('touchstart', this.onTouchStart, false);
    layer.removeEventListener('touchmove', this.onTouchMove, false);
    layer.removeEventListener('touchend', this.onTouchEnd, false);
    layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


/**
 * Check whether FastClick is needed.
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.notNeeded = function(layer) {
    'use strict';
    var metaViewport;

    // Devices that don't support touch don't need FastClick
    if (typeof window.ontouchstart === 'undefined') {
        return true;
    }

    if ((/Chrome\/[0-9]+/).test(navigator.userAgent)) {

        // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
        if (FastClick.prototype.deviceIsAndroid) {
            metaViewport = document.querySelector('meta[name=viewport]');
            if (metaViewport && metaViewport.content.indexOf('user-scalable=no') !== -1) {
                return true;
            }

        // Chrome desktop doesn't need FastClick (issue #15)
        } else {
            return true;
        }
    }

    // IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
    if (layer.style.msTouchAction === 'none') {
        return true;
    }

    return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.attach = function(layer) {
    'use strict';
    return new FastClick(layer);
};


if (typeof define !== 'undefined' && define.amd) {

    // AMD. Register as an anonymous module.
    define(function() {
        'use strict';
        return FastClick;
    });
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = FastClick.attach;
    module.exports.FastClick = FastClick;
} else {
    window.FastClick = FastClick;
}

// Polyfill for requestAnimationFrame
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
;(function(){
    var store = {},
        win = window,
        doc = win.document,
        localStorageName = 'localStorage',
        namespace = '__storejs__',
        storage

    store.disabled = false
    store.set = function(key, value) {}
    store.get = function(key) {}
    store.remove = function(key) {}
    store.clear = function() {}
    store.transact = function(key, defaultVal, transactionFn) {
        var val = store.get(key)
        if (transactionFn == null) {
            transactionFn = defaultVal
            defaultVal = null
        }
        if (typeof val == 'undefined') { val = defaultVal || {} }
        transactionFn(val)
        store.set(key, val)
    }
    store.getAll = function() {}

    store.serialize = function(value) {
        return JSON.stringify(value)
    }
    store.deserialize = function(value) {
        if (typeof value != 'string') { return undefined }
        try { return JSON.parse(value) }
        catch(e) { return value || undefined }
    }

    // Functions to encapsulate questionable FireFox 3.6.13 behavior
    // when about.config::dom.storage.enabled === false
    // See https://github.com/marcuswestin/store.js/issues#issue/13
    function isLocalStorageNameSupported() {
        try { return (localStorageName in win && win[localStorageName]) }
        catch(err) { return false }
    }

    if (isLocalStorageNameSupported()) {
        storage = win[localStorageName]
        store.set = function(key, val) {
            if (val === undefined) { return store.remove(key) }
            storage.setItem(key, store.serialize(val))
            return val
        }
        store.get = function(key) { return store.deserialize(storage.getItem(key)) }
        store.remove = function(key) { storage.removeItem(key) }
        store.clear = function() { storage.clear() }
        store.getAll = function() {
            var ret = {}
            for (var i=0; i<storage.length; ++i) {
                var key = storage.key(i)
                ret[key] = store.get(key)
            }
            return ret
        }
    } else if (doc.documentElement.addBehavior) {
        var storageOwner,
            storageContainer
        // Since #userData storage applies only to specific paths, we need to
        // somehow link our data to a specific path.  We choose /favicon.ico
        // as a pretty safe option, since all browsers already make a request to
        // this URL anyway and being a 404 will not hurt us here.  We wrap an
        // iframe pointing to the favicon in an ActiveXObject(htmlfile) object
        // (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
        // since the iframe access rules appear to allow direct access and
        // manipulation of the document element, even for a 404 page.  This
        // document can be used instead of the current document (which would
        // have been limited to the current path) to perform #userData storage.
        try {
            storageContainer = new ActiveXObject('htmlfile')
            storageContainer.open()
            storageContainer.write('<s' + 'cript>document.w=window</s' + 'cript><iframe src="/favicon.ico"></frame>')
            storageContainer.close()
            storageOwner = storageContainer.w.frames[0].document
            storage = storageOwner.createElement('div')
        } catch(e) {
            // somehow ActiveXObject instantiation failed (perhaps some special
            // security settings or otherwse), fall back to per-path storage
            storage = doc.createElement('div')
            storageOwner = doc.body
        }
        function withIEStorage(storeFunction) {
            return function() {
                var args = Array.prototype.slice.call(arguments, 0)
                args.unshift(storage)
                // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
                // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
                storageOwner.appendChild(storage)
                storage.addBehavior('#default#userData')
                storage.load(localStorageName)
                var result = storeFunction.apply(store, args)
                storageOwner.removeChild(storage)
                return result
            }
        }

        // In IE7, keys may not contain special chars. See all of https://github.com/marcuswestin/store.js/issues/40
        var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
        function ieKeyFix(key) {
            return key.replace(forbiddenCharsRegex, '___')
        }
        store.set = withIEStorage(function(storage, key, val) {
            key = ieKeyFix(key)
            if (val === undefined) { return store.remove(key) }
            storage.setAttribute(key, store.serialize(val))
            storage.save(localStorageName)
            return val
        })
        store.get = withIEStorage(function(storage, key) {
            key = ieKeyFix(key)
            return store.deserialize(storage.getAttribute(key))
        })
        store.remove = withIEStorage(function(storage, key) {
            key = ieKeyFix(key)
            storage.removeAttribute(key)
            storage.save(localStorageName)
        })
        store.clear = withIEStorage(function(storage) {
            var attributes = storage.XMLDocument.documentElement.attributes
            storage.load(localStorageName)
            for (var i=0, attr; attr=attributes[i]; i++) {
                storage.removeAttribute(attr.name)
            }
            storage.save(localStorageName)
        })
        store.getAll = withIEStorage(function(storage) {
            var attributes = storage.XMLDocument.documentElement.attributes
            var ret = {}
            for (var i=0, attr; attr=attributes[i]; ++i) {
                var key = ieKeyFix(attr.name)
                ret[attr.name] = store.deserialize(storage.getAttribute(key))
            }
            return ret
        })
    }

    try {
        store.set(namespace, namespace)
        if (store.get(namespace) != namespace) { store.disabled = true }
        store.remove(namespace)
    } catch(e) {
        store.disabled = true
    }
    store.enabled = !store.disabled
    if (typeof module != 'undefined' && module.exports) { module.exports = store }
    else if (typeof define === 'function' && define.amd) { define(store) }
    else { this.store = store }
})();
})(window);