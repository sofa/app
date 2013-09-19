cc.define('cc.UserService', function(storageService, configService){

    'use strict';

    var self = {},
        STORE_PREFIX = 'basketService_',
        STORE_INVOICE_ADDRESS_KEY = STORE_PREFIX + 'invoiceAddress',
        STORE_SHIPPING_ADDRESS_KEY = STORE_PREFIX + 'shippingAddress';

    /**
     * Gets the invoice address for the user
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
     * Creates/Updates the invoice address for the user
     */
    self.updateInvoiceAddress = function(invoiceAddress){
        return storageService.set(STORE_INVOICE_ADDRESS_KEY, invoiceAddress);
    };

    /**
     * Gets the shipping address for the user
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
     * Creates/Updates the shipping address for the user
     */
    self.updateShippingAddress = function(invoiceAddress){
        return storageService.set(STORE_SHIPPING_ADDRESS_KEY, invoiceAddress);
    };

    return self;
});