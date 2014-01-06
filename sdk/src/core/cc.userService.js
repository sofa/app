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
