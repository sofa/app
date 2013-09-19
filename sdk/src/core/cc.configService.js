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

    return self;
});