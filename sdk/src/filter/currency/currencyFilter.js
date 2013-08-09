angular
    .module('sdk.filter.currency', [])
    .filter('currency', function(){


        //the currency can be specified by either the html entity,
        //the symbol or the shorthand name
        var currencyMap = {
            EUR: {
                synonyms: ['&euro;', '€', 'EUR'],
                character: '\u20AC'
            },
            USD: { 
                synonyms: ['&&#36;', '$', 'USD'],
                character: '\u0024'
            },
            GBP: {
                synonyms: ['&pound;', '£', 'GBP'],
                character: '\u00A3'
            }
        };

        return function(val){

            var currency = cc.Config.currencySign || '&euro;';

            var currencyKey = cc.Util.findKey(currencyMap, function(item){
                                    return item.synonyms.indexOf(currency) > -1; 
                                }) || 'EUR';

            var currencyChar = currencyMap[currencyKey].character;

            var fixedVal = parseFloat(val).toFixed(2);

            if (currencyKey === 'EUR' ){
                return fixedVal.replace('.', ',') + ' ' + currencyChar;
            }
            else if (currencyKey === 'USD' || currencyKey === 'GBP'){
                return currencyChar + ' ' + fixedVal;
            }
            else{
                return fixedVal;
            }
        };
    });
