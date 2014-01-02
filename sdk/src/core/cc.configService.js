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
