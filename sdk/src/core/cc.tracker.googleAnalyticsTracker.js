cc.define('cc.tracker.GoogleAnalyticsTracker', function(options) {
    'use strict';

    var self = {};

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

    self.trackEvent = function(eventData, $http) {

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

    return self;
});