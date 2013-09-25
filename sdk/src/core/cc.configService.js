cc.define('cc.ConfigService', function(){

    'use strict';

    var self = {};

    /**
     * Gets an array of supported countries for shipping and invoicing 
     * 
     */
    self.getSupportedCountries = function(){
        if (!cc.Config.countries){
            //should we rather throw an exception here?
            return [];
        }

        return cc.Config.countries;
    };

    /**
     * Gets the default country for shipping and invoicing
     * 
     */
    self.getDefaultCountry = function(){
        var countries = self.getSupportedCountries();
        return countries.length === 0 ? null : countries[0];
    };

    self.getLocalizedPayPalButtonClass = function(disabled){
        return !disabled ? 'cc-paypal-button--' + self.get('locale') : 
                           'cc-paypal-button--' + self.get('locale') + '--disabled';
    };

    self.get = function(key, defaultValue){

        var value = cc.Config[key];

        if (cc.Util.isUndefined(value) && !cc.Util.isUndefined(defaultValue)){
            return defaultValue;
        }

        return value;
    };

    return self;
});