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
